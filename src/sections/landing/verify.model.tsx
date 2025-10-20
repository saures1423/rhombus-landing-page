import { Check, ChevronDown, ChevronUp, Copy, Shield, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const BetVerificationModal = ({ isOpen, onClose, bet, socket }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [verificationResult, setVerificationResult] = useState(null);
	const [showResultModal, setShowResultModal] = useState(false);
	const [historyGameDetail, setHistoryGameDetail] = useState(null);
	console.log(
		'🚀 ~ BetVerificationModal ~ historyGameDetail:',
		historyGameDetail,
	);

	console.log(
		'🚀 ~ BetVerificationModal ~ verificationResult:',
		verificationResult,
	);

	useEffect(() => {
		if (isOpen && bet) {
			// Request seed data for this bet
			socket.emit('gameHistory:detail', { gameId: bet.id });

			socket.on('game-history:gameDetail', (result) => {
				setHistoryGameDetail(result);
			});

			socket.on('seed:verificationResult', (result) => {
				setVerificationResult(result);

				setIsVerifying(false);

				setShowResultModal(true);
			});

			return () => {
				socket.off('seed:verificationResult');
				socket.off('game-history:gameDetail');
			};
		}
	}, [isOpen, bet, socket]);

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
	};

	const verifyBet = () => {
		setIsVerifying(true);
		socket.emit('seed:verify', { gameId: bet.id });
	};

	if (!isOpen || !historyGameDetail) return null;

	const renderGameGrid = (game) => {
		if (game.gameType !== 'mines') return null;

		const gridSize = game.result?.gridSize || 25;
		const minePositions = game.result?.minePositions || [];
		const revealedTiles = game.result?.revealedTiles || [];
		const gridCols = Math.sqrt(gridSize);

		// Check if *any* tile is revealed — used to dim unrevealed ones
		const anyRevealed = revealedTiles.length > 0;

		return (
			<div
				className="gap-2 grid mb-6 transition-all duration-300"
				style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
			>
				{Array.from({ length: gridSize }, (_, i) => {
					const isMine = minePositions.includes(i);
					const isRevealed = revealedTiles.includes(i);

					const baseClasses =
						'aspect-square rounded-lg flex items-center justify-center text-3xl sm:text-4xl md:text-7xl font-bold border transition-all duration-300';

					// Style logic
					let tileClasses = '';
					if (isRevealed) {
						if (isMine) {
							tileClasses =
								'bg-red-900/40 border-red-500 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.4)] z-10';
						} else {
							tileClasses =
								'bg-green-900/40 border-green-500 scale-105 shadow-[0_0_15px_rgba(34,197,94,0.4)] z-10';
						}
					} else {
						tileClasses = `bg-gray-800 border-gray-700 ${
							anyRevealed ? 'opacity-40' : 'opacity-100'
						}`;
					}

					return (
						<div key={i} className={`${baseClasses} ${tileClasses}`}>
							{isRevealed ? (
								isMine ? (
									<span className="text-6xl md:text-7xl">💥</span>
								) : (
									<span className="text-6xl md:text-7xl">💎</span>
								)
							) : isMine ? (
								<span className="opacity-25 text-7xl select-none">💥</span>
							) : (
								<span className="opacity-25 text-7xl select-none">💎</span>
							)}
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div className="z-50 fixed inset-0 flex justify-center items-center bg-black/80 backdrop-blur-sm p-4">
			<div className="bg-[#1a2332] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="top-0 z-10 sticky flex justify-between items-center bg-[#1a2332] p-6 border-gray-700 border-b">
					<div className="flex items-center gap-3">
						<Shield size={24} className="text-blue-400" />
						<h2 className="font-bold text-xl">Bet</h2>
					</div>
					<button
						onClick={onClose}
						className="hover:bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white transition"
					>
						<X size={24} />
					</button>
				</div>

				{/* Timestamp */}
				<div className="px-6 pt-4 text-gray-400 text-sm text-center">
					on{' '}
					{new Date(historyGameDetail.game.createdAt).toLocaleString('en-US', {
						month: '2-digit',
						day: '2-digit',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
						hour12: true,
					})}
				</div>

				{/* Game Title */}
				<div className="px-6 py-4 text-center">
					<h3
						className="font-script text-white text-3xl"
						style={{ fontFamily: 'cursive' }}
					>
						{historyGameDetail.game.gameType === 'mines'
							? 'Mines'
							: historyGameDetail.game.gameType === 'coinflip'
								? 'Coinflip'
								: 'Roulette'}
					</h3>
				</div>

				{/* Bet Stats */}
				<div className="px-6 pb-4">
					<div className="gap-4 grid grid-cols-3 bg-[#0f1923] p-4 border border-gray-800 rounded-lg">
						<div className="text-center">
							<div className="mb-1 text-gray-400 text-sm">Bet</div>
							<div className="flex justify-center items-center gap-1">
								<span className="font-bold text-white">
									{historyGameDetail.game.betAmount}
								</span>
								<span className="text-orange-400">🪙</span>
							</div>
						</div>
						<div className="border-gray-800 border-x text-center">
							<div className="mb-1 text-gray-400 text-sm">Multiplier</div>
							<div className="font-bold text-white">
								{historyGameDetail.game?.multiplier?.toFixed(2) || '0.00'}x
							</div>
						</div>
						<div className="text-center">
							<div className="mb-1 text-gray-400 text-sm">Payout</div>
							<div className="flex justify-center items-center gap-1">
								<span
									className={`font-bold ${historyGameDetail.game.profit >= 0 ? 'text-green-400' : 'text-white'}`}
								>
									{historyGameDetail.game.profit.toFixed(2)}
								</span>
								<span className="text-orange-400">🪙</span>
							</div>
						</div>
					</div>
				</div>

				{/* Game Grid */}
				<div className="px-6 pb-6">
					{renderGameGrid(historyGameDetail.game)}
				</div>

				{/* Play Again Button */}
				<div className="px-6 pb-4">
					<button className="bg-[#2a3f5f] hover:bg-[#354d6d] py-3 rounded-lg w-full font-bold text-white transition">
						Play{' '}
						{historyGameDetail.game.gameType === 'mines'
							? 'Mines'
							: historyGameDetail.game.gameType === 'coinflip'
								? 'Coinflip'
								: 'Roulette'}
					</button>
				</div>

				{/* Provable Fairness Section */}
				<div className="border-gray-700 border-t">
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="flex justify-between items-center hover:bg-gray-800/50 px-6 py-4 w-full transition"
					>
						<span className="font-bold text-white">Provable Fairness</span>
						{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
					</button>

					{isExpanded && (
						<div className="space-y-4 px-6 pb-6">
							{/* Server Seed (Hidden before reveal) */}
							<div>
								<div className="mb-2 text-gray-400 text-sm">Server Seed</div>
								<div className="flex justify-between items-center bg-[#0f1923] p-3 border border-gray-800 rounded-lg">
									{historyGameDetail.seed?.serverSeed ? (
										<>
											<span className="flex-1 font-mono text-green-400 text-sm truncate">
												{historyGameDetail.seed.serverSeed}
											</span>
											<button
												onClick={() =>
													copyToClipboard(historyGameDetail.seed.serverSeed)
												}
												className="ml-2 text-gray-400 hover:text-white"
											>
												<Copy size={16} />
											</button>
										</>
									) : (
										<span className="text-gray-500 text-sm">
											Seed hasn't been revealed yet
										</span>
									)}
								</div>
							</div>

							{/* Server Seed (Hashed) */}
							<div>
								<div className="mb-2 text-gray-400 text-sm">
									Server Seed (Hashed)
								</div>
								<div className="flex justify-between items-center bg-[#0f1923] p-3 border border-gray-800 rounded-lg">
									<span className="flex-1 font-mono text-blue-400 text-sm truncate">
										{historyGameDetail?.game?.proofBody?.serverSeedHash ||
											'Loading...'}
									</span>
									<button
										onClick={() =>
											copyToClipboard(
												historyGameDetail?.game?.proofBody?.serverSeedHash ||
													'',
											)
										}
										className="ml-2 text-gray-400 hover:text-white"
									>
										<Copy size={16} />
									</button>
								</div>
							</div>

							{/* Client Seed and Nonce */}
							<div className="gap-4 grid grid-cols-2">
								<div>
									<div className="mb-2 text-gray-400 text-sm">Client Seed</div>
									<div className="flex justify-between items-center bg-[#0f1923] p-3 border border-gray-800 rounded-lg">
										<span className="flex-1 font-mono text-purple-400 text-sm truncate">
											{historyGameDetail?.game?.proofBody?.clientSeed ||
												'Loading...'}
										</span>
										<button
											onClick={() =>
												copyToClipboard(
													historyGameDetail?.game?.proofBody?.clientSeed || '',
												)
											}
											className="ml-2 text-gray-400 hover:text-white"
										>
											<Copy size={16} />
										</button>
									</div>
								</div>

								<div>
									<div className="mb-2 text-gray-400 text-sm">Nonce</div>
									<div className="flex justify-between items-center bg-[#0f1923] p-3 border border-gray-800 rounded-lg">
										<span className="font-mono text-yellow-400 text-sm">
											{historyGameDetail?.game?.proofBody?.nonce ??
												'Loading...'}
										</span>
										<button
											onClick={() =>
												copyToClipboard(
													String(
														historyGameDetail?.game?.proofBody?.nonce || '',
													),
												)
											}
											className="ml-2 text-gray-400 hover:text-white"
										>
											<Copy size={16} />
										</button>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="space-y-2">
								{!historyGameDetail?.seed?.serverSeed ? (
									<div className="bg-yellow-600/20 p-3 border border-yellow-600 rounded-lg text-center">
										<p className="text-yellow-400 text-sm">
											Rotate your seed pair in order to verify this bet
										</p>
									</div>
								) : (
									<button
										onClick={verifyBet}
										disabled={isVerifying}
										className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 py-3 rounded-lg w-full font-bold text-white transition"
									>
										{isVerifying ? (
											<>
												<div className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
												Verifying...
											</>
										) : (
											<>
												<Shield size={18} />
												Verify Bet
											</>
										)}
									</button>
								)}

								<button
									onClick={onClose}
									className="bg-transparent py-2 border border-gray-600 hover:border-gray-500 rounded-lg w-full font-bold text-gray-400 hover:text-white text-sm transition"
								>
									What is Provable Fairness?
								</button>
							</div>
						</div>
					)}

					{/* {verificationResult && (
						<div
							className={`p-6 border-2 rounded-lg ${
								verificationResult.valid
									? 'bg-green-600/20 border-green-400'
									: 'bg-red-600/20 border-red-400'
							}`}
						>
							<div className="flex items-center gap-3 mb-4">
								{verificationResult.valid ? (
									<Check size={32} className="text-green-400" />
								) : (
									<X size={32} className="text-red-400" />
								)}
								<div>
									<h3 className="font-bold text-white text-xl">
										{verificationResult.valid
											? 'Verification Successful!'
											: 'Verification Failed'}
									</h3>
									<p className="text-gray-300 text-sm">
										{verificationResult.message}
									</p>
								</div>
							</div>

							{verificationResult.valid && verificationResult.result && (
								<div className="bg-gray-900/50 mt-4 p-4 border border-gray-700 rounded-lg">
									<h4 className="mb-3 font-bold text-white">Result:</h4>

									{verificationResult.gameType === 'mines' && (
										<div>
											<p className="mb-2 text-gray-400 text-sm">
												Mine Positions:
											</p>
											<div className="flex flex-wrap gap-2">
												{verificationResult.result.map((pos, idx) => (
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

									{verificationResult.gameType === 'coinflip' && (
										<div>
											<p className="mb-2 text-gray-400 text-sm">
												Coin Flip Result:
											</p>
											<span className="bg-blue-600/20 px-4 py-2 border border-blue-600 rounded font-bold text-blue-400 text-lg">
												{verificationResult.result}
											</span>
										</div>
									)}

									{verificationResult.verificationData && (
										<div className="space-y-2 mt-4 pt-4 border-gray-700 border-t text-xs">
											<div>
												<span className="text-gray-400">Server Seed Hash:</span>
												<div className="bg-gray-800 mt-1 p-2 rounded font-mono break-all">
													{verificationResult.verificationData.serverSeedHash}
												</div>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					)} */}

					{showResultModal && verificationResult && (
						<div className="z-[60] fixed inset-0 flex justify-center items-center bg-black/90 backdrop-blur-sm p-4">
							<div className="bg-slate-900 shadow-2xl border-2 border-teal-500/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
								{/* Header */}
								<div className="flex justify-between items-center bg-slate-800/50 p-6 border-slate-700/50 border-b">
									<div className="flex items-center gap-3">
										<div className="flex items-center gap-3 mb-4">
											{verificationResult.valid ? (
												<Check size={32} className="text-green-400" />
											) : (
												<X size={32} className="text-red-400" />
											)}
											<div>
												<h3 className="font-bold text-white text-xl">
													{verificationResult.valid
														? 'Verification Successful!'
														: 'Verification Failed'}
												</h3>
												<p className="text-gray-300 text-sm">
													{verificationResult.message}
												</p>
											</div>
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
											{verificationResult.valid ? (
												<>
													✅ Result verified successfully. The game outcome
													matches the cryptographic proof.
												</>
											) : (
												<>
													❌ Verification failed. The game outcome does not
													match the cryptographic proof.
												</>
											)}

											{/* ✅ Result verified successfully. The game outcome matches
											the cryptographic proof. */}
										</p>
									</div>

									{/* Game Result - Mines Grid */}
									{verificationResult.gameDetails.gameType === 'mines' &&
										verificationResult.gameDetails.result && (
											<div>
												<h3 className="mb-4 font-bold text-white text-lg text-center">
													Mine Positions
												</h3>
												<div className="bg-slate-800/50 p-4 border border-slate-700/50 rounded-lg">
													{renderGameGrid(verificationResult.gameDetails)}
													<div className="mt-4 text-center">
														<p className="text-gray-400 text-sm">
															Mines found at positions:{' '}
															<span className="font-mono text-red-400">
																[
																{verificationResult.gameDetails.result.minePositions.join(
																	', ',
																)}
																]
															</span>
														</p>
													</div>
												</div>
											</div>
										)}

									{/* Game Result - Coinflip */}
									{/* {verificationResult.gameDetails.gameType === 'coinflip' &&
											verificationResult.gameDetails.result && (
												<div>
													<h3 className="mb-4 font-bold text-white text-lg text-center">
														Coin Flip Result
													</h3>
													<div className="flex justify-center items-center bg-slate-800/50 p-8 border border-slate-700/50 rounded-lg">
														<div className="flex flex-col items-center gap-4">
															<div className="flex justify-center items-center bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg rounded-full w-32 h-32">
																<span className="font-bold text-gray-900 text-4xl uppercase">
																	{verificationResult.gameDetails.result}
																</span>
															</div>
															<p className="font-bold text-white text-xl capitalize">
																{verificationResult.gameDetails.result}
															</p>
														</div>
													</div>
												</div>
											)} */}

									{/* Verification Details */}
									{verificationResult && (
										<div className="space-y-3 bg-slate-800/50 p-4 border border-slate-700/50 rounded-lg">
											<h4 className="font-bold text-white">
												Verification Details:
											</h4>
											<div className="space-y-2 text-sm">
												<div>
													<span className="text-gray-400">Client Seed:</span>
													<div className="bg-slate-900 mt-1 p-2 rounded font-mono text-purple-400 text-xs break-all">
														{verificationResult.seedDetails.clientSeed ||
															verificationResult.seedDetails.clientSeed}
													</div>
												</div>
												<div>
													<span className="text-gray-400">
														Server Seed Hash:
													</span>
													<div className="bg-slate-900 mt-1 p-2 rounded font-mono text-green-400 text-xs break-all">
														{verificationResult.seedDetails.serverSeedHash}
													</div>
												</div>
												<div className="flex gap-4">
													<div className="flex-1">
														<span className="text-gray-400">Nonce:</span>
														<div className="bg-slate-900 mt-1 p-2 rounded font-mono text-blue-400 text-sm">
															{verificationResult.seedDetails.nonce ||
																verificationResult.seedDetails.nonce}
														</div>
													</div>
													{verificationResult.gameDetails.gameType ===
														'mines' && (
														<div className="flex-1">
															<span className="text-gray-400">
																Mines Count:
															</span>
															<div className="bg-slate-900 mt-1 p-2 rounded font-mono text-red-400 text-sm">
																{verificationResult.seedDetails.minesCount ||
																	verificationResult.gameDetails.result
																		.minePositions.length}
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
			</div>
		</div>
	);
};

export default BetVerificationModal;
