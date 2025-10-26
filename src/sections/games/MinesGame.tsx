import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MinesGameProps {
	user: { id: string; username: string };
	balance: number;
	socket: any;
	onShowProvablyFair: () => void;
}

const MinesGame = ({ user, socket, onShowProvablyFair }: MinesGameProps) => {
	const [minesGame, setMinesGame] = useState<{
		gameId: string | null;
		betAmount: number;
		minesCount: number;
		gridSize: number;
		revealedTiles: number[];
		minePositions: number[];
		currentMultiplier: number;
		isActive: boolean;
		gameOver: boolean;
	}>({
		gameId: null,
		betAmount: 10,
		minesCount: 3,
		gridSize: 25,
		revealedTiles: [],
		minePositions: [],
		currentMultiplier: 1,
		isActive: false,
		gameOver: false,
	});

	const startMinesGame = () => {
		// if (!user || user.balance < minesGame.betAmount) {
		// 	alert('Insufficient balance!');
		// 	return;
		// }
		socket.emit('mines:start', {
			userId: user.id,
			betAmount: minesGame.betAmount,
			minesCount: minesGame.minesCount,
			gridSize: minesGame.gridSize,
		});
	};

	const revealTile = (index: number) => {
		if (!minesGame.isActive || minesGame.revealedTiles.includes(index)) return;
		socket.emit('mines:reveal', {
			gameId: minesGame.gameId,
			tileIndex: index,
		});
	};

	const cashoutMines = () => {
		socket.emit('mines:cashout', { gameId: minesGame.gameId });
	};

	useEffect(() => {
		// Socket event handlers
		socket.on('mines:started', (data: any) => {
			console.log('💎 [mines:started] Game started:', data);
			setMinesGame((prev) => ({
				...prev,
				gameId: data.gameId,
				isActive: true,
				gameOver: false,
				revealedTiles: [],
				minePositions: [],
				currentMultiplier: 1,
			}));
		});

		socket.on('mines:tileRevealed', (data: any) => {
			console.log('🪙 [mines:tileRevealed] Tile revealed:', data);
			setMinesGame((prev) => ({
				...prev,
				revealedTiles: [...prev.revealedTiles, data.tileIndex],
				currentMultiplier: data.currentMultiplier,
			}));
		});

		socket.on('mines:result', (data: any) => {
			console.log('💥 [mines:result] Game result received:', data);
			setMinesGame((prev) => ({
				...prev,
				isActive: false,
				gameOver: true,
				minePositions: data.minePositions,
			}));
		});

		socket.on('mines:cashedOut', (data: any) => {
			console.log('💸 [mines:cashedOut] Player cashed out:', data);
			setMinesGame((prev) => ({
				...prev,
				isActive: false,
				gameOver: true,
				minePositions: data.minePositions,
			}));
		});
		return () => {
			// Cleanup socket event handlers
			socket.off('mines:started');
			socket.off('mines:tileRevealed');
			socket.off('mines:result');
			socket.off('mines:cashedOut');
		};
	}, [socket]);

	return (
		<div className="space-y-4">
			<div className="bg-gray-800/50 backdrop-blur p-4 border border-gray-700 rounded-lg">
				<div className="gap-4 grid grid-cols-2 mb-4">
					<div>
						<label className="block mb-2 text-gray-400 text-sm">
							Bet Amount
						</label>
						<input
							type="number"
							value={minesGame.betAmount}
							onChange={(e) =>
								setMinesGame((prev) => ({
									...prev,
									betAmount: Number.parseFloat(e.target.value),
								}))
							}
							disabled={minesGame.isActive}
							className="bg-gray-900/50 px-3 py-2 border border-gray-700 rounded w-full text-white"
							min="1"
						/>
					</div>
					<div>
						<label className="block mb-2 text-gray-400 text-sm">Mines</label>
						<select
							value={minesGame.minesCount}
							onChange={(e) =>
								setMinesGame((prev) => ({
									...prev,
									minesCount: Number.parseInt(e.target.value),
								}))
							}
							disabled={minesGame.isActive}
							className="bg-gray-900/50 px-3 py-2 border border-gray-700 rounded w-full text-white"
						>
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
								<option key={n} value={n}>
									{n}
								</option>
							))}
						</select>
					</div>

					<button
						onClick={onShowProvablyFair}
						className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 px-4 py-2 border border-green-600 rounded-lg transition"
					>
						<Shield size={20} />
						<span className="font-bold">Provably Fair</span>
					</button>
					<div>
						<label className="block mb-2 text-gray-400 text-sm">
							Grid Size
						</label>
						<select
							value={minesGame.gridSize}
							onChange={(e) =>
								setMinesGame((prev) => ({
									...prev,
									gridSize: Number.parseInt(e.target.value),
								}))
							}
							disabled={minesGame.isActive}
							className="bg-gray-900/50 px-3 py-2 border border-gray-700 rounded w-full text-white"
						>
							<option value={9}>3x3</option>
							<option value={16}>4x4</option>
							<option value={25}>5x5</option>
							<option value={36}>6x6</option>
						</select>
					</div>
				</div>

				{!minesGame.isActive ? (
					<button
						onClick={startMinesGame}
						className="bg-green-600 hover:bg-green-700 py-3 rounded-lg w-full font-bold transition cursor-pointer"
					>
						Start Game
					</button>
				) : (
					<div className="space-y-2">
						<div className="bg-gray-900/50 p-3 border border-gray-700 rounded text-center">
							<div className="text-gray-400 text-sm">Current Multiplier</div>
							<div className="font-bold text-green-400 text-2xl">
								{minesGame.currentMultiplier.toFixed(2)}x
							</div>
							<div className="text-gray-300 text-sm">
								Win: $
								{(minesGame.betAmount * minesGame.currentMultiplier).toFixed(2)}
							</div>
						</div>
						<button
							onClick={cashoutMines}
							disabled={minesGame.revealedTiles.length === 0}
							className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 py-3 rounded-lg w-full font-bold transition"
						>
							Cashout
						</button>
					</div>
				)}
			</div>

			<div
				className="gap-2 grid"
				style={{
					gridTemplateColumns: `repeat(${Math.sqrt(minesGame.gridSize)}, minmax(0, 1fr))`,
				}}
			>
				{Array.from({ length: minesGame.gridSize }, (_, i) => {
					const isRevealed = minesGame.revealedTiles.includes(i);
					const isMine = minesGame.minePositions.includes(i);
					const showMine = minesGame.gameOver && isMine;

					return (
						<button
							key={i}
							onClick={() => revealTile(i)}
							disabled={!minesGame.isActive || isRevealed}
							className={`cursor-pointer aspect-square rounded-lg font-bold text-lg transition-all ${
								isRevealed && !isMine
									? 'bg-green-600'
									: showMine
										? 'bg-red-600'
										: 'bg-gray-800/50 border border-gray-700 hover:bg-gray-700'
							} ${isRevealed ? 'scale-95' : ''}`}
						>
							{showMine ? '💣' : isRevealed ? '💎' : ''}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default MinesGame;
