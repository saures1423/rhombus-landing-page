import {
	Bomb,
	Check,
	ChevronDown,
	ChevronUp,
	Copy,
	Gem,
	RefreshCw,
	Shield,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const ProvablyFairModal = ({ isOpen, onClose, user, socket }) => {
	const [seedInfo, setSeedInfo] = useState({
		serverSeedHash: '',
		clientSeed: '',
		nonce: 0,
	});
	const [newClientSeed, setNewClientSeed] = useState('');
	const [previousSeeds, setPreviousSeeds] = useState([]);
	const [verificationResult, setVerificationResult] = useState(null);
	const [activeTab, setActiveTab] = useState('current');
	const [gamesForSeed, setGamesForSeed] = useState([]);
	const [selectedSeedId, setSelectedSeedId] = useState(null);

	// Manual verification state
	const [manualVerify, setManualVerify] = useState({
		gameType: 'mines',
		clientSeed: '',
		serverSeed: '',
		nonce: 0,
		minesCount: 3,
		gridSize: 25,
	});
	const [manualResult, setManualResult] = useState(null);
	const [showCalculation, setShowCalculation] = useState(false);
	const [showResultModal, setShowResultModal] = useState(false);

	useEffect(() => {
		if (isOpen && user) {
			socket.emit('seed:getInfo', { userId: user.id });
			socket.emit('seed:getPrevious', { userId: user.id, limit: 10 });

			socket.on('seed:gamesList', (data) => {
				setGamesForSeed(data.games);
			});

			socket.on('seed:info', (data) => {
				setSeedInfo(data);
				setNewClientSeed(data.clientSeed);
			});

			socket.on('seed:previousList', (data) => {
				setPreviousSeeds(data.seeds);
			});

			socket.on('seed:verificationResult', (data) => {
				setVerificationResult(data);
			});

			socket.on('seed:manualVerificationResult', (data) => {
				setManualResult(data);

				if (data.valid) {
					setShowResultModal(true);
				}
			});

			socket.on('seed:updated', (data) => {
				setSeedInfo(data);
				alert('Client seed updated successfully!');
			});

			socket.on('seed:rotated', (data) => {
				setSeedInfo({
					serverSeedHash: data.newServerSeedHash,
					clientSeed: data.newClientSeed,
					nonce: data.newNonce,
				});
				alert(
					`Seed rotated! Old server seed revealed: ${data.revealedServerSeed.substring(0, 20)}...`,
				);
				socket.emit('seed:getPrevious', { userId: user.id, limit: 10 });
			});

			return () => {
				socket.off('seed:info');
				socket.off('seed:previousList');
				socket.off('seed:updated');
				socket.off('seed:rotated');
				socket.off('seed:verificationResult');
				socket.off('seed:gamesList');
				socket.off('seed:manualVerificationResult');
			};
		}
	}, [isOpen, user, socket]);

	const handleUpdateClientSeed = () => {
		if (newClientSeed.length < 8) {
			alert('Client seed must be at least 8 characters');
			return;
		}
		socket.emit('seed:updateClient', { userId: user.id, newClientSeed });
	};

	const handleRotateSeed = () => {
		if (
			confirm(
				'Are you sure? This will reveal your current server seed and create a new one.',
			)
		) {
			socket.emit('seed:rotate', { userId: user.id });
		}
	};

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		alert('Copied to clipboard!');
	};

	const viewGamesForSeed = (seedId) => {
		setSelectedSeedId(seedId);
		socket.emit('seed:getGames', { userId: user.id, seedPairId: seedId });
	};

	const verifySpecificGame = (gameId) => {
		socket.emit('seed:verify', { userId: user.id, gameId });
	};

	const handleManualVerify = () => {
		if (!manualVerify.clientSeed || !manualVerify.serverSeed) {
			alert('Please fill in both client seed and server seed');
			return;
		}

		socket.emit('seed:manualVerify', {
			gameType: manualVerify.gameType,
			clientSeed: manualVerify.clientSeed,
			serverSeed: manualVerify.serverSeed,
			nonce: manualVerify.nonce,
			minesCount: manualVerify.minesCount,
			gridSize: manualVerify.gridSize,
		});
	};

	const renderMinesGrid = (minePositions, gridSize = 25) => {
		const rows = Math.sqrt(gridSize);
		const cells = [];

		for (let i = 0; i < gridSize; i++) {
			const isMine = minePositions.includes(i);
			cells.push(
				<div
					key={i}
					className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
						isMine
							? 'bg-red-900/40 border-2 border-red-500/50'
							: 'bg-teal-900/40 border-2 border-teal-500/30'
					}`}
				>
					{isMine ? (
						<Bomb size={20} className="text-red-400" />
					) : (
						<Gem size={20} className="text-teal-400" />
					)}
				</div>,
			);
		}

		return (
			<div
				className="gap-2 grid mx-auto p-4 max-w-md"
				style={{ gridTemplateColumns: `repeat(${rows}, minmax(0, 1fr))` }}
			>
				{cells}
			</div>
		);
	};
	if (!isOpen) return null;

	return (
		<div className="z-50 fixed inset-0 flex justify-center items-center bg-black/80 backdrop-blur-sm p-4">
			<div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="top-0 sticky flex justify-between items-center bg-gray-900 p-6 border-gray-700 border-b">
					<div className="flex items-center gap-3">
						<Shield size={28} className="text-green-400" />
						<div>
							<h2 className="font-bold text-2xl">Provably Fair</h2>
							<p className="text-gray-400 text-sm">Verify game fairness</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="hover:bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white transition"
					>
						<X size={24} />
					</button>
				</div>

				{/* Tabs */}
				<div className="flex border-gray-700 border-b">
					<button
						onClick={() => setActiveTab('current')}
						className={`flex-1 px-6 py-4 font-bold transition ${
							activeTab === 'current'
								? 'bg-gray-800 border-b-2 border-green-400 text-white'
								: 'text-gray-400 hover:text-white'
						}`}
					>
						Current Seeds
					</button>
					<button
						onClick={() => setActiveTab('history')}
						className={`flex-1 px-6 py-4 font-bold transition ${
							activeTab === 'history'
								? 'bg-gray-800 border-b-2 border-green-400 text-white'
								: 'text-gray-400 hover:text-white'
						}`}
					>
						Seed History
					</button>
					<button
						onClick={() => setActiveTab('verify')}
						className={`flex-1 px-6 py-4 font-bold transition ${
							activeTab === 'verify'
								? 'bg-gray-800 border-b-2 border-green-400 text-white'
								: 'text-gray-400 hover:text-white'
						}`}
					>
						Verify
					</button>
				</div>

				{/* Content */}
				<div className="space-y-6 p-6">
					{/* Current Seeds Tab */}
					{activeTab === 'current' && (
						<>
							<div className="space-y-4 bg-gray-800/50 p-6 border border-gray-700 rounded-lg">
								<div>
									<div className="flex justify-between items-center mb-2">
										<label className="font-bold text-gray-400 text-sm">
											Server Seed Hash
										</label>
										<button
											onClick={() => copyToClipboard(seedInfo.serverSeedHash)}
											className="text-gray-400 hover:text-white"
										>
											<Copy size={16} />
										</button>
									</div>
									<div className="bg-gray-900 p-3 rounded font-mono text-green-400 text-sm break-all">
										{seedInfo.serverSeedHash || 'Loading...'}
									</div>
									<p className="mt-1 text-gray-500 text-xs">
										🔒 Server seed is hashed - you'll see the actual seed after
										your game ends
									</p>
								</div>

								<div>
									<div className="flex justify-between items-center mb-2">
										<label className="font-bold text-gray-400 text-sm">
											Client Seed
										</label>
										<button
											onClick={() => copyToClipboard(seedInfo.clientSeed)}
											className="text-gray-400 hover:text-white"
										>
											<Copy size={16} />
										</button>
									</div>
									<input
										type="text"
										value={newClientSeed}
										onChange={(e) => setNewClientSeed(e.target.value)}
										className="bg-gray-900 p-3 border border-gray-700 rounded w-full font-mono text-white text-sm"
										placeholder="Your client seed"
									/>
									<button
										onClick={handleUpdateClientSeed}
										className="bg-blue-600 hover:bg-blue-700 mt-2 px-4 py-2 rounded font-bold text-sm transition"
									>
										Update Client Seed
									</button>
									<p className="mt-1 text-gray-500 text-xs">
										💡 You can change this anytime - it affects future games
									</p>
								</div>

								<div>
									<label className="block mb-2 font-bold text-gray-400 text-sm">
										Current Nonce
									</label>
									<div className="bg-gray-900 p-3 rounded font-mono text-purple-400 text-sm">
										{seedInfo.nonce}
									</div>
									<p className="mt-1 text-gray-500 text-xs">
										📊 Increments with each game you play
									</p>
								</div>
							</div>

							<div className="bg-yellow-600/20 p-4 border border-yellow-600 rounded-lg">
								<h3 className="mb-2 font-bold text-yellow-400">
									🔄 Rotate Seeds
								</h3>
								<p className="mb-3 text-gray-300 text-sm">
									Rotating seeds will reveal your current server seed and create
									a new seed pair. This is useful if you want to start fresh or
									verify all past games.
								</p>
								<button
									onClick={handleRotateSeed}
									className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-bold transition"
								>
									<RefreshCw size={16} />
									Rotate Seed Pair
								</button>
							</div>

							<div className="bg-gray-800/50 p-6 border border-gray-700 rounded-lg">
								<h3 className="mb-3 font-bold text-lg">How It Works</h3>
								<div className="space-y-3 text-gray-300 text-sm">
									<div className="flex gap-3">
										<div className="font-bold text-green-400">1.</div>
										<div>
											<strong className="text-white">Server Seed:</strong> We
											generate a random seed and show you its hash. This proves
											the seed existed before you play.
										</div>
									</div>
									<div className="flex gap-3">
										<div className="font-bold text-green-400">2.</div>
										<div>
											<strong className="text-white">Client Seed:</strong> Your
											personal seed that you can change anytime.
										</div>
									</div>
									<div className="flex gap-3">
										<div className="font-bold text-green-400">3.</div>
										<div>
											<strong className="text-white">Nonce:</strong> Increments
											with each game to ensure unique results.
										</div>
									</div>
									<div className="flex gap-3">
										<div className="font-bold text-green-400">4.</div>
										<div>
											<strong className="text-white">Combined RNG:</strong> We
											use HMAC-SHA256(serverSeed, clientSeed:nonce) to generate
											game outcomes.
										</div>
									</div>
									<div className="flex gap-3">
										<div className="font-bold text-green-400">5.</div>
										<div>
											<strong className="text-white">Verification:</strong>{' '}
											After each game, we reveal the server seed so you can
											verify the result was predetermined.
										</div>
									</div>
								</div>
							</div>
						</>
					)}

					{/* Seed History Tab */}
					{activeTab === 'history' && (
						<div className="space-y-4">
							{previousSeeds.map((seed) => (
								<div
									key={seed.id}
									className="bg-gray-800/50 p-4 border border-gray-700 rounded-lg"
								>
									<div className="flex justify-between items-start mb-3">
										<div>
											<div className="text-gray-500 text-xs">
												Created: {new Date(seed.createdAt).toLocaleString()}
											</div>
											<div className="text-gray-500 text-xs">
												Revealed: {new Date(seed.revealedAt).toLocaleString()}
											</div>
										</div>
										<button
											onClick={() => {
												copyToClipboard(seed.nonce.toString());
											}}
											className="bg-green-600/20 hover:bg-green-600/30 px-3 py-1 border border-green-600 rounded font-bold text-green-400 text-xs transition"
										>
											Copy Nonce: {seed.nonce}
										</button>
									</div>

									<div className="space-y-2 mb-3 text-sm">
										<div>
											<span className="text-gray-400">Server Seed:</span>
											<button
												onClick={
													() => copyToClipboard(seed.serverSeed)
													// navigator.clipboard.writeText(seed.serverSeed)
												}
												className="bg-gray-900 hover:bg-gray-900/70 mt-1 p-2 rounded font-mono text-green-400 text-xs break-all transition cursor-pointer"
												title="Click to copy"
											>
												{seed.serverSeed}
											</button>
										</div>
										<div>
											<span className="text-gray-400">Client Seed:</span>
											<button
												onClick={() => copyToClipboard(seed.clientSeed)}
												className="bg-gray-900 hover:bg-gray-900/70 mt-1 p-2 rounded font-mono text-purple-400 text-xs break-all transition cursor-pointer"
												title="Click to copy"
											>
												{seed.clientSeed}
											</button>
										</div>
									</div>

									<button
										onClick={() => viewGamesForSeed(seed.id)}
										className="bg-blue-600 hover:bg-blue-700 mb-2 px-4 py-2 rounded w-full font-bold text-sm transition"
									>
										View Games ({seed.nonce} played)
									</button>

									{selectedSeedId === seed.id && gamesForSeed.length > 0 && (
										<div className="space-y-2 mt-3 max-h-60 overflow-y-auto">
											<div className="mb-2 font-bold text-gray-400 text-sm">
												Games with this seed:
											</div>
											{gamesForSeed.map((game) => (
												<div
													key={game.id}
													className="bg-gray-900/50 p-3 border border-gray-700 rounded"
												>
													<div className="flex justify-between items-start mb-2">
														<div>
															<div className="font-bold capitalize">
																{game.gameType}
															</div>
															<div className="text-gray-500 text-xs">
																{new Date(game.createdAt).toLocaleString()}
															</div>
														</div>
														<div
															className={`font-bold ${
																game.profit >= 0
																	? 'text-green-400'
																	: 'text-red-400'
															}`}
														>
															{game.profit >= 0 ? '+' : ''}
															{game.profit.toFixed(2)}
														</div>
													</div>

													<div className="mb-2 text-gray-400 text-xs">
														Bet: ${game.betAmount} | Nonce:{' '}
														{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
														<span
															onClick={() =>
																navigator.clipboard.writeText(
																	game.nonce.toString(),
																)
															}
															className="text-blue-400 hover:underline cursor-pointer"
															title="Copy nonce"
														>
															{game.nonce}
														</span>
													</div>

													{game.gameType === 'mines' && (
														// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
														<div
															onClick={() =>
																copyToClipboard(
																	game.result.minePositions?.length,
																)
															}
															className="text-gray-500 hover:text-gray-300 text-xs transition cursor-pointer"
															title="Click to copy mine positions"
														>
															Mines: [{game.result.minePositions?.join(', ')}] (
															{game.result.minePositions?.length})
														</div>
													)}
													{game.gameType === 'coinflip' && (
														<div className="text-gray-500 text-xs">
															Result: {game.result.outcome}
														</div>
													)}

													<button
														onClick={() => verifySpecificGame(game.id)}
														className="bg-green-600/20 hover:bg-green-600/30 mt-2 px-3 py-1 border border-green-600 rounded w-full font-bold text-xs transition"
													>
														🔍 Verify This Game
													</button>
												</div>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{/* Verify Tab - Manual Verification */}
					{activeTab === 'verify' && (
						<div className="space-y-4">
							<div className="bg-blue-600/20 p-4 border border-blue-600 rounded-lg">
								<h3 className="mb-2 font-bold text-blue-400">
									🔍 Manual Verification
								</h3>
								<p className="text-gray-300 text-sm">
									Enter the game parameters to verify any result manually. This
									is useful for checking past games or testing the fairness
									algorithm.
								</p>
							</div>

							{/* Manual Verification Form */}
							<div className="bg-gray-800/50 p-6 border border-gray-700 rounded-lg">
								{/* Game Type Selector */}
								<div className="mb-4">
									<label className="block mb-2 font-bold text-gray-400 text-sm">
										Game
									</label>
									<select
										value={manualVerify.gameType}
										onChange={(e) =>
											setManualVerify({
												...manualVerify,
												gameType: e.target.value,
											})
										}
										className="bg-gray-900 p-3 border border-gray-700 rounded w-full text-white"
									>
										<option value="mines">Mines</option>
										<option value="coinflip">Coinflip</option>
									</select>
								</div>

								{/* Server Seed */}
								<div className="mb-4">
									<label className="block mb-2 font-bold text-gray-400 text-sm">
										Server Seed
									</label>
									<input
										type="text"
										value={manualVerify.serverSeed}
										onChange={(e) =>
											setManualVerify({
												...manualVerify,
												serverSeed: e.target.value,
											})
										}
										className="bg-gray-900 p-3 border border-gray-700 rounded w-full font-mono text-white"
										placeholder="Enter server seed (revealed)"
									/>
								</div>

								{/* Client Seed */}
								<div className="mb-4">
									<label className="block mb-2 font-bold text-gray-400 text-sm">
										Client Seed
									</label>
									<input
										type="text"
										value={manualVerify.clientSeed}
										onChange={(e) =>
											setManualVerify({
												...manualVerify,
												clientSeed: e.target.value,
											})
										}
										className="bg-gray-900 p-3 border border-gray-700 rounded w-full font-mono text-white"
										placeholder="Enter client seed"
									/>
								</div>

								{/* Nonce */}
								<div className="mb-4">
									<label className="block mb-2 font-bold text-gray-400 text-sm">
										Nonce
									</label>
									<div className="flex gap-2">
										<input
											type="number"
											value={manualVerify.nonce}
											onChange={(e) =>
												setManualVerify({
													...manualVerify,
													// biome-ignore lint/style/useNumberNamespace: <explanation>
													nonce: parseInt(e.target.value) || 0,
												})
											}
											className="flex-1 bg-gray-900 p-3 border border-gray-700 rounded font-mono text-white"
											placeholder="0"
											min="0"
										/>
										<button
											onClick={() =>
												setManualVerify({
													...manualVerify,
													nonce: Math.max(0, manualVerify.nonce - 1),
												})
											}
											className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white transition"
										>
											-
										</button>
										<button
											onClick={() =>
												setManualVerify({
													...manualVerify,
													nonce: manualVerify.nonce + 1,
												})
											}
											className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white transition"
										>
											+
										</button>
									</div>
								</div>

								{/* Mines-specific fields */}
								{manualVerify.gameType === 'mines' && (
									<div className="mb-4">
										<label className="block mb-2 font-bold text-gray-400 text-sm">
											Mines
										</label>
										<input
											type="number"
											value={manualVerify.minesCount}
											onChange={(e) =>
												setManualVerify({
													...manualVerify,
													// biome-ignore lint/style/useNumberNamespace: <explanation>
													minesCount: parseInt(e.target.value) || 3,
												})
											}
											className="bg-gray-900 p-3 border border-gray-700 rounded w-full font-mono text-white"
											placeholder="3"
											min="1"
											max="24"
										/>
										<p className="mt-1 text-gray-500 text-xs">
											Number of mines in the game
										</p>
									</div>
								)}

								{/* Verify Button */}
								<button
									onClick={handleManualVerify}
									className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded w-full font-bold text-white transition"
								>
									Verify Result
								</button>

								{/* View Calculation Breakdown */}
								<button
									onClick={() => setShowCalculation(!showCalculation)}
									className="flex justify-center items-center gap-2 hover:bg-gray-800 mt-3 px-4 py-2 rounded w-full text-gray-400 text-sm transition"
								>
									{showCalculation ? (
										<ChevronUp size={16} />
									) : (
										<ChevronDown size={16} />
									)}
									View Calculation Breakdown
								</button>
							</div>

							{/* Calculation Breakdown */}
							{showCalculation && (
								<div className="bg-gray-800/50 p-6 border border-gray-700 rounded-lg">
									<h4 className="mb-4 font-bold text-white">
										How the calculation works:
									</h4>
									<div className="space-y-3 text-gray-300 text-sm">
										<div>
											<span className="font-bold text-green-400">Step 1:</span>{' '}
											Combine seeds and nonce
											<div className="bg-gray-900 mt-1 p-3 rounded font-mono text-xs break-all">
												data = serverSeed + ":" + clientSeed + ":" + nonce
											</div>
										</div>
										<div>
											<span className="font-bold text-green-400">Step 2:</span>{' '}
											Generate HMAC-SHA256 hash
											<div className="bg-gray-900 mt-1 p-3 rounded font-mono text-xs break-all">
												hash = HMAC-SHA256(serverSeed, data)
											</div>
										</div>
										<div>
											<span className="font-bold text-green-400">Step 3:</span>{' '}
											Convert hash to numbers
											<div className="bg-gray-900 mt-1 p-3 rounded text-xs">
												Process the hash in 8-character chunks, convert each to
												a number, then use modulo to get positions within the
												grid range.
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Verification Result */}
							{manualResult && (
								<div
									className={`p-6 border-2 rounded-lg ${
										manualResult.valid
											? 'bg-green-600/20 border-green-400'
											: 'bg-red-600/20 border-red-400'
									}`}
								>
									<div className="flex items-center gap-3 mb-4">
										{manualResult.valid ? (
											<Check size={32} className="text-green-400" />
										) : (
											<X size={32} className="text-red-400" />
										)}
										<div>
											<h3 className="font-bold text-white text-xl">
												{manualResult.valid
													? 'Verification Successful!'
													: 'Verification Failed'}
											</h3>
											<p className="text-gray-300 text-sm">
												{manualResult.message}
											</p>
										</div>
									</div>

									{manualResult.valid && manualResult.result && (
										<div className="bg-gray-900/50 mt-4 p-4 border border-gray-700 rounded-lg">
											<h4 className="mb-3 font-bold text-white">Result:</h4>

											{manualResult.gameType === 'mines' && (
												<div>
													<p className="mb-2 text-gray-400 text-sm">
														Mine Positions:
													</p>
													<div className="flex flex-wrap gap-2">
														{manualResult.result.map((pos, idx) => (
															<span
																key={idx}
																className="bg-red-600/20 px-3 py-1 border border-red-600 rounded font-bold text-red-400 text-sm"
															>
																{pos}
															</span>
														))}
													</div>
													<p className="mt-3 text-gray-500 text-xs">
														These are the mine positions in a 5x5 grid (0-24)
													</p>
												</div>
											)}

											{manualResult.gameType === 'coinflip' && (
												<div>
													<p className="mb-2 text-gray-400 text-sm">
														Coin Flip Result:
													</p>
													<span className="bg-blue-600/20 px-4 py-2 border border-blue-600 rounded font-bold text-blue-400 text-lg">
														{manualResult.result}
													</span>
												</div>
											)}

											{manualResult.verificationData && (
												<div className="space-y-2 mt-4 pt-4 border-gray-700 border-t text-xs">
													<div>
														<span className="text-gray-400">
															Server Seed Hash:
														</span>
														<div className="bg-gray-800 mt-1 p-2 rounded font-mono break-all">
															{manualResult.verificationData.serverSeedHash}
														</div>
													</div>
												</div>
											)}
										</div>
									)}
								</div>
							)}

							{/* Game Verification Result (from specific game) */}
							{verificationResult && (
								<div
									className={`p-6 border-2 rounded-lg ${
										verificationResult.valid
											? 'bg-green-600/20 border-green-400'
											: 'bg-red-600/20 border-red-400'
									}`}
								>
									<div className="flex items-center gap-3 mb-2">
										{verificationResult.valid ? (
											<Check size={24} className="text-green-400" />
										) : (
											<X size={24} className="text-red-400" />
										)}
										<h3 className="font-bold text-lg">
											{verificationResult.valid
												? 'Game Verified!'
												: 'Verification Failed'}
										</h3>
									</div>
									<p className="text-sm">{verificationResult.message}</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Result Modal - Shows after verification */}
			{showResultModal && manualResult && manualResult.valid && (
				<div className="z-[60] fixed inset-0 flex justify-center items-center bg-black/90 backdrop-blur-sm p-4">
					<div className="bg-slate-900 shadow-2xl border-2 border-teal-500/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						{/* Header */}
						<div className="flex justify-between items-center bg-slate-800/50 p-6 border-slate-700/50 border-b">
							<div className="flex items-center gap-3">
								<div className="bg-teal-600 p-2 rounded-lg">
									<Check size={28} className="text-white" />
								</div>
								<div>
									<h2 className="font-bold text-white text-2xl">
										Verification Successful!
									</h2>
									<p className="text-teal-400 text-sm">
										Game result is provably fair!
									</p>
								</div>
							</div>
							<button
								onClick={() => setShowResultModal(false)}
								className="hover:bg-slate-800 p-2 rounded-lg text-gray-400 hover:text-white transition"
							>
								<X size={24} />
							</button>
						</div>

						{/* Content */}
						<div className="space-y-6 p-6">
							{/* Success Message */}
							<div className="bg-teal-900/30 p-4 border border-teal-500/50 rounded-lg">
								<p className="text-teal-300 text-center">
									✅ Result verified successfully. The game outcome matches the
									cryptographic proof.
								</p>
							</div>

							{/* Game Result - Mines Grid */}
							{manualResult.gameType === 'mines' && manualResult.result && (
								<div>
									<h3 className="mb-4 font-bold text-white text-lg text-center">
										Mine Positions
									</h3>
									<div className="bg-slate-800/50 p-4 border border-slate-700/50 rounded-lg">
										{renderMinesGrid(
											manualResult.result,
											manualResult.verificationData?.gridSize || 25,
										)}
										<div className="mt-4 text-center">
											<p className="text-gray-400 text-sm">
												Mines found at positions:{' '}
												<span className="font-mono text-red-400">
													[{manualResult.result.join(', ')}]
												</span>
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Game Result - Coinflip */}
							{manualResult.gameType === 'coinflip' && manualResult.result && (
								<div>
									<h3 className="mb-4 font-bold text-white text-lg text-center">
										Coin Flip Result
									</h3>
									<div className="flex justify-center items-center bg-slate-800/50 p-8 border border-slate-700/50 rounded-lg">
										<div className="flex flex-col items-center gap-4">
											<div className="flex justify-center items-center bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg rounded-full w-32 h-32">
												<span className="font-bold text-gray-900 text-4xl uppercase">
													{manualResult.result}
												</span>
											</div>
											<p className="font-bold text-white text-xl capitalize">
												{manualResult.result}
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Verification Details */}
							{manualResult.verificationData && (
								<div className="space-y-3 bg-slate-800/50 p-4 border border-slate-700/50 rounded-lg">
									<h4 className="font-bold text-white">
										Verification Details:
									</h4>
									<div className="space-y-2 text-sm">
										<div>
											<span className="text-gray-400">Client Seed:</span>
											<div className="bg-slate-900 mt-1 p-2 rounded font-mono text-purple-400 text-xs break-all">
												{manualResult.verificationData.clientSeed ||
													manualVerify.clientSeed}
											</div>
										</div>
										<div>
											<span className="text-gray-400">Server Seed Hash:</span>
											<div className="bg-slate-900 mt-1 p-2 rounded font-mono text-green-400 text-xs break-all">
												{manualResult.verificationData.serverSeedHash}
											</div>
										</div>
										<div className="flex gap-4">
											<div className="flex-1">
												<span className="text-gray-400">Nonce:</span>
												<div className="bg-slate-900 mt-1 p-2 rounded font-mono text-blue-400 text-sm">
													{manualResult.verificationData.nonce ||
														manualVerify.nonce}
												</div>
											</div>
											{manualResult.gameType === 'mines' && (
												<div className="flex-1">
													<span className="text-gray-400">Mines Count:</span>
													<div className="bg-slate-900 mt-1 p-2 rounded font-mono text-red-400 text-sm">
														{manualResult.verificationData.minesCount ||
															manualVerify.minesCount}
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							)}

							{/* Close Button */}
							<button
								onClick={() => setShowResultModal(false)}
								className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg w-full font-bold text-white transition"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProvablyFairModal;
