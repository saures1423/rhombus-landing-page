import { useEffect, useState } from 'react';

interface CoinflipGameProps {
	user: { id: string; username: string };
	balance: number;
	socket: any;
}

type CoinSide = 'heads' | 'tails';

const CoinflipGame = ({ user, socket, balance }: CoinflipGameProps) => {
	// Bet controls
	const [betAmount, setBetAmount] = useState(1);
	const [choice, setChoice] = useState<CoinSide>('heads');

	// Game state
	const [isFlipping, setIsFlipping] = useState(false);

	// Streak state
	const [hasActiveStreak, setHasActiveStreak] = useState(false);
	const [currentStreak, setCurrentStreak] = useState(0);
	const [currentMultiplier, setCurrentMultiplier] = useState(1.96);
	const [totalWinnings, setTotalWinnings] = useState(0);
	const [winHistory, setWinHistory] = useState<CoinSide[]>([]);

	// Result display
	const [lastResult, setLastResult] = useState<{
		result: CoinSide;
		won: boolean;
		message?: string;
	} | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Initial state request
		socket.emit('coinflip:getState', {});

		// ===== Game State =====
		const handleState = (data: any) => {
			console.log('🎮 [coinflip:state] Game state:', data);
			setHasActiveStreak(data.hasActiveStreak);

			if (data.hasActiveStreak) {
				setCurrentStreak(data.streak);
				setCurrentMultiplier(data.multiplier);
				setTotalWinnings(data.totalWinnings);
				setWinHistory(data.history || []);
			} else {
				// Reset streak data
				setCurrentStreak(0);
				setCurrentMultiplier(1.96);
				setTotalWinnings(0);
				setWinHistory([]);
			}
		};

		// ===== Flipping Animation =====
		const handleFlipping = (data: any) => {
			console.log('🪙 [coinflip:flipping]:', data);
			setIsFlipping(data.isFlipping);
			if (data.isFlipping) {
				setLastResult(null); // Clear previous result
			}
		};

		// ===== Result =====
		const handleResult = (data: any) => {
			console.log('🎲 [coinflip:result] Result received:', data);
			setLastResult({
				result: data.result,
				won: data.won,
			});

			if (data.won) {
				setHasActiveStreak(true);
				setCurrentStreak(data.streak);
				setCurrentMultiplier(data.multiplier);
				setTotalWinnings(data.totalWinnings);
			} else {
				// Lost - reset everything
				setHasActiveStreak(false);
				setCurrentStreak(0);
				setCurrentMultiplier(1.96);
				setTotalWinnings(0);
				setWinHistory([]);
			}
		};

		// ===== Streak Active =====
		const handleStreakActive = (data: any) => {
			console.log('🔥 [coinflip:streakActive] Streak updated:', data);
			setCurrentStreak(data.streak);
			setCurrentMultiplier(data.multiplier);
			setTotalWinnings(data.totalWinnings);
			setWinHistory(data.history || []);
		};

		// ===== Streak Ended =====
		const handleStreakEnded = (data: any) => {
			console.log('💔 [coinflip:streakEnded] Streak ended:', data);
			setHasActiveStreak(false);
			setCurrentStreak(0);
			setCurrentMultiplier(1.96);
			setTotalWinnings(0);
			setWinHistory([]);

			if (data.reason === 'loss') {
				setLastResult({
					result: lastResult?.result || 'heads',
					won: false,
					message: `Lost streak at ${data.finalStreak} wins! Lost $${data.lostAmount?.toFixed(8)}`,
				});
			}
		};

		// ===== Cashed Out =====
		const handleCashedOut = (data: any) => {
			console.log('💰 [coinflip:cashedOut] Cashout successful:', data);
			setHasActiveStreak(false);
			setCurrentStreak(0);
			setCurrentMultiplier(1.96);
			setTotalWinnings(0);
			setWinHistory([]);

			setLastResult({
				result: 'heads',
				won: true,
				message: `Cashed out $${data.cashoutAmount.toFixed(2)}! Profit: $${data.profit.toFixed(8)}`,
			});
		};

		// ===== Random Pick =====
		const handleRandomPick = (data: any) => {
			console.log('🎲 [coinflip:randomPick] Random choice:', data);
			setChoice(data.choice);
		};

		// ===== Balance Update =====
		const handleBalanceUpdate = (data: any) => {
			console.log('💵 [balance:update] Balance updated:', data);
		};

		// Register all event listeners
		socket.on('coinflip:state', handleState);
		socket.on('coinflip:flipping', handleFlipping);
		socket.on('coinflip:result', handleResult);
		socket.on('coinflip:streakActive', handleStreakActive);
		socket.on('coinflip:streakEnded', handleStreakEnded);
		socket.on('coinflip:cashedOut', handleCashedOut);
		socket.on('coinflip:randomPick', handleRandomPick);
		socket.on('balance:update', handleBalanceUpdate);

		// Cleanup
		return () => {
			socket.off('coinflip:state', handleState);
			socket.off('coinflip:flipping', handleFlipping);
			socket.off('coinflip:result', handleResult);
			socket.off('coinflip:streakActive', handleStreakActive);
			socket.off('coinflip:streakEnded', handleStreakEnded);
			socket.off('coinflip:cashedOut', handleCashedOut);
			socket.off('coinflip:randomPick', handleRandomPick);
			socket.off('balance:update', handleBalanceUpdate);
		};
	}, [socket]);

	// ===== Game Actions =====
	const handleStartGame = () => {
		if (isFlipping || hasActiveStreak || betAmount <= 0) return;
		if (balance < betAmount) {
			alert('Insufficient balance!');
			return;
		}

		socket.emit('coinflip:start', {
			betAmount,
			choice,
		});
	};

	const handleContinue = (newChoice: CoinSide) => {
		if (isFlipping || !hasActiveStreak) return;

		setChoice(newChoice);
		socket.emit('coinflip:continue', {
			choice: newChoice,
		});
	};

	const handleCashout = () => {
		if (!hasActiveStreak || currentStreak === 0 || isFlipping) return;

		socket.emit('coinflip:cashout', {});
	};

	const handleRandomPick = () => {
		socket.emit('coinflip:randomPick', {});
	};

	return (
		<div className="gap-4 grid grid-cols-1 lg:grid-cols-[340px_1fr] bg-gray-800/50 p-4 min-h-screen text-white">
			{/* Left Panel */}
			<div className="space-y-4 bg-[#1a2332] p-5 rounded-lg h-fit">
				{/* Bet Amount (only visible when no active streak) */}
				{!hasActiveStreak && (
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<label className="text-gray-400 text-sm">Bet Amount</label>
						</div>
						<div className="flex gap-2">
							<input
								type="number"
								value={betAmount}
								onChange={(e) => setBetAmount(Number(e.target.value))}
								disabled={isFlipping || hasActiveStreak}
								className="flex-1 bg-gray-800/50 px-3 py-2.5 border border-gray-700 focus:border-blue-500 rounded-lg focus:outline-none text-white"
							/>
						</div>
					</div>
				)}

				{/* Cashout Button (only visible during active streak) */}
				{hasActiveStreak && (
					<button
						onClick={handleCashout}
						disabled={isFlipping || currentStreak === 0}
						className="bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 py-4 rounded-lg w-full font-bold text-lg transition disabled:cursor-not-allowed"
					>
						Cashout {totalWinnings.toFixed(2)}
					</button>
				)}

				{/* Random Pick Button */}
				<button
					onClick={handleRandomPick}
					disabled={isFlipping}
					className="bg-[#2d3748] hover:bg-[#374151] disabled:opacity-50 py-3 rounded-lg w-full font-medium transition"
				>
					Random Pick
				</button>

				{/* Choice Buttons */}
				<div className="gap-3 grid grid-cols-2">
					{!hasActiveStreak ? (
						// Initial choice selection
						<>
							<button
								onClick={() => setChoice('heads')}
								disabled={isFlipping}
								className={`py-4 rounded-lg font-bold transition border-2 ${
									choice === 'heads'
										? 'bg-[#FFA500] border-[#ff8800]'
										: 'bg-[#2d3748] border-gray-700 hover:bg-[#374151]'
								}`}
							>
								Heads 🟡
							</button>
							<button
								onClick={() => setChoice('tails')}
								disabled={isFlipping}
								className={`py-4 rounded-lg font-bold transition border-2 ${
									choice === 'tails'
										? 'bg-[#3b82f6] border-[#2563eb]'
										: 'bg-[#2d3748] border-gray-700 hover:bg-[#374151]'
								}`}
							>
								Tails 🔵
							</button>
						</>
					) : (
						// Continue buttons during streak
						<>
							<button
								onClick={() => handleContinue('heads')}
								disabled={isFlipping}
								className="bg-[#FFA500] hover:bg-[#ff8800] disabled:opacity-50 py-4 rounded-lg font-bold transition"
							>
								Heads 🟡
							</button>
							<button
								onClick={() => handleContinue('tails')}
								disabled={isFlipping}
								className="bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 py-4 rounded-lg font-bold transition"
							>
								Tails 🔵
							</button>
						</>
					)}
				</div>

				{/* Start Game Button (only visible when no active streak) */}
				{!hasActiveStreak && (
					<button
						onClick={handleStartGame}
						disabled={isFlipping || betAmount <= 0}
						className="bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 py-4 rounded-lg w-full font-bold text-lg transition disabled:cursor-not-allowed"
					>
						{isFlipping ? 'Flipping...' : 'Start Game'}
					</button>
				)}

				{/* Total Profit Section */}
				<div className="space-y-2 bg-gray-800/50 p-4 rounded-lg">
					<div className="flex justify-between items-center">
						<label className="text-gray-400 text-sm">
							Total Profit ({currentMultiplier.toFixed(2)}x)
						</label>
						<span className="text-gray-400 text-sm">
							{totalWinnings.toFixed(2)}
						</span>
					</div>
					<div className="flex items-center gap-2 font-bold text-2xl">
						{hasActiveStreak ? totalWinnings.toFixed(2) : '0.00'}
					</div>
				</div>

				{/* Win History */}
				<div className="bg-gray-800/50 p-4 rounded-lg">
					<h3 className="mb-3 text-gray-400 text-sm">History</h3>
					<div className="flex flex-wrap gap-2">
						{winHistory.length > 0 ? (
							winHistory.map((result, index) => (
								<div
									key={index}
									className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
										result === 'heads' ? 'bg-[#FFA500]' : 'bg-[#3b82f6]'
									}`}
								>
									{result === 'heads' ? '🟡' : '🔵'}
								</div>
							))
						) : (
							<div className="text-gray-500 text-sm">No wins yet</div>
						)}
					</div>
					{hasActiveStreak && (
						<div className="mt-3 pt-3 border-gray-700 border-t">
							<div className="text-gray-400 text-sm">
								Current Streak:{' '}
								<span className="font-bold text-white">
									{currentStreak} wins
								</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Right Panel - Coin Animation */}
			<div className="flex flex-col justify- items-center bg-[#1a2332] p-8 rounded-lg">
				{/* Coin */}
				<div
					className={`w-[300px] h-[300px] rounded-full flex items-center justify-center transition-transform duration-2000 ${
						isFlipping ? 'animate-spin' : ''
					}`}
					style={{
						background: 'linear-gradient(135deg, #FFA500 0%, #ff8800 100%)',
						boxShadow: '0 20px 60px rgba(255, 165, 0, 0.3)',
					}}
				>
					<div className="bg-[#1a2332] rounded-full w-[200px] h-[200px]" />
				</div>

				{/* Result Display */}
				{!isFlipping && lastResult && (
					<div className="space-y-4 mt-8 text-center animate-fade-in">
						<div
							className={`text-6xl font-bold ${lastResult.won ? 'text-green-400' : 'text-red-400'}`}
						>
							{lastResult.won ? '🎉 YOU WON!' : '😔 YOU LOST'}
						</div>
						<div className="text-gray-300 text-2xl">
							Result:{' '}
							<span className="font-bold">
								{lastResult.result.toUpperCase()}
							</span>
						</div>
						{lastResult.message && (
							<div className="text-gray-400 text-lg">{lastResult.message}</div>
						)}
						{hasActiveStreak && (
							<div className="text-blue-400 text-xl">
								🔥 {currentStreak} win streak! Keep going or cashout!
							</div>
						)}
					</div>
				)}

				{/* Flipping State */}
				{isFlipping && (
					<div className="mt-8 text-center">
						<div className="font-bold text-4xl animate-pulse">Flipping...</div>
					</div>
				)}
			</div>

			<style>{`
				@keyframes spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(1800deg);
					}
				}

				.animate-spin {
					animation: spin 2s ease-in-out;
				}

				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fade-in 0.5s ease-out;
				}
			`}</style>
		</div>
	);
};

export default CoinflipGame;
