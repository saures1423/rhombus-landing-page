import { useRouletteCountdown } from '@/hooks/useRouletteCountdown';
import { useEffect, useState } from 'react';

interface RouletteGameProps {
	balance: number;
	socket: any;
}

const RouletteGame = ({ socket, balance }: RouletteGameProps) => {
	const countdown = useRouletteCountdown(socket);

	const [roulette, setRoulette] = useState<{
		result: string | null;
		wheelOffset: number;
		isSpinning: boolean;
		history: string[];
		animationKey: number;
		placedBets: Record<string, number>;
		earlyResult: string | null; // NEW: Store early result
	}>({
		result: null,
		wheelOffset: 0,
		isSpinning: false,
		history: [],
		animationKey: 0,
		placedBets: {},
		earlyResult: null, // NEW
	});

	const [betPlacedLoading, setBetPlacedLoading] = useState<boolean>(false);
	const [removingBet, setRemovingBet] = useState<boolean>(false);
	const [betInputAmount, setBetInputAmount] = useState<number>(1);

	const colors = {
		black: { label: 'BLACK', multiplier: 2, color: '#4a4a4a', symbol: '♠' },
		gold: { label: 'GOLD', multiplier: 14, color: '#d4af37', symbol: '⚡' },
		blue: { label: 'BLUE', multiplier: 2, color: '#3b82f6', symbol: '◆' },
		bait: { label: 'BAIT', multiplier: 7, color: '#0ea5e9', symbol: '🎣' },
	};

	const colorSequence = [
		'black',
		'blue',
		'black',
		'blue',
		'black',
		'gold',
		'black',
		'bait',
		'black',
		'blue',
	];

	const placedTotalBet = roulette.placedBets
		? Object.values(roulette.placedBets).reduce((a, b) => a + b, 0)
		: 0;

	// Calculate potential win for placed bets
	const calculatePotentialWin = () => {
		if (!roulette.placedBets) return {};

		const potentials: Record<string, number> = {};
		for (const [color, amount] of Object.entries(roulette.placedBets)) {
			if (amount > 0) {
				potentials[color] =
					amount * colors[color as keyof typeof colors].multiplier;
			}
		}
		return potentials;
	};

	const potentialWins = calculatePotentialWin();

	useEffect(() => {
		// ============================================
		// SOCKET EVENT HANDLERS
		// ============================================

		// emit this get the userbet if exist
		socket.emit('roulette:getUserBet', {});

		socket.on('roulette:userBet', (data: any) => {
			if (!data?.success || !data?.bet) return;

			const { bet } = data;

			setRoulette((prev) => ({
				...prev,
				placedBets: bet.selectedColors,
			}));

			console.log('🎯 Synced bet from server:', bet);
		});

		const handleGameStarting = (data: any) => {
			console.log('🎲 Game starting:', data);
			setRoulette((prev) => ({
				...prev,
				result: null,
				earlyResult: null, // Reset early result
				isSpinning: false,
				wheelOffset: 0,
				placedBets: null,
				animationKey: prev.animationKey + 1,
			}));
		};

		const handleBetConfirmed = (data: any) => {
			console.log('✅ Bet Confirmed successfully', data);

			if (data.success) {
				setBetPlacedLoading(false);
			}
		};

		const handleBetRemoved = (data: any) => {
			console.log('Bet removed:', data);

			if (data.success) {
				setRemovingBet(false);

				setRoulette((prev) => ({
					...prev,
					placedBets: {},
				}));
			}
		};

		const handleRolling = (data: any) => {
			console.log('🎰 Rolling started:', data);

			// Reset state and prepare for spinning
			setRoulette((prev) => ({
				...prev,
				isSpinning: true,
				wheelOffset: 0,
				result: null,
				earlyResult: null,
				// animationKey: prev.animationKey + 1,
			}));

			// Start the initial fast spin immediately after state updates
			// Use requestAnimationFrame to ensure state update has been applied
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					const itemWidth = 128;
					const loopOffset = itemWidth * colorSequence.length * 6;

					setRoulette((prev) => ({
						...prev,
						wheelOffset: loopOffset,
					}));
				});
			});
		};

		// NEW HANDLER: Early result (received at 10s mark)
		const handleEarlyResult = (data: any) => {
			console.log('🎯 Early result received (10s mark):', data);

			const itemWidth = 128;
			const winningIndex = colorSequence.indexOf(data.winningColor);

			if (winningIndex === -1) {
				console.error('Invalid winning color:', data.winningColor);
				return;
			}

			const fullLoops = 5;
			const middleSequenceStart = 3;
			const centerOffset = 64;

			const finalOffset =
				(fullLoops * colorSequence.length +
					middleSequenceStart * colorSequence.length +
					winningIndex) *
					itemWidth +
				centerOffset;

			// First, set the early result (this changes the CSS class)
			setRoulette((prev) => ({
				...prev,
				isSpinning: true,
				earlyResult: data.winningColor,
			}));

			// Then, apply the new offset after the class change has been rendered
			// This ensures the 'landing' transition is active when offset changes
			requestAnimationFrame(() => {
				setRoulette((prev) => ({
					...prev,
					wheelOffset: finalOffset,
				}));
			});

			console.log('🎯 Landing animation started toward:', data.winningColor);
		};

		// MODIFIED HANDLER: Final result (received at 15s mark)
		const handleResult = (data: any) => {
			console.log('✨ Final result received (15s mark):', data);

			// By now the wheel should have landed, just update state
			setRoulette((prev) => ({
				...prev,
				isSpinning: false,
				result: data.winningColor,
				history: [data.winningColor, ...prev.history.slice(0, 99)],
			}));
		};

		const handleHistory = (data: any) => {
			console.log('📜 History received:', data);
			setRoulette((prev) => ({
				...prev,
				history: data.results || [],
			}));
		};

		const handleNoBets = (data: any) => {
			console.log('⚠️ No bets placed', data);
			setRoulette((prev) => ({
				...prev,
				placedBets: null,
				isSpinning: false,
			}));
		};

		const handleGameStopped = (data: any) => {
			console.log('🛑 Game stopped:', data);
			setRoulette({
				result: null,
				wheelOffset: 0,
				isSpinning: false,
				history: [],
				animationKey: 0,
				placedBets: null,
				earlyResult: null,
			});
		};

		const handleBetPlaced = (data: any) => {
			console.log('💵 Bet placed:', data);
		};

		socket.emit('roulette:getHistory');

		socket.on('roulette:gameStarting', handleGameStarting);
		socket.on('roulette:betConfirmed', handleBetConfirmed);
		socket.on('roulette:betRemoved', handleBetRemoved);
		socket.on('roulette:betPlaced', handleBetPlaced);
		socket.on('roulette:rolling', handleRolling);
		socket.on('roulette:earlyResult', handleEarlyResult); // NEW
		socket.on('roulette:result', handleResult);
		socket.on('roulette:history', handleHistory);
		socket.on('roulette:noBets', handleNoBets);
		socket.on('roulette:gameStopped', handleGameStopped);

		return () => {
			socket.off('roulette:gameStarting');
			socket.off('roulette:betConfirmed');
			socket.off('roulette:rolling');
			socket.off('roulette:earlyResult'); // NEW
			socket.off('roulette:result');
			socket.off('roulette:history');
			socket.off('roulette:noBets');
			socket.off('roulette:gameStopped');
			socket.off('roulette:betPlaced');
			socket.off('roulette:betRemoved');
			socket.off('roulette:userBet');
		};
	}, [socket]);

	const placeBetOnColor = (color: string) => {
		const betAmount = betInputAmount;

		// === Basic validation ===
		if (betAmount <= 0) {
			alert('Please enter a valid bet amount');
			return;
		}

		if (countdown.phase !== 'betting') {
			alert('Can only bet during betting phase');
			return;
		}

		// === Compute new total ===
		const newBets = {
			...(roulette.placedBets || {}),
			[color]: (roulette.placedBets?.[color] || 0) + betAmount,
		};

		const newTotal = Object.values(newBets).reduce((a, b) => a + b, 0);

		// === Check balance ===
		if (balance < newTotal) {
			alert('Insufficient balance');
			return;
		}

		// === Emit to server ===
		socket.emit('roulette:bet', {
			betAmount,
			selectedColors: { [color]: betAmount },
		});

		console.log('📤 Bet placed:', {
			betAmount,
			selectedColors: { [color]: betAmount },
		});

		// === Optimistic UI update ===
		setRoulette((prev) => ({
			...prev,
			placedBets: newBets,
		}));

		setBetPlacedLoading(true);
	};

	const removeAllBets = () => {
		if (countdown.phase !== 'betting') {
			alert('Can only remove bets during betting phase');
			return;
		}

		if (placedTotalBet === 0) {
			alert('No bets to remove');
			return;
		}

		setRemovingBet(true);

		socket.emit('roulette:removeBet', {});

		console.log('Removing all bets');
	};

	const getPhaseDisplay = () => {
		switch (countdown.phase) {
			case 'betting':
				return {
					text: '🎲 Place Your Bets',
					className: 'phase-betting',
				};
			case 'rolling':
				// Show different message if we know the result
				if (roulette.earlyResult) {
					return {
						text: 'Landing to . . .',
						className: 'phase-rolling',
					};
				}
				return {
					text: '🎰 Spinning...',
					className: 'phase-rolling',
				};
			case 'completed':
				if (roulette.result) {
					return {
						text: `${colors[roulette.result as keyof typeof colors].symbol} ${colors[roulette.result as keyof typeof colors].label} Wins!`,
						className: 'phase-completed',
					};
				}
				return {
					text: '✅ Round Complete',
					className: 'phase-completed',
				};
			case 'idle':
				return {
					text: '✅ Round Idle',
					className: 'phase-completed',
				};
			case 'waiting':
				return {
					text: '✅ Round Waiting',
					className: 'phase-completed',
				};
			default:
				return {
					text: '⏳ Waiting for Next Round...',
					className: 'phase-waiting',
				};
		}
	};

	const phaseDisplay = getPhaseDisplay();

	const wheelStyles = `
		.wheel-container {
			mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
			-webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
			position: relative;
			overflow: hidden;
		}
		
		.wheel-wrapper {
			display: flex;
			align-items: center;
			height: 100%;
			position: relative;
		}
		
		.wheel {
			display: flex;
			gap: 8px;
			will-change: transform;
		}
		


		.wheel.spinning {
			animation: continuous-spin 3s linear infinite;
		}
		
		.wheel.landing {
			transition: transform 5s cubic-bezier(0.15, 0.5, 0.2, 1);
		}
		
		.wheel.stopped {
			transition: none;
		}
		
		.wheel-item {
			min-width: 120px;
			width: 120px;
			height: 140px;
			border-radius: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 48px;
			font-weight: bold;
			flex-shrink: 0;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
			border: 2px solid rgba(255, 255, 255, 0.1);
			position: relative;
		}
		
		.center-indicator {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 4px;
			height: 120%;
			background: linear-gradient(
				to bottom, 
				transparent 0%, 
				rgba(255,215,0,0.3) 20%,
				rgba(255,215,0,1) 50%,
				rgba(255,215,0,0.3) 80%,
				transparent 100%
			);
			pointer-events: none;
			z-index: 10;
			box-shadow: 
				0 0 20px rgba(255,215,0,0.8),
				0 0 40px rgba(255,215,0,0.4);
			border-radius: 2px;
		}

		.center-indicator::before,
		.center-indicator::after {
			content: '';
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			border-left: 12px solid transparent;
			border-right: 12px solid transparent;
		}

		.center-indicator::before {
			top: -10px;
			border-bottom: 15px solid rgba(255,215,0,1);
			filter: drop-shadow(0 0 8px rgba(255,215,0,0.6));
		}

		.center-indicator::after {
			bottom: -10px;
			border-top: 15px solid rgba(255,215,0,1);
			filter: drop-shadow(0 0 8px rgba(255,215,0,0.6));
		}

		@keyframes pulse-glow {
			0%, 100% { 
				box-shadow: 0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.4);
			}
			50% { 
				box-shadow: 0 0 30px rgba(255,215,0,1), 0 0 60px rgba(255,215,0,0.6);
			}
		}

		.wheel.spinning ~ .center-indicator,
		.wheel.landing ~ .center-indicator {
			animation: pulse-glow 1s ease-in-out infinite;
		}

		.phase-indicator {
			padding: 8px 16px;
			border-radius: 20px;
			font-weight: bold;
			font-size: 14px;
			text-transform: uppercase;
			letter-spacing: 1px;
			display: inline-block;
			transition: all 0.3s ease;
		}

		.phase-betting {
			background: linear-gradient(135deg, #10b981 0%, #059669 100%);
			box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
			animation: pulse-betting 2s ease-in-out infinite;
		}

		.phase-rolling {
			background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
			box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
			animation: pulse-rolling 0.8s ease-in-out infinite;
		}

		.phase-completed {
			background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
			box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
		}

		.phase-waiting {
			background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
			box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
		}

		@keyframes pulse-betting {
			0%, 100% { transform: scale(1); }
			50% { transform: scale(1.05); }
		}

		@keyframes pulse-rolling {
			0%, 100% { transform: scale(1) rotate(0deg); }
			25% { transform: scale(1.05) rotate(-2deg); }
			75% { transform: scale(1.05) rotate(2deg); }
		}

		@keyframes continuous-spin {
  			0% { transform: translateX(0); }
  			100% { transform: translateX(-1280px); } /* 128 * 10 (your color sequence) */
		}

		.color-bet-card {
			transition: all 0.2s ease;
			cursor: pointer;
		}

		.color-bet-card:hover:not(:disabled) {
			transform: scale(1.05);
		}

		.color-bet-card:active:not(:disabled) {
			transform: scale(0.95);
		}
	`;

	function handleBetInputChange(value: string): void {
		// Allow only numbers and a single decimal point
		// handle input change
		const regex = /^\d*\.?\d*$/;
		if (value === '' || regex.test(value)) {
			const numericValue = Number.parseFloat(value);
			// biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
			if (isNaN(numericValue)) {
				setBetInputAmount(0);
			} else {
				setBetInputAmount(numericValue);
			}
		}
	}

	// Determine wheel animation class based on state
	const getWheelClass = () => {
		if (roulette.earlyResult) return 'landing';
		if (roulette.isSpinning) return 'spinning';
		return 'stopped';
	};

	return (
		<div className="space-y-4">
			<style>{wheelStyles}</style>

			<div className="flex flex-wrap justify-between items-center gap-4 bg-gray-800/50 backdrop-blur p-4 border border-gray-700 rounded-lg">
				{/* Bet Amount */}
				<div className="flex items-center gap-3">
					<span className="font-semibold text-gray-400 text-sm">
						Bet Amount
					</span>
					<div className="flex items-center gap-2 bg-gray-900/70 px-4 py-2 border border-gray-600 rounded-lg">
						<span className="text-gray-500">₱</span>
						<input
							type="text"
							value={betInputAmount}
							onChange={(e) => handleBetInputChange(e.target.value)}
							onBlur={() => {
								const amount = betInputAmount;
								setBetInputAmount(amount);
							}}
							disabled={countdown.phase !== 'betting'}
							className="bg-transparent disabled:opacity-50 outline-none w-24 font-bold text-white text-lg"
							placeholder="0.00"
						/>
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => {
								const currentAmount = betInputAmount;
								const halfAmount = currentAmount / 2;
								setBetInputAmount(halfAmount);
							}}
							disabled={countdown.phase !== 'betting' || betInputAmount === 0}
							className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-3 py-2 rounded font-bold text-xs transition disabled:cursor-not-allowed"
						>
							1/2
						</button>
						<button
							onClick={() => {
								const currentAmount = betInputAmount;
								const doubleAmount = Math.min(currentAmount * 2, balance);
								setBetInputAmount(doubleAmount);
							}}
							disabled={countdown.phase !== 'betting' || betInputAmount === 0}
							className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-3 py-2 rounded font-bold text-xs transition disabled:cursor-not-allowed"
						>
							2X
						</button>
						<button
							onClick={() => {
								setBetInputAmount(balance);
							}}
							disabled={countdown.phase !== 'betting' || balance === 0}
							className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-3 py-2 rounded font-bold text-xs transition disabled:cursor-not-allowed"
						>
							Max
						</button>
					</div>
				</div>

				{/* Last 100 Results */}
				<div className="flex items-center gap-3">
					<span className="font-semibold text-gray-400 text-sm">Last 100</span>
					<div className="flex gap-3">
						{Object.entries(colors).map(([colorKey, colorData]) => {
							const count = roulette.history
								.slice(0, 100)
								.filter((c) => c === colorKey).length;
							return (
								<div key={colorKey} className="flex items-center gap-2">
									<div
										className="flex justify-center items-center rounded-full w-6 h-6 font-bold text-sm"
										style={{ backgroundColor: colorData.color }}
									>
										{count}
									</div>
									<span className="font-bold text-white text-sm">
										{colorData.symbol}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Wheel Display */}
			<div className="bg-gray-800/50 backdrop-blur p-4 border border-gray-700 rounded-lg">
				<div className="mb-4 text-gray-500 text-sm text-center">
					Roulette Wheel
				</div>

				{/* Phase Indicator */}
				<div className="mb-4 text-center">
					<span className={`phase-indicator ${phaseDisplay.className}`}>
						{phaseDisplay.text}
					</span>
				</div>

				{/* Wheel Animation */}
				<div className="relative flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl mb-6 rounded-xl h-48 overflow-hidden wheel-container">
					<div className="center-indicator" />
					<div className="wheel-wrapper">
						<div
							key={roulette.animationKey}
							className={`wheel ${getWheelClass()}`}
							style={{
								transform: `translateX(-${roulette.wheelOffset}px)`,
							}}
						>
							{Array.from({ length: 50 }, (_, setIndex) =>
								colorSequence.map((color, idx) => (
									<div
										key={`${setIndex}-${color}-${idx}`}
										className="wheel-item"
										style={{
											backgroundColor:
												colors[color as keyof typeof colors].color,
										}}
									>
										{colors[color as keyof typeof colors].symbol}
									</div>
								)),
							)}
						</div>
					</div>
				</div>

				{/* Round Info */}
				{countdown.roundId && (
					<div className="text-gray-400 text-xs text-center">
						Round: {countdown.roundId.slice(-8)}
						{countdown.betsCount > 0 && ` • ${countdown.betsCount} bets`}
					</div>
				)}
			</div>

			{/* Status Display */}
			<div className="space-y-3 text-center">
				<div
					className={`font-bold text-4xl transition-all duration-500 ${
						roulette.result ? 'text-yellow-400 scale-110' : 'text-gray-500'
					}`}
				>
					{roulette.result
						? colors[roulette.result as keyof typeof colors].label
						: 'WAITING...'}
				</div>

				{/* Timer and Current Bet */}
				<div className="flex flex-wrap justify-center items-center gap-4">
					{/* Countdown Timer */}
					{(countdown.phase === 'betting' || countdown.phase === 'rolling') && (
						<div className="bg-gray-900/50 px-4 py-2 border border-gray-700 rounded-lg">
							<div className="mb-1 text-gray-400 text-xs">Time Left</div>
							<div
								className={`font-bold text-2xl transition-colors ${
									countdown.timeLeft <= 5
										? 'text-red-400 animate-pulse'
										: countdown.timeLeft <= 10
											? 'text-yellow-400'
											: 'text-white'
								}`}
							>
								{countdown.timeLeft}s
							</div>
						</div>
					)}

					{/* Placed Bets Display */}
					{placedTotalBet > 0 && (
						<div className="bg-blue-600/20 px-4 py-2 border border-blue-600 rounded-lg">
							<div className="mb-1 text-blue-400 text-xs">Active Bet</div>
							<div className="font-bold text-blue-400 text-2xl">
								${placedTotalBet}
							</div>
						</div>
					)}
				</div>

				{/* Placed Bets Breakdown */}
				{roulette.placedBets && placedTotalBet > 0 && (
					<div className="mt-4">
						<div className="bg-blue-600/10 p-4 border border-blue-600/30 rounded-lg">
							<div className="flex justify-between items-center mb-3 font-bold text-blue-400 text-sm">
								<span>💰 Your Active Bets</span>
								<span className="text-blue-300">${placedTotalBet} Total</span>

								{countdown.phase === 'betting' && (
									<button
										onClick={removeAllBets}
										disabled={removingBet}
										className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-3 py-1 rounded font-bold text-white text-xs transition disabled:cursor-not-allowed"
									>
										{removingBet ? 'Removing...' : '🗑️ Clear All'}
									</button>
								)}
							</div>

							<div className="gap-2 grid grid-cols-2 md:grid-cols-4">
								{Object.entries(roulette.placedBets).map(([color, amount]) => {
									if (amount === 0) return null;
									return (
										<div
											key={color}
											className="bg-gray-900/50 p-3 border rounded-lg"
											style={{
												borderColor: `${colors[color as keyof typeof colors].color}50`,
											}}
										>
											<div className="flex justify-between items-center mb-1">
												<span className="font-bold text-gray-400 text-xs uppercase">
													{colors[color as keyof typeof colors].label}
												</span>
												<span className="text-2xl">
													{colors[color as keyof typeof colors].symbol}
												</span>
											</div>
											<div className="font-bold text-white text-sm">
												Bet: ${amount}
											</div>
											<div
												className="font-bold text-xs"
												style={{
													color: colors[color as keyof typeof colors].color,
												}}
											>
												Win: ${potentialWins[color]} (×
												{colors[color as keyof typeof colors].multiplier})
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* History Pills */}
			{roulette.history.length > 0 && (
				<div className="pt-4 border-gray-700 border-t">
					<div className="mb-3 font-extrabold text-gray-800 text-md uppercase tracking-wider">
						Last 10 Previous Rolls
					</div>
					<div className="flex gap-2 pb-2 overflow-x-auto">
						{roulette.history.slice(0, 10).map((historyColor, idx) => (
							<div
								key={idx}
								className="flex justify-center items-center shadow-lg border-2 rounded-lg min-w-[50px] h-12 font-bold text-xl hover:scale-110 transition-transform"
								style={{
									backgroundColor:
										colors[historyColor as keyof typeof colors].color,
									borderColor: 'rgba(255,255,255,0.3)',
								}}
							>
								{colors[historyColor as keyof typeof colors].symbol}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Betting Controls */}
			<div className="space-y-4 bg-gray-800/50 backdrop-blur p-4 border border-gray-700 rounded-lg">
				{/* Color Buttons - Direct Betting */}
				<div className="gap-2 grid grid-cols-2 md:grid-cols-4">
					{Object.entries(colors).map(([colorKey, colorData]) => (
						<button
							key={colorKey}
							onClick={() => placeBetOnColor(colorKey)}
							disabled={
								countdown.phase !== 'betting' ||
								betInputAmount <= 0 ||
								betPlacedLoading
							}
							className="disabled:opacity-50 p-4 border-2 rounded-lg transition disabled:cursor-not-allowed color-bet-card"
							style={{
								backgroundColor: `${colorData.color}30`,
								borderColor: colorData.color,
							}}
						>
							{betPlacedLoading && (
								<div className="absolute inset-0 flex justify-center items-center bg-black/40 rounded-lg">
									{/* biome-ignore lint/a11y/noSvgWithoutTitle: <> */}
									<svg
										className="w-6 h-6 text-yellow-400 animate-spin"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
										/>
									</svg>
								</div>
							)}
							<div className="mb-2 text-3xl">{colorData.symbol}</div>
							<div className="mb-1 font-bold text-gray-300 text-xs">
								{colorData.label}
							</div>
							<div className="mb-1 text-gray-400 text-xs">
								×{colorData.multiplier}
							</div>
							<div className="font-bold text-yellow-400">${betInputAmount}</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default RouletteGame;
