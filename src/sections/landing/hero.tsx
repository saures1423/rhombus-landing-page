import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Star, TrendingUp } from 'lucide-react';

export default function HeroSection() {
	return (
		<section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 py-12 md:py-24 lg:py-32 xl:py-48 w-full overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="top-20 left-20 absolute bg-white rounded-full w-32 h-32 animate-pulse" />
				<div className="top-40 right-32 absolute bg-white rounded-full w-24 h-24 animate-pulse delay-75" />
				<div className="bottom-32 left-32 absolute bg-white rounded-full w-40 h-40 animate-pulse delay-150" />
				<div className="right-20 bottom-20 absolute bg-white rounded-full w-28 h-28 animate-pulse delay-300" />
				<div className="top-1/2 left-1/2 absolute bg-white rounded-full w-64 h-64 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500 transform" />
			</div>

			{/* Floating Elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="top-1/4 left-1/4 absolute bg-emerald-300 rounded-full w-2 h-2 animate-bounce" />
				<div className="top-1/3 right-1/3 absolute bg-teal-300 rounded-full w-3 h-3 animate-bounce delay-100" />
				<div className="bottom-1/3 left-1/3 absolute bg-cyan-300 rounded-full w-2 h-2 animate-bounce delay-200" />
				<div className="top-1/2 right-1/4 absolute bg-emerald-200 rounded-full w-2 h-2 animate-bounce delay-300" />
				<div className="right-1/2 bottom-1/4 absolute bg-teal-200 rounded-full w-3 h-3 animate-bounce delay-400" />
			</div>

			<div className="z-10 relative mx-auto px-4 md:px-6 container">
				<div className="gap-6 lg:gap-12 grid lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_600px]">
					<div className="flex flex-col justify-center space-y-4">
						<div className="space-y-2">
							<Badge className="bg-emerald-200/20 hover:bg-emerald-200/30 backdrop-blur-sm border border-emerald-200/30 text-emerald-100">
								🚀 Launch your store in minutes
							</Badge>
							<h1 className="font-bold text-white text-3xl sm:text-5xl xl:text-6xl/none tracking-tighter">
								Build Your Dream
								<span className="text-emerald-200"> Ecommerce Store</span>
							</h1>
							<p className="max-w-[600px] text-emerald-100 md:text-xl leading-relaxed">
								Everything you need to start, run, and grow your online
								business. From payments to inventory management, we've got you
								covered.
							</p>
						</div>
						<div className="flex min-[400px]:flex-row flex-col gap-2">
							<Button
								size="lg"
								className="bg-white hover:bg-emerald-50 font-semibold text-emerald-600"
							>
								Start Free Trial
								<ArrowRight className="ml-2 w-4 h-4" />
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="bg-transparent hover:bg-white backdrop-blur-sm border-white text-white hover:text-emerald-600"
							>
								Watch Demo
							</Button>
						</div>
						<div className="flex items-center gap-4 text-emerald-100 text-sm">
							<div className="flex items-center gap-1">
								<Check className="w-4 h-4 text-emerald-200" />
								14-day free trial
							</div>
							<div className="flex items-center gap-1">
								<Check className="w-4 h-4 text-emerald-200" />
								No credit card required
							</div>
							<div className="flex items-center gap-1">
								<Check className="w-4 h-4 text-emerald-200" />
								Cancel anytime
							</div>
						</div>

						{/* Success Stats */}
						<div className="gap-4 grid grid-cols-3 mt-8">
							<div className="bg-white/10 backdrop-blur-sm p-4 border border-white/20 rounded-xl">
								<div className="mb-1 font-bold text-white text-2xl">50k+</div>
								<div className="text-emerald-200 text-sm">Active Stores</div>
							</div>
							<div className="bg-white/10 backdrop-blur-sm p-4 border border-white/20 rounded-xl">
								<div className="mb-1 font-bold text-white text-2xl">$2.5B+</div>
								<div className="text-emerald-200 text-sm">Sales Processed</div>
							</div>
							<div className="bg-white/10 backdrop-blur-sm p-4 border border-white/20 rounded-xl">
								<div className="mb-1 font-bold text-white text-2xl">99.9%</div>
								<div className="text-emerald-200 text-sm">Uptime</div>
							</div>
						</div>
					</div>

					{/* Dashboard Visualization */}
					<div className="flex justify-center items-center">
						<div className="relative bg-white/10 shadow-2xl backdrop-blur-sm p-6 border border-white/20 rounded-2xl">
							{/* Dashboard Preview */}
							<div className="bg-white shadow-2xl rounded-xl overflow-hidden">
								{/* Mock Browser Header */}
								<div className="flex items-center gap-2 bg-gray-100 px-4 py-3">
									<div className="flex gap-2">
										<div className="bg-red-400 rounded-full w-3 h-3" />
										<div className="bg-yellow-400 rounded-full w-3 h-3" />
										<div className="bg-green-400 rounded-full w-3 h-3" />
									</div>
									<div className="flex-1 bg-white ml-4 px-3 py-1 rounded-md text-gray-500 text-xs">
										dashboard.rhomubus.com
									</div>
								</div>

								{/* Dashboard Content */}
								<div className="bg-gradient-to-br from-gray-50 to-white p-6">
									{/* Stats Cards */}
									<div className="gap-3 grid grid-cols-3 mb-6">
										<div className="bg-emerald-50 p-3 border border-emerald-100 rounded-lg">
											<div className="mb-1 font-medium text-emerald-600 text-xs">
												Revenue
											</div>
											<div className="font-bold text-emerald-900 text-lg">
												$24,580
											</div>
											<div className="text-emerald-600 text-xs">↗ +12.5%</div>
										</div>
										<div className="bg-blue-50 p-3 border border-blue-100 rounded-lg">
											<div className="mb-1 font-medium text-blue-600 text-xs">
												Orders
											</div>
											<div className="font-bold text-blue-900 text-lg">
												1,247
											</div>
											<div className="text-blue-600 text-xs">↗ +8.2%</div>
										</div>
										<div className="bg-purple-50 p-3 border border-purple-100 rounded-lg">
											<div className="mb-1 font-medium text-purple-600 text-xs">
												Customers
											</div>
											<div className="font-bold text-purple-900 text-lg">
												892
											</div>
											<div className="text-purple-600 text-xs">↗ +15.3%</div>
										</div>
									</div>

									{/* Chart Area */}
									<div className="bg-white p-4 border border-gray-200 rounded-lg">
										<div className="flex justify-between items-center mb-3">
											<div className="font-semibold text-gray-900 text-sm">
												Sales Analytics
											</div>
											<div className="text-gray-500 text-xs">Last 30 days</div>
										</div>
										{/* Simple Chart Visualization */}
										<div className="flex items-end gap-1 h-16">
											{[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
												(height, index) => (
													<div
														key={index}
														className="flex-1 bg-gradient-to-t from-emerald-500 hover:from-emerald-600 to-emerald-400 hover:to-emerald-500 rounded-sm transition-all duration-300"
														style={{ height: `${height}%` }}
													/>
												),
											)}
										</div>
									</div>

									{/* Recent Activity */}
									<div className="space-y-2 mt-4">
										<div className="flex items-center gap-3 bg-white p-3 border border-gray-100 rounded-lg">
											<div className="bg-green-400 rounded-full w-2 h-2" />
											<div className="text-gray-600 text-xs">
												New order from Sarah J. - $156.00
											</div>
										</div>
										<div className="flex items-center gap-3 bg-white p-3 border border-gray-100 rounded-lg">
											<div className="bg-blue-400 rounded-full w-2 h-2" />
											<div className="text-gray-600 text-xs">
												Product "Summer Collection" updated
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Floating Success Indicators */}
							<div className="-top-2 -right-2 absolute bg-green-500 shadow-lg p-2 rounded-full text-white animate-pulse">
								<TrendingUp className="w-4 h-4" />
							</div>
							<div className="-bottom-2 -left-2 absolute bg-emerald-500 shadow-lg p-2 rounded-full text-white animate-pulse delay-75">
								<Star className="w-4 h-4" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
