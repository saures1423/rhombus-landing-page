import { useRouletteCountdown } from '@/hooks/useRouletteCountdown';
import { useEffect, useState } from 'react';

interface RouletteGameProps {
	balance: number;
	socket: any;
}

const RouletteGame = ({ socket, balance }: RouletteGameProps) => {
	const countdown = useRouletteCountdown(socket);

	const [roulette, setRoulette] = useState<{
		bets: Record<string, number>;
		placedBets: Record<string, number> | null;
		result: string | null;
		wheelOffset: number;
		isSpinning: boolean;
		history: string[];
		animationKey: number;
	}>({
		bets: { black: 0, gold: 0, blue: 0, bait: 0 },
		placedBets: null,
		result: null,
		wheelOffset: 0,
		isSpinning: false,
		history: [],
		animationKey: 0,
	});

	const [betInputAmount, setBetInputAmount] = useState<string>('1');

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

	const totalBet = Object.values(roulette.bets).reduce((a, b) => a + b, 0);

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

		const handleGameStarting = (data: any) => {
			console.log('🎲 Game starting:', data);
			setRoulette((prev) => ({
				...prev,
				result: null,
				isSpinning: false,
				wheelOffset: 0,
				placedBets: null,
				animationKey: prev.animationKey + 1,
			}));
		};

		const handleBetConfirmed = (data: any) => {
			console.log('✅ Bet Confirmed successfully', data);
			setRoulette((prev) => ({
				...prev,
				placedBets: { ...prev.bets },
				bets: { black: 0, gold: 0, blue: 0, bait: 0 },
			}));
		};

		const handleRolling = (data: any) => {
			console.log('🎰 Rolling started:', data);
			setRoulette((prev) => ({
				...prev,
				isSpinning: true,
				wheelOffset: 0,
				result: null,
				animationKey: prev.animationKey + 1,
			}));

			setTimeout(() => {
				setRoulette((prev) => {
					const itemWidth = 128;
					const loopOffset = itemWidth * colorSequence.length * 6;
					return {
						...prev,
						wheelOffset: loopOffset,
					};
				});
			}, 100);
		};

		const handleResult = (data: any) => {
			console.log('✨ Result received:', data);

			setTimeout(() => {
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

				setRoulette((prev) => ({
					...prev,
					isSpinning: false,
					wheelOffset: finalOffset,
					result: data.winningColor,
					history: [data.winningColor, ...prev.history.slice(0, 99)],
				}));
			}, 300);
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
				bets: { black: 0, gold: 0, blue: 0, bait: 0 },
				placedBets: null,
				result: null,
				wheelOffset: 0,
				isSpinning: false,
				history: [],
				animationKey: 0,
			});
		};

		socket.emit('roulette:getHistory');

		socket.on('roulette:gameStarting', handleGameStarting);
		socket.on('roulette:betConfirmed', handleBetConfirmed);
		socket.on('roulette:rolling', handleRolling);
		socket.on('roulette:result', handleResult);
		socket.on('roulette:history', handleHistory);
		socket.on('roulette:noBets', handleNoBets);
		socket.on('roulette:gameStopped', handleGameStopped);

		return () => {
			socket.off('roulette:gameStarting', handleGameStarting);
			socket.off('roulette:betConfirmed', handleBetConfirmed);
			socket.off('roulette:rolling', handleRolling);
			socket.off('roulette:result', handleResult);
			socket.off('roulette:history', handleHistory);
			socket.off('roulette:noBets', handleNoBets);
			socket.off('roulette:gameStopped', handleGameStopped);
		};
	}, [socket]);

	const addRouletteBet = (color: string, amount: number) => {
		if (countdown.phase !== 'betting') {
			alert('Can only bet during betting phase');
			return;
		}

		const newBets = {
			...roulette.bets,
			[color]: roulette.bets[color as keyof typeof roulette.bets] + amount,
		};
		const newTotal = Object.values(newBets).reduce((a, b) => a + b, 0);

		if (balance < newTotal - totalBet) {
			alert('Insufficient balance');
			return;
		}

		setRoulette((prev) => ({ ...prev, bets: newBets }));
	};

	const placeBet = () => {
		if (totalBet === 0) {
			alert('Please place a bet first');
			return;
		}

		if (countdown.phase !== 'betting') {
			alert('Can only place bets during betting phase');
			return;
		}

		socket.emit('roulette:bet', {
			betAmount: totalBet,
			selectedColors: roulette.bets,
		});

		console.log('📤 Bet placed:', {
			betAmount: totalBet,
			selectedColors: roulette.bets,
		});
	};

	const clearBets = () => {
		setRoulette((prev) => ({
			...prev,
			bets: { black: 0, gold: 0, blue: 0, bait: 0 },
		}));
	};

	const getPhaseDisplay = () => {
		switch (countdown.phase) {
			case 'betting':
				return {
					text: '🎲 Place Your Bets',
					className: 'phase-betting',
				};
			case 'rolling':
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
			transition: transform 5s linear;
		}
		
		.wheel.stopped {
			transition: transform 3s cubic-bezier(0.15, 0.5, 0.2, 1);
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

		.wheel.spinning ~ .center-indicator {
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

		.bet-button {
			transition: all 0.2s ease;
		}

		.bet-button:hover:not(:disabled) {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		}

		.bet-button:active:not(:disabled) {
			transform: translateY(0);
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
		if (/^\d*\.?\d*$/.test(value)) {
			setBetInputAmount(value);
		}
	}

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
								const amount = Number.parseFloat(betInputAmount) || 0;
								setBetInputAmount(amount.toFixed(2));
							}}
							disabled={countdown.phase !== 'betting'}
							className="bg-transparent disabled:opacity-50 outline-none w-24 font-bold text-white text-lg"
							placeholder="0.00"
						/>
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => {
								const currentAmount = Number.parseFloat(betInputAmount) || 0;
								const halfAmount = currentAmount / 2;
								setBetInputAmount(halfAmount.toFixed(2));
							}}
							disabled={
								countdown.phase !== 'betting' ||
								Number.parseFloat(betInputAmount) === 0
							}
							className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-3 py-2 rounded font-bold text-xs transition disabled:cursor-not-allowed"
						>
							1/2
						</button>
						<button
							onClick={() => {
								const currentAmount = Number.parseFloat(betInputAmount) || 0;
								const doubleAmount = Math.min(currentAmount * 2, balance);
								setBetInputAmount(doubleAmount.toFixed(2));
							}}
							disabled={
								countdown.phase !== 'betting' ||
								Number.parseFloat(betInputAmount) === 0
							}
							className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-3 py-2 rounded font-bold text-xs transition disabled:cursor-not-allowed"
						>
							2X
						</button>
						<button
							onClick={() => {
								setBetInputAmount(balance.toFixed(2));
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
							className={`wheel ${roulette.isSpinning ? 'spinning' : 'stopped'}`}
							style={{
								transform: `translateX(-${roulette.wheelOffset}px)`,
							}}
						>
							{Array.from({ length: 10 }, (_, setIndex) =>
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

					{/* Current Bet Display */}
					{totalBet > 0 && (
						<div className="bg-green-600/20 px-4 py-2 border border-green-600 rounded-lg">
							<div className="mb-1 text-green-400 text-xs">Your Bet</div>
							<div className="font-bold text-green-400 text-2xl">
								${totalBet}
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
				{/* Quick Bet Buttons */}
				<div className="gap-2 grid grid-cols-4">
					<button
						onClick={() => addRouletteBet('black', 10)}
						disabled={countdown.phase !== 'betting'}
						className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-2 py-2 rounded font-bold text-xs transition disabled:cursor-not-allowed bet-button"
					>
						+$10
					</button>
					<button
						onClick={() => addRouletteBet('black', 100)}
						disabled={countdown.phase !== 'betting'}
						className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-2 py-2 rounded font-bold text-xs transition disabled:cursor-not-allowed bet-button"
					>
						+$100
					</button>
					<button
						onClick={() => addRouletteBet('black', Math.floor(balance / 4))}
						disabled={countdown.phase !== 'betting' || balance === 0}
						className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-2 py-2 rounded font-bold text-xs transition disabled:cursor-not-allowed bet-button"
					>
						MAX
					</button>
					<button
						onClick={clearBets}
						disabled={countdown.phase !== 'betting'}
						className="bg-red-700/50 hover:bg-red-600 disabled:opacity-50 px-2 py-2 rounded font-bold text-xs transition disabled:cursor-not-allowed bet-button"
					>
						CLEAR
					</button>
				</div>

				{/* Color Buttons */}
				<div className="gap-2 grid grid-cols-2 md:grid-cols-4">
					{Object.entries(colors).map(([colorKey, colorData]) => (
						<button
							key={colorKey}
							onClick={() => addRouletteBet(colorKey, 1)}
							disabled={countdown.phase !== 'betting'}
							className="disabled:opacity-50 p-4 border-2 rounded-lg transition disabled:cursor-not-allowed color-bet-card"
							style={{
								backgroundColor: `${colorData.color}30`,
								borderColor: colorData.color,
							}}
						>
							<div className="mb-2 text-3xl">{colorData.symbol}</div>
							<div className="mb-1 font-bold text-gray-300 text-xs">
								{colorData.label}
							</div>
							<div className="mb-1 text-gray-400 text-xs">
								×{colorData.multiplier}
							</div>
							<div className="font-bold text-yellow-400">
								${roulette.bets[colorKey as keyof typeof roulette.bets]}
							</div>
						</button>
					))}
				</div>

				{/* Place Bet Button */}
				<button
					onClick={placeBet}
					disabled={countdown.phase !== 'betting' || totalBet === 0}
					className="bg-gradient-to-r from-green-600 hover:from-green-500 disabled:from-gray-600 to-green-500 hover:to-green-400 disabled:to-gray-600 disabled:opacity-50 shadow-lg hover:shadow-green-500/50 py-4 rounded-lg w-full font-bold text-lg transition-all disabled:cursor-not-allowed"
				>
					{totalBet > 0 ? `PLACE BET - $${totalBet}` : 'SELECT YOUR BETS'}
				</button>
			</div>
		</div>
	);
};

export default RouletteGame;
