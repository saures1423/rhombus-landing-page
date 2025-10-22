import { useState } from 'react';

interface RouletteGameProps {
	user: { id: string; username: string; balance: number };
	socket: any;
	countdown: { phase: string; timeLeft: number };
}

const RouletteGame = ({ user, socket, countdown }: RouletteGameProps) => {
	const [roulette, setRoulette] = useState<{
		bets: Record<string, number>;
		result: string | null;
		wheelOffset: number;
		isSpinning: boolean;
		history: string[];
		animationKey: number;
	}>({
		bets: { black: 0, gold: 0, blue: 0, bait: 0 },
		result: null,
		wheelOffset: 0,
		isSpinning: false,
		history: [],
		animationKey: 0,
	});

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

	const addRouletteBet = (color: string, amount: number) => {
		if (countdown.phase !== 'betting') {
			alert('Can only bet during betting phase');
			return;
		}

		const newBets = {
			...roulette.bets,
			[color]: roulette.bets[color] + amount,
		};
		const newTotal = Object.values(newBets).reduce((a, b) => a + b, 0);

		if (!user || user.balance < newTotal - totalBet) {
			alert('Insufficient balance');
			return;
		}

		setRoulette((prev) => ({ ...prev, bets: newBets }));
	};

	const placeBet = () => {
		if (totalBet === 0 || !user || countdown.phase !== 'betting') {
			alert('Please place a bet and wait for betting phase');
			return;
		}

		socket.emit('roulette:bet', {
			betAmount: totalBet,
			selectedColors: roulette.bets,
		});

		setRoulette((prev) => ({
			...prev,
			bets: { black: 0, gold: 0, blue: 0, bait: 0 },
		}));
	};

	// Socket event handlers
	socket.on('roulette:gameStarting', (data: any) => {
		console.log('🎲 Game starting:', data);
		setRoulette((prev) => ({
			...prev,
			result: null,
			isSpinning: false,
			wheelOffset: 0,
			animationKey: prev.animationKey + 1,
		}));
	});

	socket.on('roulette:betConfirmed', (data: any) => {
		console.log('✅ Bet Confirmed successfully', data);
		setRoulette((prev) => ({
			...prev,
			bets: { black: 0, gold: 0, blue: 0, bait: 0 },
		}));
	});

	socket.on('roulette:rolling', (data: any) => {
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
	});

	socket.on('roulette:result', (data: any) => {
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
				isSpinning: data.isSpinning,
				wheelOffset: finalOffset,
				result: data.winningColor,
				history: [data.winningColor, ...prev.history.slice(0, 99)],
			}));
		}, 300);
	});

	socket.on('roulette:history', (data: any) => {
		console.log('🚀 ~ RouletteGame ~ data:', data);
		setRoulette((prev) => ({
			...prev,
			history: data.results || [],
		}));
	});

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
		transition: none;
	}
	
	.wheel.spinning {
		transition: transform 8s cubic-bezier(0.25, 0.1, 0.25, 1);
	}
	
	.wheel.stopped {
		transition: transform 4s cubic-bezier(0.15, 0.8, 0.3, 1);
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

	.phase-indicator {
		padding: 8px 16px;
		border-radius: 20px;
		font-weight: bold;
		font-size: 14px;
		text-transform: uppercase;
		letter-spacing: 1px;
		display: inline-block;
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

	@keyframes pulse-betting {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	@keyframes pulse-rolling {
		0%, 100% { transform: scale(1) rotate(0deg); }
		25% { transform: scale(1.05) rotate(-2deg); }
		75% { transform: scale(1.05) rotate(2deg); }
	}
`;

	return (
		<div className="space-y-4">
			<style>{wheelStyles}</style>

			{/* Wheel Display */}
			<div className="bg-gray-800/50 backdrop-blur p-4 border border-gray-700 rounded-lg">
				<div className="mb-4 text-gray-500 text-sm text-center">
					Roulette Wheel
				</div>

				<div className="mb-4 text-center">
					<span
						className={`phase-indicator ${
							countdown.phase === 'betting'
								? 'phase-betting'
								: countdown.phase === 'rolling'
									? 'phase-rolling'
									: 'phase-completed'
						}`}
					>
						{countdown.phase === 'betting' && '🎲 Place Your Bets'}
						{countdown.phase === 'rolling' && '🎰 Spinning...'}
						{countdown.phase === 'completed' && '✨ Winner!'}
					</span>
				</div>

				<div className="relative flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl mb-6 rounded-xl h-48 overflow-hidden wheel-container">
					{/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
					<div className="center-indicator"></div>
					<div className="wheel-wrapper">
						<div
							key={roulette.animationKey}
							className={`wheel ${roulette.isSpinning ? 'spinning' : 'stopped'}`}
							style={{
								transform: `translateX(-${roulette.wheelOffset}px)`,
							}}
						>
							{[
								...colorSequence,
								...colorSequence,
								...colorSequence,
								...colorSequence,
								...colorSequence,
								...colorSequence,
								...colorSequence,
								...colorSequence,
								...colorSequence,
								...colorSequence,
								...colorSequence,
								...colorSequence,
								...colorSequence,
								...colorSequence,
							].map((color, idx) => (
								<div
									key={`${color}-${idx}`}
									className="wheel-item"
									style={{
										backgroundColor: colors[color as keyof typeof colors].color,
									}}
								>
									{colors[color as keyof typeof colors].symbol}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

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

				<div className="flex justify-center items-center gap-4">
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

					{totalBet > 0 && (
						<div className="bg-green-600/20 px-4 py-2 border border-green-600 rounded-lg">
							<div className="mb-1 text-green-400 text-xs">Your Bet</div>
							<div className="font-bold text-green-400 text-2xl">
								${totalBet}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* History Pills */}
			{roulette.history.length > 0 && (
				<div className="mt-6 pt-4 border-gray-700 border-t">
					<div className="mb-3 font-bold text-black text-md uppercase tracking-wider">
						Last 10 Results
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
				<div className="gap-2 grid grid-cols-4">
					<button
						onClick={() => addRouletteBet('black', 10)}
						disabled={countdown.phase !== 'betting'}
						className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-2 py-2 rounded font-bold text-xs transition"
					>
						+10
					</button>
					<button
						onClick={() => addRouletteBet('black', 100)}
						disabled={countdown.phase !== 'betting'}
						className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-2 py-2 rounded font-bold text-xs transition"
					>
						+100
					</button>
					<button
						onClick={() =>
							addRouletteBet('black', Math.floor(user.balance / 4))
						}
						disabled={countdown.phase !== 'betting' || user.balance === 0}
						className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-2 py-2 rounded font-bold text-xs transition"
					>
						MAX
					</button>
					<button
						onClick={() =>
							setRoulette((prev) => ({
								...prev,
								bets: { black: 0, gold: 0, blue: 0, bait: 0 },
							}))
						}
						className="bg-red-700/50 hover:bg-red-600 px-2 py-2 rounded font-bold text-xs transition"
					>
						CLEAR
					</button>
				</div>

				{/* Color Buttons */}
				<div className="gap-2 grid grid-cols-4">
					{Object.entries(colors).map(([colorKey, colorData]) => (
						<button
							key={colorKey}
							onClick={() => addRouletteBet(colorKey, 1)}
							disabled={countdown.phase !== 'betting'}
							className="disabled:opacity-50 p-4 border-2 rounded-lg hover:scale-105 active:scale-95 transition"
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
					className="bg-gradient-to-r from-green-600 hover:from-green-500 disabled:from-gray-600 to-green-500 hover:to-green-400 disabled:to-gray-600 disabled:opacity-50 shadow-lg hover:shadow-green-500/50 py-4 rounded-lg w-full font-bold text-lg transition-all"
				>
					{totalBet > 0 ? `PLACE BET - ${totalBet}` : 'SELECT YOUR BETS'}
				</button>
			</div>
		</div>
	);
};

export default RouletteGame;
