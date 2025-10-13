import {
	Coins,
	DollarSign,
	Grid3x3,
	History,
	User,
	Users,
	Wifi,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5002');

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
		serverSeed: string | null;
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
		serverSeed: null,
	});

	// Coinflip State
	const [coinflip, setCoinflip] = useState<{
		betAmount: number;
		choice: 'heads' | 'tails';
		isFlipping: boolean;
		result: string | null;
	}>({
		betAmount: 10,
		choice: 'heads',
		isFlipping: false,
		result: null,
	});
	// Socket.io Event Handlers
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Connection events
		socket.on('connect', () => {
			setIsConnected(true);
			socket.emit('auth', { userId: user?.id });
		});

		socket.on('disconnect', () => {
			setIsConnected(false);
		});

		socket.on('auth:success', (data: any) => {
			console.log('Authenticated:', data);

			setUser(data.user);

			socket.emit('history:get', { userId: data.user.id, limit: 50, skip: 0 });
		});

		// Balance updates
		socket.on('balance:update', (data: any) => {
			setUser((prev) => {
				if (!prev) return null; // handle null explicitly

				return {
					...prev,
					balance: data.balance, // overwrite safely
				};
			});
		});

		// Online users
		socket.on('users:online', (data: any) => {
			setOnlineUsers(data.count);
		});

		// History Games
		socket.on('history:result', (data) => {
			if (!data?.history) return;

			const formattedHistory = data.history.map((h: any) => ({
				id: h._id,
				game: h.gameType,
				profit: h.profit,
				details: {
					betAmount: h.betAmount,
					result: h.result,
				},
				time: new Date(h.createdAt).toLocaleTimeString(),
			}));

			setHistory(formattedHistory);
		});

		// Mines events
		socket.on('mines:started', (data: any) => {
			setMinesGame((prev) => ({
				...prev,
				gameId: data.gameId,
				serverSeed: data.serverSeed,
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
			addToHistory('mines', data.profit, { result: 'Lost' });
		});

		socket.on('mines:cashedOut', (data: any) => {
			setMinesGame((prev) => ({
				...prev,
				isActive: false,
				gameOver: true,
				minePositions: data.minePositions,
			}));
			addToHistory('mines', data.profit, {
				result: 'Won',
				multiplier: minesGame.currentMultiplier,
			});
		});

		// Coinflip events
		socket.on('coinflip:flipping', () => {
			setCoinflip((prev) => ({ ...prev, isFlipping: true }));
		});

		socket.on('coinflip:result', (data: any) => {
			setCoinflip((prev) => ({
				...prev,
				isFlipping: false,
				result: data.result,
			}));
			addToHistory('coinflip', data.profit, {
				choice: coinflip.choice,
				result: data.result,
				won: data.won,
			});
			setTimeout(
				() => setCoinflip((prev) => ({ ...prev, result: null })),
				3000,
			);
		});

		socket.on('error', (data: any) => {
			alert(data.message);
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('auth:success');
			socket.off('history:result');
			socket.off('balance:update');
			socket.off('users:online');
			socket.off('mines:started');
			socket.off('mines:tileRevealed');
			socket.off('mines:result');
			socket.off('mines:cashedOut');
			socket.off('coinflip:flipping');
			socket.off('coinflip:result');
			socket.off('error');
		};
	}, [user, socket]);

	const addToHistory = (game: string, profit: number, details: any) => {
		setHistory((prev) => [
			{
				id: Date.now().toString(),
				game,
				// biome-ignore lint/style/useNumberNamespace: <explanation>
				profit: parseFloat(profit.toFixed(2)),
				details,
				time: new Date().toLocaleTimeString(),
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
			userId: user.id,
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
			const response = await fetch(
				`${process.env.REACT_APP_SOCKET_URL}/api/users/register`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ username: formData.username }),
				},
			);

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
									</div>

									{!minesGame.isActive ? (
										<button
											onClick={startMinesGame}
											className="bg-green-600 hover:bg-green-700 py-3 rounded-lg w-full font-bold transition"
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

								<div className="gap-2 grid grid-cols-5">
									{Array.from({ length: 25 }, (_, i) => {
										const isRevealed = minesGame.revealedTiles.includes(i);
										const isMine = minesGame.minePositions.includes(i);
										const showMine = minesGame.gameOver && isMine;

										return (
											<button
												key={i}
												onClick={() => revealTile(i)}
												disabled={!minesGame.isActive || isRevealed}
												className={`aspect-square rounded-lg font-bold text-lg transition-all ${
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

								{coinflip.result && (
									<div
										className={`p-6 rounded-lg text-center border-2 ${
											coinflip.result === coinflip.choice
												? 'bg-green-600/20 border-green-400'
												: 'bg-red-600/20 border-red-400'
										}`}
									>
										<div className="mb-2 text-6xl animate-bounce">🪙</div>
										<div className="font-bold text-2xl">
											{coinflip.result === coinflip.choice
												? 'YOU WIN!'
												: 'YOU LOSE!'}
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
							{history.map((item: any) => (
								<div key={item.id} className="bg-gray-700/50 p-3 rounded">
									<div className="flex justify-between items-center mb-1">
										<span className="font-bold text-sm capitalize">
											{item.game}
										</span>
										<span
											className={`font-bold ${item.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}
										>
											{item.profit >= 0 ? '+' : ''}
											{item.profit}
										</span>
									</div>
									<div className="text-gray-400 text-xs">{item.time}</div>
								</div>
							))}
							{history.length === 0 && (
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
