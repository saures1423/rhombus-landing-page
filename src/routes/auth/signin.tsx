import type React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
	ArrowRight,
	Eye,
	EyeOff,
	Github,
	Lock,
	Mail,
	Shield,
	ShoppingCart,
	Star,
	TrendingUp,
	Users,
	Zap,
} from 'lucide-react';

import { Link, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/auth/signin')({
	component: SigninComponent,
});

function SigninComponent() {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle sign in logic here
		console.log('Sign in:', { email, password, rememberMe });
	};

	return (
		<div className="flex bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 min-h-screen">
			{/* Left Side*/}
			<div className="hidden relative lg:flex flex-col justify-between bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-12 lg:w-1/2 overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div className="top-20 left-20 absolute bg-white rounded-full w-32 h-32 animate-pulse" />
					<div className="top-40 right-32 absolute bg-white rounded-full w-24 h-24 animate-pulse delay-75" />
					<div className="bottom-32 left-32 absolute bg-white rounded-full w-40 h-40 animate-pulse delay-150" />
					<div className="right-20 bottom-20 absolute bg-white rounded-full w-28 h-28 animate-pulse delay-300" />
				</div>

				{/* Floating Elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="top-1/4 left-1/4 absolute bg-emerald-300 rounded-full w-2 h-2 animate-bounce" />
					<div className="top-1/3 right-1/3 absolute bg-teal-300 rounded-full w-3 h-3 animate-bounce delay-100" />
					<div className="bottom-1/3 left-1/3 absolute bg-cyan-300 rounded-full w-2 h-2 animate-bounce delay-200" />
				</div>

				{/* Header */}
				<div className="z-10 relative">
					<Link className="flex items-center mb-8" to="/">
						<ShoppingCart className="w-10 h-10 text-white" />
						<span className="ml-3 font-bold text-white text-3xl">
							Rhombus X
						</span>
					</Link>

					<div className="space-y-6">
						<h1 className="font-bold text-white text-4xl leading-tight">
							Welcome back to your
							<span className="block text-emerald-200">ecommerce journey</span>
						</h1>
						<p className="text-emerald-100 text-xl leading-relaxed">
							Join thousands of successful businesses building their online
							stores with our powerful platform.
						</p>
					</div>
				</div>

				{/* Hero Visualization */}
				<div className="z-10 relative my-8">
					<div className="relative bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-2xl">
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
								<div className="gap-4 grid grid-cols-3 mb-6">
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
										<div className="font-bold text-blue-900 text-lg">1,247</div>
										<div className="text-blue-600 text-xs">↗ +8.2%</div>
									</div>
									<div className="bg-purple-50 p-3 border border-purple-100 rounded-lg">
										<div className="mb-1 font-medium text-purple-600 text-xs">
											Customers
										</div>
										<div className="font-bold text-purple-900 text-lg">892</div>
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

				{/* Features Grid */}
				<div className="z-10 relative gap-4 grid grid-cols-2">
					<div className="bg-white/10 hover:bg-white/15 backdrop-blur-sm p-4 border border-white/20 rounded-xl transition-all duration-300">
						<div className="flex justify-center items-center bg-emerald-400 mb-3 rounded-lg w-10 h-10">
							<Zap className="w-5 h-5 text-emerald-900" />
						</div>
						<h3 className="mb-1 font-semibold text-white text-sm">
							Lightning Fast
						</h3>
						<p className="text-emerald-100 text-xs">Set up in minutes</p>
					</div>

					<div className="bg-white/10 hover:bg-white/15 backdrop-blur-sm p-4 border border-white/20 rounded-xl transition-all duration-300">
						<div className="flex justify-center items-center bg-emerald-400 mb-3 rounded-lg w-10 h-10">
							<Shield className="w-5 h-5 text-emerald-900" />
						</div>
						<h3 className="mb-1 font-semibold text-white text-sm">
							Secure & Reliable
						</h3>
						<p className="text-emerald-100 text-xs">99.9% uptime</p>
					</div>

					<div className="bg-white/10 hover:bg-white/15 backdrop-blur-sm p-4 border border-white/20 rounded-xl transition-all duration-300">
						<div className="flex justify-center items-center bg-emerald-400 mb-3 rounded-lg w-10 h-10">
							<Users className="w-5 h-5 text-emerald-900" />
						</div>
						<h3 className="mb-1 font-semibold text-white text-sm">
							50k+ Businesses
						</h3>
						<p className="text-emerald-100 text-xs">Trusted worldwide</p>
					</div>

					<div className="bg-white/10 hover:bg-white/15 backdrop-blur-sm p-4 border border-white/20 rounded-xl transition-all duration-300">
						<div className="flex justify-center items-center bg-emerald-400 mb-3 rounded-lg w-10 h-10">
							<TrendingUp className="w-5 h-5 text-emerald-900" />
						</div>
						<h3 className="mb-1 font-semibold text-white text-sm">
							Proven Results
						</h3>
						<p className="text-emerald-100 text-xs">40% sales increase</p>
					</div>
				</div>
			</div>

			{/* Right Side - Sign In Form */}
			<div className="flex justify-center items-center p-8 w-full lg:w-1/2">
				<div className="w-full max-w-md">
					{/* Mobile Header */}
					<div className="lg:hidden mb-8 text-center">
						<Link className="flex justify-center items-center mb-6" to="/">
							<ShoppingCart className="w-8 h-8 text-emerald-600" />
							<span className="ml-2 font-bold text-gray-900 text-2xl">
								Rhombus X
							</span>
						</Link>
					</div>

					{/* Welcome Message */}
					<div className="mb-8 text-center">
						<div className="flex justify-center items-center bg-emerald-100 mx-auto mb-4 rounded-full w-16 h-16">
							<Lock className="w-8 h-8 text-emerald-600" />
						</div>

						<p className="text-gray-600">
							Sign in to your account to continue building your store
						</p>
					</div>

					<Card className="bg-white/80 shadow-2xl backdrop-blur-sm border-0">
						<CardHeader className="space-y-1 pb-6">
							<CardTitle className="text-xl text-center">
								Sign In to Your Account
							</CardTitle>
							<CardDescription className="text-center">
								Choose your preferred sign-in method
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Social Sign In */}
							<div className="space-y-3">
								<Button
									variant="outline"
									className="bg-white hover:bg-gray-50 border-gray-200 w-full h-12"
									type="button"
								>
									<div className="flex justify-center items-center gap-3">
										<img
											src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
											alt="Google"
											width={20}
											height={20}
											className="rounded"
										/>
										<span className="font-medium">Continue with Google</span>
									</div>
								</Button>
								<Button
									variant="outline"
									className="bg-white hover:bg-gray-50 border-gray-200 w-full h-12"
									type="button"
								>
									<div className="flex justify-center items-center gap-3">
										<Github className="w-5 h-5" />
										<span className="font-medium">Continue with GitHub</span>
									</div>
								</Button>
							</div>

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<Separator className="w-full" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-white px-4 font-medium text-gray-500">
										Or sign in with email
									</span>
								</div>
							</div>

							{/* Sign In Form */}
							<form onSubmit={handleSubmit} className="space-y-5">
								<div className="space-y-2">
									<Label
										htmlFor="email"
										className="font-medium text-gray-700 text-sm"
									>
										Email Address
									</Label>
									<div className="relative">
										<Mail className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2 transform" />
										<Input
											id="email"
											type="email"
											placeholder="Enter your email address"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="bg-gray-50 focus:bg-white pl-11 border-gray-200 h-12 transition-colors"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="password"
										className="font-medium text-gray-700 text-sm"
									>
										Password
									</Label>
									<div className="relative">
										<Lock className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2 transform" />
										<Input
											id="password"
											type={showPassword ? 'text' : 'password'}
											placeholder="Enter your password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="bg-gray-50 focus:bg-white pr-11 pl-11 border-gray-200 h-12 transition-colors"
											required
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="top-1/2 right-3 absolute text-gray-400 hover:text-gray-600 transition-colors -translate-y-1/2 transform"
										>
											{showPassword ? (
												<EyeOff className="w-5 h-5" />
											) : (
												<Eye className="w-5 h-5" />
											)}
										</button>
									</div>
								</div>

								<div className="flex justify-between items-center">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="remember"
											checked={rememberMe}
											onCheckedChange={(checked) =>
												setRememberMe(checked as boolean)
											}
											className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
										/>
										<Label
											htmlFor="remember"
											className="font-medium text-gray-600 text-sm"
										>
											Remember me for 30 days
										</Label>
									</div>
									<Link
										to="/"
										className="font-medium text-emerald-600 hover:text-emerald-700 text-sm transition-colors"
									>
										Forgot password?
									</Link>
								</div>

								<Button
									type="submit"
									className="bg-emerald-600 hover:bg-emerald-700 w-full h-12 font-medium text-base"
									size="lg"
								>
									Sign In to Dashboard
									<ArrowRight className="ml-2 w-5 h-5" />
								</Button>
							</form>

							{/* Sign Up Link */}
							<div className="text-center">
								<p className="text-gray-600 text-sm">
									Don't have an account?{' '}
									<Link
										to="/"
										className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
									>
										Start your free trial
									</Link>
								</p>
								<Badge className="bg-emerald-100 mt-3 border-emerald-200 text-emerald-800">
									🎉 14-day free trial • No credit card required
								</Badge>
							</div>
						</CardContent>
					</Card>

					{/* Security Notice */}
					<div className="mt-6 text-center">
						<div className="flex justify-center items-center gap-2 text-gray-500 text-xs">
							<Shield className="w-4 h-4" />
							<span>
								Protected by enterprise-grade security. Read our{' '}
								<Link
									to="/"
									className="text-emerald-600 hover:text-emerald-700 underline"
								>
									Privacy Policy
								</Link>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
