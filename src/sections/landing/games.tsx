import {
	Coins,
	DollarSign,
	Grid3x3,
	History,
	RotateCw,
	Shield,
	User,
	Users,
	Wifi,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { io } from 'socket.io-client';
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

	// Roulette State
	const [roulette, setRoulette] = useState<{
		bets: Record<string, number>;
		gamePhase: 'betting' | 'rolling' | 'completed';
		timeLeft: number;
		result: string | null;
		wheelOffset: number;
		isSpinning: boolean;
		history: string[];
		animationKey: number; // Add this to force re-render
	}>({
		bets: { black: 0, gold: 0, blue: 0, bait: 0 },
		gamePhase: 'betting',
		timeLeft: 15,
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
			socket.emit('game:history', { limit: 50, skip: 0 });
		});

		socket.on('balance:update', (data: any) => {
			console.log('💰 [balance:update] Received:', data);

			setUser((prev) => {
				if (!prev) return null;
				return {
					...prev,
					balance: data.balance,
				};
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

		// Mines events
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

			addToHistory(
				data.gameId,
				'mines',
				data.profit,
				{ result: 'Lost' },
				data.time,
			);
		});

		socket.on('mines:cashedOut', (data: any) => {
			console.log('💸 [mines:cashedOut] Player cashed out:', data);

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
			console.log('🪙 [coinflip:flipping] Flipping started:', data);
			setCoinflip((prev) => ({ ...prev, isFlipping: data.isFlipping }));
		});

		socket.on('coinflip:result', (data: any) => {
			console.log('🎲 [coinflip:result] Flip result received:', data);

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

		socket.on('roulette:roundCreated', (data) => {
			console.log('Round Created', data);
		});

		// Roulette events
		socket.on('roulette:gameStarting', (data) => {
			console.log('🎲 Game starting:', data);
			setRoulette((prev) => ({
				...prev,
				gamePhase: data.phase,
				timeLeft: data.bettingTime,
				result: null,
				isSpinning: data.isSpinning,
				wheelOffset: 0,
				animationKey: prev.animationKey + 1,
			}));
		});

		socket.on('roulette:timer', (data) => {
			setRoulette((prev) => ({
				...prev,
				timeLeft: data.timeLeft,
				gamePhase: data.phase,
			}));
		});

		socket.on('roulette:betPlaced', (data) => {
			console.log('✅ Bet placed successfully', data);
		});

		socket.on('roulette:betConfirmed', (data) => {
			console.log('✅ Bet Confirmed successfully', data);
			setUser((prev) => {
				if (!prev) return null;
				return { ...prev, balance: data.balance };
			});

			setRoulette((prev) => ({
				...prev,
				bets: { black: 0, gold: 0, blue: 0, bait: 0 },
			}));
		});

		socket.on('roulette:rolling', (data) => {
			console.log('🎰 Rolling started:', data);

			// Reset position and start spinning with multiple loops
			setRoulette((prev) => ({
				...prev,
				gamePhase: data.phase,
				isSpinning: data.isSpinning,
				wheelOffset: 0,
				result: null,
				animationKey: prev.animationKey + 1,
			}));

			// Start continuous spinning animation
			setTimeout(() => {
				setRoulette((prev) => {
					// Spin through 6 full loops (60 items total in 3 sequences)
					const itemWidth = 120 + 8; // 120px width + 8px gap
					const sequenceLength = colorSequence.length;

					// Spin through exactly 6 full sequences (60 items)
					// This ensures smooth looping during the rolling phase
					const loopOffset = itemWidth * sequenceLength * 6;

					return {
						...prev,
						wheelOffset: loopOffset,
					};
				});
			}, 100);
		});

		// socket.on('roulette:result', (data) => {
		// 	console.log('Result received:', data);

		// 	// Small delay to ensure the spinning animation has started
		// 	setTimeout(() => {
		// 		const winningColorIndex = colorSequence.indexOf(data.winningColor);

		// 		// Calculate final position:
		// 		// - Position in middle set (colorSequence.length * 120)
		// 		// - Plus offset to winning color (winningColorIndex * 120)
		// 		// - Plus half item width to center it (60)
		// 		const middleSetOffset = colorSequence.length * 120;
		// 		const colorOffset = winningColorIndex * 120;
		// 		const centeringOffset = 60;
		// 		const finalOffset = middleSetOffset + colorOffset + centeringOffset;

		// 		setRoulette((prev) => ({
		// 			...prev,
		// 			result: data.winningColor,
		// 			gamePhase: 'completed',
		// 			isSpinning: data.isSpinning,
		// 			wheelOffset: finalOffset,
		// 			history: [data.winningColor, ...prev.history.slice(0, 99)],
		// 		}));

		// 		if (data.winners && data.winners.length > 0) {
		// 			// biome-ignore lint/complexity/noForEach: <explanation>
		// 			data.winners.forEach((winner: any) => {
		// 				addToHistory(
		// 					data.roundId,
		// 					'roulette',
		// 					winner.profit,
		// 					{ result: 'Win', color: data.winningColor },
		// 					new Date().toLocaleTimeString(),
		// 				);
		// 			});
		// 		}
		// 	}, 200);
		// });

		socket.on('roulette:result', (data) => {
			console.log('✨ Result received:', data);

			// Wait for spin animation to be in progress
			setTimeout(() => {
				const itemWidth = 128; // 120px + 8px gap
				const winningIndex = colorSequence.indexOf(data.winningColor);

				if (winningIndex === -1) {
					console.error('Invalid winning color:', data.winningColor);
					return;
				}

				// Calculate final position:
				// 1. Complete several full loops (for dramatic effect)
				// 2. Land on the winning color in a middle sequence
				// 3. Center it perfectly on the indicator
				const fullLoops = 5; // Number of complete sequences to spin through
				const middleSequenceStart = 3; // Which sequence to land in (0-indexed)
				const centerOffset = 64; // Half of item width to center it

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
					gamePhase: data.phase,
					history: [data.winningColor, ...prev.history.slice(0, 99)],
				}));

				if (data.winners && data.winners.length > 0) {
					// biome-ignore lint/complexity/noForEach: <explanation>
					data.winners.forEach((winner: any) => {
						addToHistory(
							data.roundId,
							'roulette',
							winner.profit,
							{ result: 'Win', color: data.winningColor },
							data.time,
						);
					});
				}
			}, 300);
		});

		socket.on('roulette:history', (data) => {
			console.log('🚀 ~ Games ~ data:', data);
			setRoulette((prev) => ({
				...prev,
				history: data.results || [],
			}));
		});

		socket.on('roulette:noBets', (data) => {
			console.log('🚀 ~ Games ~ data:', data);
			console.log(data);
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

			socket.off('mines:started');
			socket.off('mines:tileRevealed');
			socket.off('mines:result');
			socket.off('mines:cashedOut');

			socket.off('coinflip:flipping');
			socket.off('coinflip:result');

			socket.off('roulette:roundCreated');
			socket.off('roulette:gameStarting');
			socket.off('roulette:timer');
			socket.off('roulette:rolling');
			socket.off('roulette:result');
			socket.off('roulette:betConfirmed');
			socket.off('roulette:noBets');
			socket.off('roulette:history');
			socket.off('roulette:betPlaced');
			socket.off('error');
		};
	}, []);

	const addToHistory = (
		gameId: string,
		gameType: string,
		profit: number,
		details: any,
		time: any,
	) => {
		setHistory((prev) => [
			{
				id: gameId,
				gameType,
				profit: Number.parseFloat(profit.toFixed(2)),
				details,
				time: new Date(time).toLocaleTimeString(),
			},
			...prev,
		]);
	};

	// Mines Functions
	const startMinesGame = () => {
		if (!user || user.balance < minesGame.betAmount) {
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
		if (!user || user.balance < coinflip.betAmount) {
			alert('Insufficient balance!');
			return;
		}
		socket.emit('coinflip:play', {
			betAmount: coinflip.betAmount,
			choice: coinflip.choice,
		});
	};

	// Roulette Functions
	const addRouletteBet = (color: string, amount: number) => {
		if (roulette.gamePhase !== 'betting') {
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
		if (totalBet === 0 || !user || roulette.gamePhase !== 'betting') {
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
							Register to Play
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
		transition: none; /* Remove default transition */
	}
	
	/* Spinning state - continuous smooth animation */
	.wheel.spinning {
		transition: transform 8s cubic-bezier(0.25, 0.1, 0.25, 1);
	}
	
	/* Stopped state - dramatic deceleration */
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
	
	.wheel-item::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 10px;
		background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
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
			box-shadow: 
				0 0 20px rgba(255,215,0,0.8),
				0 0 40px rgba(255,215,0,0.4);
		}
		50% { 
			box-shadow: 
				0 0 30px rgba(255,215,0,1),
				0 0 60px rgba(255,215,0,0.6);
		}
	}

	.wheel.spinning ~ .center-indicator {
		animation: pulse-glow 1s ease-in-out infinite;
	}

	/* Phase indicator styles */
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
						<span className="font-bold text-xl">{user.balance.toFixed(2)}</span>
					</div>
				</div>

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
										<div className="text-lg">
											Result: {coinflip.result.toUpperCase()}
										</div>
									</div>
								)}
							</div>
						)}

						{/* ROULETTE GAME */}
						{activeGame === 'roulette' && (
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
												roulette.gamePhase === 'betting'
													? 'phase-betting'
													: roulette.gamePhase === 'rolling'
														? 'phase-rolling'
														: 'phase-completed'
											}`}
										>
											{roulette.gamePhase === 'betting' && '🎲 Place Your Bets'}
											{roulette.gamePhase === 'rolling' && '🎰 Spinning...'}
											{roulette.gamePhase === 'completed' && '✨ Winner!'}
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
												{/* Render multiple sequences for infinite loop effect */}
												{[
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
															backgroundColor:
																colors[color as keyof typeof colors].color,
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
											roulette.result
												? 'text-yellow-400 scale-110'
												: 'text-gray-500'
										}`}
									>
										{roulette.result
											? colors[roulette.result as keyof typeof colors].label
											: 'WAITING...'}
									</div>

									<div className="flex justify-center items-center gap-4">
										<div className="bg-gray-900/50 px-4 py-2 border border-gray-700 rounded-lg">
											<div className="mb-1 text-gray-400 text-xs">
												Time Left
											</div>
											<div className="font-bold text-white text-2xl">
												{roulette.timeLeft}s
											</div>
										</div>

										{totalBet > 0 && (
											<div className="bg-green-600/20 px-4 py-2 border border-green-600 rounded-lg">
												<div className="mb-1 text-green-400 text-xs">
													Your Bet
												</div>
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
											{roulette.history
												.slice(0, 10)
												.map((historyColor, idx) => (
													<div
														key={idx}
														className="flex justify-center items-center shadow-lg border-2 rounded-lg min-w-[50px] h-12 font-bold text-xl hover:scale-110 transition-transform"
														style={{
															backgroundColor:
																colors[historyColor as keyof typeof colors]
																	.color,
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
											disabled={roulette.gamePhase !== 'betting'}
											className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-2 py-2 rounded font-bold text-xs transition"
										>
											+10
										</button>
										<button
											onClick={() => addRouletteBet('black', 100)}
											disabled={roulette.gamePhase !== 'betting'}
											className="bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 px-2 py-2 rounded font-bold text-xs transition"
										>
											+100
										</button>
										<button
											onClick={() =>
												addRouletteBet('black', Math.floor(user.balance / 4))
											}
											disabled={
												roulette.gamePhase !== 'betting' || user.balance === 0
											}
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
												disabled={roulette.gamePhase !== 'betting'}
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
													$
													{
														roulette.bets[
															colorKey as keyof typeof roulette.bets
														]
													}
												</div>
											</button>
										))}
									</div>

									{/* Place Bet Button */}
									<button
										onClick={placeBet}
										disabled={
											roulette.gamePhase !== 'betting' || totalBet === 0
										}
										className="bg-gradient-to-r from-green-600 hover:from-green-500 disabled:from-gray-600 to-green-500 hover:to-green-400 disabled:to-gray-600 disabled:opacity-50 shadow-lg hover:shadow-green-500/50 py-4 rounded-lg w-full font-bold text-lg transition-all"
									>
										{totalBet > 0
											? `PLACE BET - $${totalBet}`
											: 'SELECT YOUR BETS'}
									</button>
								</div>
							</div>
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
