import { useEffect, useState } from 'react';

interface CoinflipGameProps {
	user: { id: string; username: string; balance: number };
	socket: any;
}

const CoinflipGame = ({ user, socket }: CoinflipGameProps) => {
	const [coinflip, setCoinflip] = useState<{
		betAmount: number;
		choice: 'heads' | 'tails';
		isFlipping: boolean;
		result: string | null;
		won: boolean;
	}>({
		betAmount: 10,
		choice: 'heads',
		isFlipping: false,
		result: null,
		won: false,
	});

	useEffect(() => {
		// Socket event handlers
		const handleFlipping = (data: any) => {
			console.log('🪙 [coinflip:flipping] Flipping started:', data);
			setCoinflip((prev) => ({ ...prev, isFlipping: data.isFlipping }));
		};

		const handleResult = (data: any) => {
			console.log('🎲 [coinflip:result] Flip result received:', data);
			setCoinflip((prev) => ({
				...prev,
				result: data.result,
				won: data.won,
				isFlipping: false,
			}));
		};

		socket.on('coinflip:flipping', handleFlipping);
		socket.on('coinflip:result', handleResult);

		return () => {
			socket.off('coinflip:flipping', handleFlipping);
			socket.off('coinflip:result', handleResult);
		};
	}, [socket]);

	const playCoinflip = () => {
		if (!user || user.balance < coinflip.betAmount) {
			alert('Insufficient balance!');
			return;
		}
		socket.emit('coinflip:play', {
			betAmount: coinflip.betAmount,
			choice: coinflip.choice,
		});
	};

	return (
		<div className="space-y-4">
			<div className="space-y-4 bg-gray-800/50 backdrop-blur p-4 border border-gray-700 rounded-lg">
				<div>
					<label className="block mb-2 text-gray-400 text-sm">Bet Amount</label>
					<input
						type="number"
						value={coinflip.betAmount}
						onChange={(e) =>
							setCoinflip((prev) => ({
								...prev,
								betAmount: Number.parseFloat(e.target.value),
							}))
						}
						disabled={coinflip.isFlipping}
						className="bg-gray-900/50 px-3 py-2 border border-gray-700 rounded w-full text-white"
						min="1"
					/>
				</div>

				<div>
					<label className="block mb-2 text-gray-400 text-sm">
						Choose Side
					</label>
					<div className="gap-4 grid grid-cols-2">
						<button
							onClick={() =>
								setCoinflip((prev) => ({
									...prev,
									choice: 'heads',
								}))
							}
							disabled={coinflip.isFlipping}
							className={`py-4 rounded-lg font-bold transition border-2 ${
								coinflip.choice === 'heads'
									? 'bg-blue-600 border-blue-400'
									: 'bg-gray-900/50 border-gray-700 hover:bg-gray-700'
							}`}
						>
							Heads
						</button>
						<button
							onClick={() =>
								setCoinflip((prev) => ({
									...prev,
									choice: 'tails',
								}))
							}
							disabled={coinflip.isFlipping}
							className={`py-4 rounded-lg font-bold transition border-2 ${
								coinflip.choice === 'tails'
									? 'bg-blue-600 border-blue-400'
									: 'bg-gray-900/50 border-gray-700 hover:bg-gray-700'
							}`}
						>
							Tails
						</button>
					</div>
				</div>

				<button
					onClick={playCoinflip}
					disabled={coinflip.isFlipping}
					className="bg-green-600 hover:bg-green-700 disabled:opacity-50 py-3 rounded-lg w-full font-bold transition"
				>
					{coinflip.isFlipping ? 'Flipping...' : 'Flip Coin'}
				</button>
			</div>

			{!coinflip.isFlipping && coinflip.result && (
				<div
					className={`p-6 rounded-lg text-center border-2 ${
						coinflip.won
							? 'bg-green-600/20 border-green-400'
							: 'bg-red-600/20 border-red-400'
					}`}
				>
					<div className="mb-2 text-6xl animate-bounce">🪙</div>
					<div className="font-bold text-2xl">
						{coinflip.won ? 'YOU WIN!' : 'YOU LOSE!'}
					</div>
					<div className="text-lg">Result: {coinflip.result.toUpperCase()}</div>
				</div>
			)}
		</div>
	);
};

export default CoinflipGame;
