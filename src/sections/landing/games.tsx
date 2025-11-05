import {
	Coins,
	DollarSign,
	Grid3x3,
	History,
	RotateCw,
	User,
	Users,
	Wifi,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import CoinflipGame from '../games/CoinflipGame';
import MinesGame from '../games/MinesGame';
import RouletteGame from '../games/RouletteGame';
import ProvablyFairModal from './provable-modal';
import BetVerificationModal from './verify.model';

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
	path: '/socket.io',
	reconnection: true,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 3000,
	reconnectionAttempts: 5,
});

const Games = () => {
	const [user, setUser] = useState<{
		id: string;
		username: string;
	} | null>(null);

	const [balance, setBalance] = useState(0);

	const [activeGame, setActiveGame] = useState('mines');
	const [history, setHistory] = useState<any[]>([]);
	const [onlineUsers, setOnlineUsers] = useState(0);
	const [isConnected, setIsConnected] = useState(false);
	// const [showModal, setShowModal] = useState(true);
	// const [formData, setFormData] = useState({
	// 	username: '',
	// });

	const [showProvablyFair, setShowProvablyFair] = useState(false);
	const [showBetVerification, setShowBetVerification] = useState(false);
	const [selectedGame, setSelectedGame] = useState<any>(null);

	// Socket.io Event Handlers
	useEffect(() => {
		socket.on('connect', () => {
			setIsConnected(true);
		});

		socket.on('disconnect', () => {
			setIsConnected(false);
		});

		socket.on('auth:success', (data: any) => {
			console.log('Authenticated:', data);
			setUser(data.user);
			socket.emit('user:balance');
			socket.emit('game:history', { limit: 50, skip: 0 });
		});

		socket.on('balance:update', (data: any) => {
			console.log('💰 [balance:update] Received:', data);

			setBalance((prev) => {
				const newBalance = data.balance;
				if (prev !== newBalance) {
					console.log(`🔄 Balance updated from ${prev} to ${newBalance}`);
				}
				return newBalance;
			});
		});

		socket.on('users:online', (data: any) => {
			console.log('👥 [users:online] Online users count:', data.count);
			setOnlineUsers(data.count);
		});

		socket.on('game-history:result', (data) => {
			console.log('📜 [game-history:result] Received:', data);
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

			console.log(
				'🧩 [game-history:result] Formatted history:',
				formattedHistory,
			);
			setHistory(formattedHistory);
		});

		// Mines game history
		socket.on('mines:result', (data: any) => {
			setTimeout(() => {
				console.log('🚀 ~ file: games.tsx:151 ~ socket.on ~ data:', data);

				socket.emit('game:history', { limit: 50, skip: 0 });
			}, 2000);

			// addToHistory(
			// 	data.gameId,
			// 	'mines',
			// 	data.profit,
			// 	{ result: 'Lost' },
			// 	data.time,
			// );
		});

		socket.on('mines:cashedOut', (data: any) => {
			console.log('🚀 ~ Games ~ data:', data);
		});

		// Coinflip game history
		socket.on('coinflip:result', (data: any) => {
			console.log('🚀 ~ Games ~ data:', data);

			// addToHistory(
			// 	data.gameId,
			// 	'coinflip',
			// 	data.profit,
			// 	{ result: data.won ? 'Win' : 'Lost' },
			// 	data.time,
			// );
		});

		// Roulette game history
		socket.on('roulette:result', (data: any) => {
			console.log('🚀 ~ Games ~ data:', data);

			// if (data.winners && data.winners.length > 0) {
			// 	// biome-ignore lint/complexity/noForEach: <explanation>
			// 	data.winners.forEach((winner: any) => {
			// 		addToHistory(
			// 			data.roundId,
			// 			'roulette',
			// 			winner.profit,
			// 			{ result: 'Win', color: data.winningColor },
			// 			data.time,
			// 		);
			// 	});
			// }
		});

		socket.on('error', (data: any) => {
			alert(data.message);
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('auth:success');
			socket.off('balance:update');
			socket.off('users:online');
			socket.off('game-history:result');
			socket.off('mines:result');
			socket.off('mines:cashedOut');
			socket.off('coinflip:result');
			socket.off('roulette:result');
			socket.off('error');
		};
	}, []);

	// const addToHistory = (
	// 	gameId: string,
	// 	gameType: string,
	// 	profit: number,
	// 	details: any,
	// 	time: any,
	// ) => {
	// 	setHistory((prev) => [
	// 		{
	// 			id: gameId,
	// 			gameType,
	// 			profit: Number.parseFloat(profit.toFixed(2)),
	// 			details,
	// 			time: new Date(time).toLocaleTimeString(),
	// 		},
	// 		...prev,
	// 	]);
	// };

	// const handleRegister = async () => {
	// 	if (!formData.username.trim()) {
	// 		alert('Please enter a username');
	// 		return;
	// 	}

	// 	try {
	// 		const response = await fetch(`${socketUrl}/api/users/register`, {
	// 			method: 'POST',
	// 			headers: { 'Content-Type': 'application/json' },
	// 			body: JSON.stringify({ username: formData.username }),
	// 		});

	// 		const data = await response.json();

	// 		if (!response.ok) {
	// 			alert(data.error || 'Failed to register');
	// 			return;
	// 		}

	// 		const newUser = {
	// 			id: data.user.id,
	// 			username: data.user.username,
	// 			balance: data.balance,
	// 		};

	// 		setUser(newUser);
	// 		setShowModal(false);
	// 		socket.emit('auth', { userId: newUser.id });
	// 	} catch (error) {
	// 		console.error('Register failed:', error);
	// 		alert('Something went wrong while registering.');
	// 	}
	// };

	// if (!user) {
	// 	return (
	// 		<div className="flex justify-center items-center bg-gray-900 min-h-screen text-white">
	// 			{showModal && (
	// 				<div className="bg-gray-800 shadow-2xl p-6 border border-gray-700 rounded-xl w-full max-w-sm">
	// 					<h2 className="mb-4 font-bold text-2xl text-center">
	// 						Register to Play
	// 					</h2>
	// 					<div className="space-y-4">
	// 						<div>
	// 							<label className="block mb-2 text-gray-400 text-sm">
	// 								Username
	// 							</label>
	// 							<input
	// 								type="text"
	// 								value={formData.username}
	// 								onChange={(e) =>
	// 									setFormData((prev) => ({
	// 										...prev,
	// 										username: e.target.value,
	// 									}))
	// 								}
	// 								className="bg-gray-900 px-3 py-2 border border-gray-700 rounded w-full text-white"
	// 								placeholder="Enter your name"
	// 							/>
	// 						</div>
	// 						<button
	// 							onClick={handleRegister}
	// 							className="bg-green-600 hover:bg-green-700 py-2 rounded w-full font-bold transition"
	// 						>
	// 							Start Playing
	// 						</button>
	// 					</div>
	// 				</div>
	// 			)}
	// 		</div>
	// 	);
	// }

	// If no user, loading state
	if (!user) {
		return (
			<div className="flex justify-center items-center bg-gray-900 min-h-screen text-white">
				<div>Loading... Fetching Data to Socket</div>
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
						<div className="font-bold text-2xl">Games</div>
						<div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 border border-gray-700 rounded-lg">
							<User size={20} />
							<span>{user.username}</span>
						</div>
						<div
							className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
								isConnected
									? 'bg-green-600/20 border border-green-600'
									: 'bg-red-600/20 border border-red-600'
							}`}
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
						<span className="font-bold text-xl">{balance.toFixed(2)}</span>
					</div>
				</div>

				{/* Game Selection Buttons */}
				<div className="gap-4 grid md:grid-cols-4 mb-6">
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
					<button
						onClick={() => setActiveGame('roulette')}
						className={`p-4 rounded-lg font-bold flex items-center gap-2 justify-center transition border-2 ${
							activeGame === 'roulette'
								? 'bg-purple-600 border-purple-400'
								: 'bg-gray-800/50 border-gray-700 hover:bg-gray-700'
						}`}
					>
						<RotateCw size={24} />
						Roulette
					</button>
				</div>

				<div className="gap-6 grid lg:grid-cols-3">
					<div className="lg:col-span-2">
						{/* Render Active Game Component */}
						{activeGame === 'mines' && (
							<MinesGame
								socket={socket}
								balance={balance}
								onShowProvablyFair={() => setShowProvablyFair(true)}
							/>
						)}

						{activeGame === 'coinflip' && (
							<CoinflipGame balance={balance} socket={socket} />
						)}

						{activeGame === 'roulette' && (
							<RouletteGame balance={balance} socket={socket} />
						)}
					</div>

					{/* History Sidebar */}
					<div className="bg-gray-800/50 backdrop-blur p-4 border border-gray-700 rounded-lg">
						<div className="flex items-center gap-2 mb-4">
							<History size={20} />
							<h3 className="font-bold">Recent Games</h3>
						</div>

						<div className="space-y-2 max-h-100 overflow-y-auto">
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
