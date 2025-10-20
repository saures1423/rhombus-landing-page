import {
	Coins,
	DollarSign,
	Grid3x3,
	History,
	Shield,
	User,
	Users,
	Wifi,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { io } from 'socket.io-client';
import ProvablyFairModal from './provable-modal';
import BetVerificationModal from './verify.model';

// const socketUrl =
// 	process.env.NODE_ENV === 'production'
// 		? 'https://housegames-backend-production.up.railway.app'
// 		: 'http://localhost:5002';

const socketUrl = import.meta.env.VITE_SOCKET_URL;

const socket = io(`${socketUrl}/game`, {
	auth: {
		token:
			'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ilc1ZGlybTVmR3dpQ3dDOUtPaEl4UGlKWDQ3YlpJMkk5M2RDaUxuMnUvekU9IiwidXNlcm5hbWUiOiJsZXMxNDIzIiwiaWF0IjoxNzYwNTIzNjUzLCJleHAiOjE3NjA5NTU2NTN9.qziUrFp1AET6kCeXBaVhZhxLuTOLrDz6CKTnEE0pMqmHMLUHiRfjXpXuhLpOrZL5VgBKKs5J3kCIhQFrWNaljw',
		discordId: '1215664714206552145',
	},
	extraHeaders: {
		'x-api-key':
			'sk_ceed97507cef15baa5ec0b9a64eb36f01cdbe6ed2d47a25558fdd712ef08903e',
	},
	reconnection: true,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	reconnectionAttempts: 5,
});

const Games = () => {
	const [user, setUser] = useState<{
		id: string;
		username: string;
		balance: number;
	} | null>(null);

	const [activeGame, setActiveGame] = useState('mines');
	const [history, setHistory] = useState<any[]>([]);
	const [onlineUsers, setOnlineUsers] = useState(0);
	const [isConnected, setIsConnected] = useState(false);
	const [showModal, setShowModal] = useState(true);
	const [formData, setFormData] = useState({
		username: '',
		initialBalance: 1000,
	});

	const [showProvablyFair, setShowProvablyFair] = useState(false);
	const [showBetVerification, setShowBetVerification] = useState(false);

	const [selectedGame, setSelectedGame] = useState<any>(null);

	// Mines State
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

	// Coinflip State
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
	// Socket.io Event Handlers
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Connection events
		socket.on('connect', () => {
			setIsConnected(true);
			// socket.emit('auth:login', {
			// 	tenantId: 'tenant_1760519620144_347f0a80',
			// 	username: 'dasd',
			// });
		});

		socket.on('disconnect', () => {
			setIsConnected(false);
		});

		socket.on('auth:success', (data: any) => {
			console.log('Authenticated:', data);

			setUser(data.user);

			socket.emit('game:history', { limit: 50, skip: 0 });
		});

		socket.on('balance:update', (data: any) => {
			setUser((prev) => {
				if (!prev) return null;

				return {
					...prev,
					balance: data.balance,
				};
			});
		});

		// Online users
		socket.on('users:online', (data: any) => {
			setOnlineUsers(data.count);
		});

		// History Games
		socket.on('game-history:result', (data) => {
			if (!data?.history) return;

			const formattedHistory = data.history.map((h: any) => ({
				id: h._id,
				details: {
					betAmount: h.betAmount,
					result: h.result,
				},
				time: new Date(h.createdAt).toLocaleTimeString(),
				...h,
			}));

			setHistory(formattedHistory);
		});

		// Mines events
		socket.on('mines:started', (data: any) => {
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
			setMinesGame((prev) => ({
				...prev,
				revealedTiles: [...prev.revealedTiles, data.tileIndex],
				currentMultiplier: data.currentMultiplier,
			}));
		});

		socket.on('mines:result', (data: any) => {
			setMinesGame((prev) => ({
				...prev,
				isActive: false,
				gameOver: true,
				minePositions: data.minePositions,
			}));

			addToHistory(
				data.gameId,
				'mines',
				data.profit,
				{ result: 'Lost' },
				data.time,
			);
		});

		socket.on('mines:cashedOut', (data: any) => {
			setMinesGame((prev) => ({
				...prev,
				isActive: false,
				gameOver: true,
				minePositions: data.minePositions,
			}));
			socket.emit('game:history', { limit: 50, skip: 0 });

			addToHistory(
				data.gameId,
				'mines',
				data.profit,
				{ result: 'Win' },
				data.time,
			);
		});

		// Coinflip events
		socket.on('coinflip:flipping', (data) => {
			setCoinflip((prev) => ({ ...prev, isFlipping: data.isFlipping }));
		});

		socket.on('coinflip:result', (data: any) => {
			setCoinflip((prev) => ({
				...prev,
				result: data.result,
				won: data.won,
			}));

			addToHistory(
				data.gameId,
				'coinflip',
				data.profit,
				{ result: 'Win' },
				data.time,
			);
		});

		socket.on('error', (data: any) => {
			alert(data.message);
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('auth:success');
			socket.off('game:history');
			socket.off('balance:update');
			socket.off('users:online');
			socket.off('mines:started');
			socket.off('mines:tileRevealed');
			socket.off('mines:result');
			socket.off('mines:cashedOut');
			socket.off('coinflip:flipping');
			socket.off('coinflip:result');
			socket.off('error');
			socket.off('mines:restored');
			socket.off('check-unfinished-games');
		};
	}, [user, socket]);

	const addToHistory = (
		gameId: string,
		gameType: string,
		profit: number,
		details: any,
		time,
	) => {
		setHistory((prev) => [
			{
				id: gameId,
				gameType,
				// biome-ignore lint/style/useNumberNamespace: <explanation>
				profit: parseFloat(profit.toFixed(2)),
				details,
				time: new Date(time).toLocaleTimeString(),
			},
			...prev,
		]);
	};

	// Mines Functions
	const startMinesGame = () => {
		if (!user) {
			alert('You must be logged in to play!');
			return;
		}

		if (user.balance < minesGame.betAmount) {
			alert('Insufficient balance!');
			return;
		}
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

	// Coinflip Functions
	const playCoinflip = () => {
		if (!user) {
			alert('You must be logged in to play!');
			return;
		}

		if (user.balance < coinflip.betAmount) {
			alert('Insufficient balance!');
			return;
		}

		socket.emit('coinflip:play', {
			betAmount: coinflip.betAmount,
			choice: coinflip.choice,
		});
	};

	const handleRegister = async () => {
		if (!formData.username.trim()) {
			alert('Please enter a username');
			return;
		}

		try {
			const response = await fetch(`${socketUrl}/api/users/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username: formData.username }),
			});

			const data = await response.json();

			if (!response.ok) {
				alert(data.error || 'Failed to register');
				return;
			}

			const newUser = {
				id: data.user.id,
				username: data.user.username,
				balance: data.user.balance,
			};

			setUser(newUser);
			setShowModal(false);

			socket.emit('auth', { userId: newUser.id });
		} catch (error) {
			console.error('Register failed:', error);
			alert('Something went wrong while registering.');
		}
	};

	if (!user) {
		return (
			<div className="flex justify-center items-center bg-gray-900 min-h-screen text-white">
				{showModal && (
					<div className="bg-gray-800 shadow-2xl p-6 border border-gray-700 rounded-xl w-full max-w-sm">
						<h2 className="mb-4 font-bold text-2xl text-center">
							Register to Play 🎲
						</h2>
						<div className="space-y-4">
							<div>
								<label className="block mb-2 text-gray-400 text-sm">
									Username
								</label>
								<input
									type="text"
									value={formData.username}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											username: e.target.value,
										}))
									}
									className="bg-gray-900 px-3 py-2 border border-gray-700 rounded w-full text-white"
									placeholder="Enter your name"
								/>
							</div>
							<div>
								<label className="block mb-2 text-gray-400 text-sm">
									Starting Balance
								</label>
								<input
									type="number"
									value={formData.initialBalance}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											initialBalance: Number.parseFloat(e.target.value),
										}))
									}
									className="bg-gray-900 px-3 py-2 border border-gray-700 rounded w-full text-white"
									min="100"
								/>
							</div>
							<button
								onClick={handleRegister}
								className="bg-green-600 hover:bg-green-700 py-2 rounded w-full font-bold transition"
							>
								Start Playing
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 p-4 min-h-screen text-white">
			<div className="mx-auto max-w-6xl">
				{showProvablyFair && (
					<ProvablyFairModal
						isOpen={showProvablyFair}
						onClose={() => setShowProvablyFair(false)}
						user={user}
						socket={socket}
					/>
				)}

				{/* Bet Verification Modal */}
				{showBetVerification && selectedGame && (
					<BetVerificationModal
						isOpen={showBetVerification}
						bet={selectedGame}
						socket={socket}
						onClose={() => setShowBetVerification(false)}
					/>
				)}

				{/* Header */}
				<div className="flex justify-between items-center bg-gray-800/50 backdrop-blur mb-6 p-4 border border-gray-700 rounded-lg">
					<div className="flex items-center gap-4">
						<div className="font-bold text-2xl">🎰 Casino Live</div>
						<div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 border border-gray-700 rounded-lg">
							<User size={20} />
							<span>{user.username}</span>
						</div>
						<div
							className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isConnected ? 'bg-green-600/20 border border-green-600' : 'bg-red-600/20 border border-red-600'}`}
						>
							<Wifi size={16} />
							<span className="text-sm">
								{isConnected ? 'Connected' : 'Disconnected'}
							</span>
						</div>
						<div className="flex items-center gap-2 bg-purple-600/20 px-3 py-2 border border-purple-600 rounded-lg">
							<Users size={16} />
							<span className="text-sm">{onlineUsers} online</span>
						</div>
					</div>
					<div className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg">
						<DollarSign size={20} />
						<span className="font-bold text-xl">{user.balance.toFixed(2)}</span>
					</div>
				</div>

				<div className="gap-4 grid md:grid-cols-3 mb-6">
					<button
						onClick={() => setActiveGame('mines')}
						className={`p-4 rounded-lg font-bold flex items-center gap-2 justify-center transition border-2 ${
							activeGame === 'mines'
								? 'bg-purple-600 border-purple-400'
								: 'bg-gray-800/50 border-gray-700 hover:bg-gray-700'
						}`}
					>
						<Grid3x3 size={24} />
						Mines
					</button>
					<button
						onClick={() => setActiveGame('coinflip')}
						className={`p-4 rounded-lg font-bold flex items-center gap-2 justify-center transition border-2 ${
							activeGame === 'coinflip'
								? 'bg-purple-600 border-purple-400'
								: 'bg-gray-800/50 border-gray-700 hover:bg-gray-700'
						}`}
					>
						<Coins size={24} />
						Coinflip
					</button>
				</div>

				<div className="gap-6 grid lg:grid-cols-3">
					<div className="lg:col-span-2">
						{/* MINES GAME */}
						{activeGame === 'mines' && (
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
											<label className="block mb-2 text-gray-400 text-sm">
												Mines
											</label>
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
											onClick={() => setShowProvablyFair(true)}
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
												<div className="text-gray-400 text-sm">
													Current Multiplier
												</div>
												<div className="font-bold text-green-400 text-2xl">
													{minesGame.currentMultiplier.toFixed(2)}x
												</div>
												<div className="text-gray-300 text-sm">
													Win: $
													{(
														minesGame.betAmount * minesGame.currentMultiplier
													).toFixed(2)}
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
						)}

						{/* COINFLIP GAME */}
						{activeGame === 'coinflip' && (
							<div className="space-y-4">
								<div className="space-y-4 bg-gray-800/50 backdrop-blur p-4 border border-gray-700 rounded-lg">
									<div>
										<label className="block mb-2 text-gray-400 text-sm">
											Bet Amount
										</label>
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
													setCoinflip((prev) => ({ ...prev, choice: 'heads' }))
												}
												disabled={coinflip.isFlipping}
												className={`py-4 rounded-lg font-bold transition border-2 ${
													coinflip.choice === 'heads'
														? 'bg-blue-600 border-blue-400'
														: 'bg-gray-900/50 border-gray-700 hover:bg-gray-700'
												}`}
											>
												🪙 Heads
											</button>
											<button
												onClick={() =>
													setCoinflip((prev) => ({ ...prev, choice: 'tails' }))
												}
												disabled={coinflip.isFlipping}
												className={`py-4 rounded-lg font-bold transition border-2 ${
													coinflip.choice === 'tails'
														? 'bg-blue-600 border-blue-400'
														: 'bg-gray-900/50 border-gray-700 hover:bg-gray-700'
												}`}
											>
												🪙 Tails
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
										<div className="text-lg">
											Result: {coinflip.result.toUpperCase()}
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					{/* History Sidebar */}
					<div className="bg-gray-800/50 backdrop-blur p-4 border border-gray-700 rounded-lg">
						<div className="flex items-center gap-2 mb-4">
							<History size={20} />
							<h3 className="font-bold">Recent Games</h3>
						</div>

						<div className="space-y-2 max-h-96 overflow-y-auto">
							{history.length > 0 ? (
								history.map((item: any) => (
									// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
									<div
										key={item.id}
										className="bg-gray-700/50 hover:bg-gray-700 p-3 rounded transition cursor-pointer"
										onClick={() => {
											setSelectedGame(item);
											setShowBetVerification(true);
										}}
									>
										<div className="flex justify-between items-center mb-1">
											<span className="font-bold text-sm capitalize">
												{item.gameType}
											</span>
											<span
												className={`font-bold ${
													item.profit >= 0 ? 'text-green-400' : 'text-red-400'
												}`}
											>
												{item.profit >= 0 ? '+' : ''}
												{item.profit.toFixed(2)}
											</span>
										</div>
										<div className="text-gray-400 text-xs">{item.time}</div>
									</div>
								))
							) : (
								<div className="py-8 text-gray-500 text-center">
									No games played yet
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Games;
