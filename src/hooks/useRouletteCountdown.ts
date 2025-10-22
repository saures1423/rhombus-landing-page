import { useEffect, useRef, useState } from 'react';

interface CountdownState {
	timeLeft: number;
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

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const serverTimeOffset = useRef<number>(0);
	const hasRequestedState = useRef<boolean>(false);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	/**
	 * Clear countdown interval
	 */
	const clearCountdown = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	/**
	 * Clear reconnect timeout
	 */
	const clearReconnectTimeout = () => {
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}
	};

	/**
	 * Calculate server time offset for accurate countdown
	 */
	const updateServerTimeOffset = (serverTime: number) => {
		const clientTime = Date.now();
		const offset = serverTime - clientTime;

		// Only update if the difference is significant (> 100ms)
		if (Math.abs(offset - serverTimeOffset.current) > 100) {
			serverTimeOffset.current = offset;
			console.log(`🕐 Server time offset updated: ${offset}ms`);
		}
	};

	/**
	 * Get current synchronized time
	 */
	const getSyncedTime = () => Date.now() + serverTimeOffset.current;

	/**
	 * Start countdown with end time
	 */
	const startCountdown = (
		endTime: number,
		phase: 'betting' | 'rolling',
		serverTime: number,
		roundId?: string | null,
		betsCount?: number,
	) => {
		clearCountdown();

		// Update server time offset
		updateServerTimeOffset(serverTime);

		const now = getSyncedTime();
		const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

		console.log(`⏱️ Starting ${phase} countdown: ${remaining}s`, {
			endTime: new Date(endTime).toISOString(),
			serverTime: new Date(serverTime).toISOString(),
			clientTime: new Date(Date.now()).toISOString(),
			offset: serverTimeOffset.current,
		});

		setCountdown({
			timeLeft: remaining,
			phase,
			endTime,
			roundId: roundId || null,
			betsCount: betsCount || 0,
		});

		// Update countdown every 100ms for smooth display
		intervalRef.current = setInterval(() => {
			const now = getSyncedTime();
			const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

			setCountdown((prev) => ({
				...prev,
				timeLeft: remaining,
			}));

			// Auto-clear when countdown reaches 0
			if (remaining <= 0) {
				console.log(`⏰ ${phase} countdown ended`);
				clearCountdown();
			}
		}, 100);
	};

	/**
	 * Request current game state from server
	 */
	const requestGameState = () => {
		if (socket.connected) {
			console.log('📡 Requesting game state...');
			socket.emit('roulette:getState');
			hasRequestedState.current = true;
		}
	};

	/**
	 * Handle state synchronization from backend
	 */
	const handleStateSync = (data: any) => {
		console.log('🔄 State synced from backend:', data);

		// Update server time offset
		if (data.serverTime) {
			updateServerTimeOffset(data.serverTime);
		}

		// Handle stopped game
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

		// Sync based on current phase
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
			// Idle or waiting phase
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Request state on mount if connected
		if (socket.connected && !hasRequestedState.current) {
			requestGameState();
		}

		// ============================================
		// SOCKET EVENT HANDLERS
		// ============================================

		/**
		 * Handle socket connection
		 */
		socket.on('connect', () => {
			console.log('🔌 Socket connected');
			hasRequestedState.current = false;

			// Request state after a short delay to ensure server is ready
			clearReconnectTimeout();
			reconnectTimeoutRef.current = setTimeout(() => {
				requestGameState();
			}, 500);
		});

		/**
		 * Handle socket disconnection
		 */
		socket.on('disconnect', () => {
			console.log('🔌 Socket disconnected');
			clearCountdown();
			clearReconnectTimeout();
			hasRequestedState.current = false;

			setCountdown({
				timeLeft: 0,
				phase: 'waiting',
				endTime: null,
				roundId: null,
				betsCount: 0,
			});
		});

		/**
		 * Handle state sync response
		 */
		socket.on('roulette:stateSync', handleStateSync);

		/**
		 * Handle game starting (betting phase begins)
		 */
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

		/**
		 * Handle round created (when first bet is placed)
		 */
		socket.on('roulette:roundCreated', (data: any) => {
			console.log('🎰 Round created:', data);

			setCountdown((prev) => ({
				...prev,
				roundId: data.roundId,
			}));
		});

		/**
		 * Handle bet placed (update bets count)
		 */
		socket.on('roulette:betPlaced', (data: any) => {
			console.log('💰 Bet placed:', data);

			setCountdown((prev) => ({
				...prev,
				betsCount: (prev.betsCount || 0) + 1,
			}));
		});

		/**
		 * Handle rolling phase
		 */
		socket.on('roulette:rolling', (data: any) => {
			console.log('🎰 Rolling:', data);

			if (data.rollingEndTime && data.serverTime) {
				startCountdown(
					data.rollingEndTime,
					'rolling',
					data.serverTime,
					countdown.roundId,
					countdown.betsCount,
				);
			}
		});

		/**
		 * Handle result
		 */
		socket.on('roulette:result', (data: any) => {
			console.log('✨ Result:', data);

			clearCountdown();
			setCountdown({
				timeLeft: 0,
				phase: 'completed',
				endTime: null,
				roundId: data.roundId || null,
				betsCount: countdown.betsCount,
			});
		});

		/**
		 * Handle no bets case
		 */
		socket.on('roulette:noBets', (data: any) => {
			console.log('⚠️ No bets placed', data);

			clearCountdown();
			setCountdown({
				timeLeft: 0,
				phase: 'waiting',
				endTime: null,
				roundId: null,
				betsCount: 0,
			});
		});

		// Cleanup on unmount
		return () => {
			clearCountdown();
			clearReconnectTimeout();

			socket.off('connect');
			socket.off('disconnect');
			socket.off('roulette:stateSync');
			socket.off('roulette:gameStarting');
			socket.off('roulette:roundCreated');
			socket.off('roulette:betPlaced');
			socket.off('roulette:rolling');
			socket.off('roulette:result');
			socket.off('roulette:noBets');
		};
	}, [socket]);

	// Cleanup on unmount
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		return () => {
			clearCountdown();
			clearReconnectTimeout();
		};
	}, []);

	return countdown;
};
