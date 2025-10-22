import { useEffect, useRef, useState } from 'react';

interface CountdownState {
	timeLeft: number;
	phase: 'betting' | 'rolling' | 'completed' | 'waiting';
	endTime: number | null;
}

export const useRouletteCountdown = (socket: any) => {
	const [countdown, setCountdown] = useState<CountdownState>({
		timeLeft: 0,
		phase: 'waiting',
		endTime: null,
	});

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const serverTimeOffset = useRef<number>(0);
	const hasRequestedState = useRef<boolean>(false);

	const clearCountdown = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const startCountdown = (
		endTime: number,
		phase: 'betting' | 'rolling',
		serverTime: number,
	) => {
		clearCountdown();
		serverTimeOffset.current = serverTime - Date.now();
		const now = Date.now() + serverTimeOffset.current;
		const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

		console.log(`⏱️ Starting countdown: ${remaining}s (${phase})`);

		setCountdown({
			timeLeft: remaining,
			phase,
			endTime,
		});

		intervalRef.current = setInterval(() => {
			const now = Date.now() + serverTimeOffset.current;
			const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

			setCountdown((prev) => ({
				...prev,
				timeLeft: remaining,
			}));

			if (remaining <= 0) {
				clearCountdown();
			}
		}, 100);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Request current state on mount/reconnect
		const requestState = () => {
			if (!hasRequestedState.current && socket.connected) {
				console.log('📡 Requesting game state...');
				socket.emit('roulette:getState');
				hasRequestedState.current = true;
			}
		};

		// Request immediately if connected
		if (socket.connected) {
			requestState();
		}

		// Handle state sync from backend
		socket.on('roulette:stateSync', (data: any) => {
			console.log('🔄 State synced from backend:', data);

			if (data.bettingPhaseActive && data.bettingEndTime) {
				startCountdown(data.bettingEndTime, 'betting', data.serverTime);
			} else if (data.rollingPhaseActive && data.rollingEndTime) {
				startCountdown(data.rollingEndTime, 'rolling', data.serverTime);
			} else {
				setCountdown({
					timeLeft: 0,
					phase: 'waiting',
					endTime: null,
				});
			}
		});

		socket.on('connect', () => {
			console.log('🔌 Socket connected, requesting state...');
			hasRequestedState.current = false;
			requestState();
		});

		socket.on('roulette:gameStarting', (data: any) => {
			console.log('🎲 Game starting:', data);
			if (data.bettingEndTime && data.serverTime) {
				startCountdown(data.bettingEndTime, 'betting', data.serverTime);
			}
		});

		socket.on('roulette:rolling', (data: any) => {
			console.log('🎰 Rolling:', data);
			if (data.rollingEndTime && data.serverTime) {
				startCountdown(data.rollingEndTime, 'rolling', data.serverTime);
			}
		});

		socket.on('roulette:result', (data: any) => {
			console.log('✨ Result:', data);
			clearCountdown();
			setCountdown({
				timeLeft: 0,
				phase: 'completed',
				endTime: null,
			});
		});

		socket.on('roulette:noBets', () => {
			console.log('⚠️ No bets');
			clearCountdown();
			setCountdown({
				timeLeft: 0,
				phase: 'waiting',
				endTime: null,
			});
		});

		return () => {
			clearCountdown();
			socket.off('roulette:stateSync');
			socket.off('roulette:gameStarting');
			socket.off('roulette:rolling');
			socket.off('roulette:result');
			socket.off('roulette:noBets');
			socket.off('connect');
		};
	}, [socket]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		return () => clearCountdown();
	}, []);

	return countdown;
};
