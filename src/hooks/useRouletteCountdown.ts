import { useEffect, useRef, useState } from 'react';

interface CountdownState {
	timeLeft: number; // seconds (can be fractional)
	phase: 'idle' | 'betting' | 'rolling' | 'completed' | 'waiting';
	endTime: number | null;
	roundId: string | null;
	betsCount: number;
}

export const useRouletteCountdown = (socket: any) => {
	const [countdown, setCountdown] = useState<CountdownState>({
		timeLeft: 0,
		phase: 'waiting',
		endTime: null,
		roundId: null,
		betsCount: 0,
	});

	const countdownRef = useRef(countdown);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const serverTimeOffset = useRef<number>(0);
	const hasRequestedState = useRef<boolean>(false);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		countdownRef.current = countdown;
	}, [countdown]);

	// --- Helpers ----------------------------------------------------

	const clearCountdown = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const clearReconnectTimeout = () => {
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}
	};

	const updateServerTimeOffset = (serverTime: number) => {
		const clientTime = Date.now();
		const offset = serverTime - clientTime;
		serverTimeOffset.current = offset;
	};

	const getSyncedTime = () => Date.now() + serverTimeOffset.current;

	// --- Countdown logic (ms precision) -----------------------------

	const startCountdown = (
		endTime: number,
		phase: 'betting' | 'rolling',
		serverTime: number,
		roundId?: string | null,
		betsCount?: number,
	) => {
		clearCountdown();
		updateServerTimeOffset(serverTime);

		const now = getSyncedTime();
		const remaining = Math.max(0, (endTime - now) / 1000);

		console.log(
			`⏱️ ${phase.toUpperCase()} countdown started: ${remaining.toFixed(2)}s left`,
		);

		setCountdown({
			timeLeft: remaining,
			phase,
			endTime,
			roundId: roundId || null,
			betsCount: betsCount || 0,
		});

		intervalRef.current = setInterval(() => {
			const now = getSyncedTime();
			const remaining = Math.max(0, (endTime - now) / 1000);

			setCountdown((prev) => ({
				...prev,
				timeLeft: remaining,
			}));

			if (remaining <= 0) {
				clearCountdown();
			}
		}, 100);
	};

	const requestGameState = () => {
		if (socket.connected) {
			console.log('📡 Requesting roulette state');
			socket.emit('roulette:getState');
			hasRequestedState.current = true;
		}
	};

	const handleStateSync = (data: any) => {
		console.log('🔄 Backend state sync:', data);
		if (data.serverTime) updateServerTimeOffset(data.serverTime);

		if (data.stopped) {
			clearCountdown();
			setCountdown({
				timeLeft: 0,
				phase: 'waiting',
				endTime: null,
				roundId: null,
				betsCount: 0,
			});
			return;
		}

		if (data.phase === 'betting' && data.bettingEndTime) {
			startCountdown(
				data.bettingEndTime,
				'betting',
				data.serverTime,
				data.roundId,
				data.betsCount,
			);
		} else if (data.phase === 'rolling' && data.rollingEndTime) {
			startCountdown(
				data.rollingEndTime,
				'rolling',
				data.serverTime,
				data.roundId,
				data.betsCount,
			);
		} else if (data.phase === 'completed') {
			clearCountdown();
			setCountdown({
				timeLeft: 0,
				phase: 'completed',
				endTime: null,
				roundId: data.roundId || null,
				betsCount: data.betsCount || 0,
			});
		} else {
			clearCountdown();
			setCountdown({
				timeLeft: 0,
				phase: data.phase || 'waiting',
				endTime: null,
				roundId: data.roundId || null,
				betsCount: data.betsCount || 0,
			});
		}
	};

	// --- Socket handling --------------------------------------------

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (socket.connected && !hasRequestedState.current) requestGameState();

		socket.on('connect', () => {
			console.log('🔌 Socket connected');
			hasRequestedState.current = false;
			clearReconnectTimeout();
			reconnectTimeoutRef.current = setTimeout(requestGameState, 500);
		});

		socket.on('disconnect', () => {
			console.log('🔌 Socket disconnected');
			clearCountdown();
			setCountdown({
				timeLeft: 0,
				phase: 'waiting',
				endTime: null,
				roundId: null,
				betsCount: 0,
			});
		});

		socket.on('roulette:stateSync', handleStateSync);

		socket.on('roulette:gameStarting', (data: any) => {
			console.log('🎲 Game starting:', data);
			if (data.bettingEndTime && data.serverTime) {
				startCountdown(
					data.bettingEndTime,
					'betting',
					data.serverTime,
					data.roundId,
				);
			}
		});

		socket.on('roulette:rolling', (data: any) => {
			console.log('🎰 Rolling phase:', data);

			// Immediately trust backend phase transition
			if (data.rollingEndTime && data.serverTime) {
				startCountdown(
					data.rollingEndTime,
					'rolling',
					data.serverTime,
					countdownRef.current.roundId,
					countdownRef.current.betsCount,
				);
			}
		});

		socket.on('roulette:result', (data: any) => {
			console.log('✨ Result:', data);
			clearCountdown();
			setCountdown({
				timeLeft: 0,
				phase: 'completed',
				endTime: null,
				roundId: data.roundId || null,
				betsCount: countdownRef.current.betsCount,
			});
		});

		socket.on('roulette:noBets', () => {
			console.log('⚠️ No bets placed');
			clearCountdown();
			setCountdown({
				timeLeft: 0,
				phase: 'waiting',
				endTime: null,
				roundId: null,
				betsCount: 0,
			});
		});

		return () => {
			clearCountdown();
			clearReconnectTimeout();
			socket.off('connect');
			socket.off('disconnect');
			socket.off('roulette:stateSync');
			socket.off('roulette:gameStarting');
			socket.off('roulette:rolling');
			socket.off('roulette:result');
			socket.off('roulette:noBets');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	return countdown;
};
