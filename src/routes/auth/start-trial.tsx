import { Link, createFileRoute } from '@tanstack/react-router';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
	ArrowRight,
	Building2,
	Check,
	Crown,
	Eye,
	EyeOff,
	Gift,
	Lock,
	Mail,
	Shield,
	ShoppingCart,
	Star,
	User,
} from 'lucide-react';
import { useState } from 'react';
export const Route = createFileRoute('/auth/start-trial')({
	component: StartTrialPage,
});

function StartTrialPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		companyName: '',
		companySize: '',
		agreeToTerms: false,
		subscribeToUpdates: true,
	});

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle trial signup logic here
		console.log('Start trial:', formData);
	};

	return (
		<div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 min-h-screen overflow-hidden">
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
				<div className="top-1/4 left-1/4 absolute bg-emerald-300 rounded-full w-3 h-3 animate-bounce" />
				<div className="top-1/3 right-1/3 absolute bg-teal-300 rounded-full w-3 h-3 animate-bounce delay-100" />
				<div className="bottom-1/3 left-1/3 absolute bg-cyan-300 rounded-full w-3 h-3 animate-bounce delay-200" />
				<div className="top-1/2 right-1/4 absolute bg-emerald-200 rounded-full w-3 h-3 animate-bounce delay-300" />
				<div className="right-1/2 bottom-1/4 absolute bg-teal-200 rounded-full w-3 h-3 animate-bounce delay-400" />
			</div>

			<div className="z-10 relative flex min-h-screen">
				{/* Right Side - Signup Form */}
				<div className="flex justify-center items-center p-8 w-full">
					<div className="w-full max-w-6xl">
						<div className="mb-8 text-center">
							<Link className="flex justify-center items-center mb-6" to="/">
								<ShoppingCart className="w-8 h-8 text-white" />
								<span className="ml-2 font-bold text-white text-2xl">
									Rhombus X
								</span>
							</Link>
							<Badge className="bg-yellow-400 mb-4 text-yellow-900">
								🚀 14-Day Free Trial
							</Badge>
						</div>

						<div className="mb-8 text-center">
							<div className="flex justify-center items-center bg-white/20 backdrop-blur-sm mx-auto mb-4 border border-white/30 rounded-full w-20 h-20">
								<Crown className="w-10 h-10 text-white" />
							</div>
							<h1 className="mb-2 font-bold text-white text-3xl">
								Start Your Free Trial
							</h1>
							<p className="text-emerald-100">
								Get full access to all features for 14 days. No credit card
								required.
							</p>
						</div>

						<div className="gap-8 grid lg:grid-cols-2 mx-auto max-w-5xl">
							{/* Left Side Included */}
							<div className="lg:col-span-1">
								<Card className="bg-white/95 shadow-2xl backdrop-blur-sm border-0">
									<CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 -mt-6 p-4 rounded-t-lg text-white">
										<div className="flex items-center gap-2 mb-2">
											<Gift className="w-5 h-5" />
											<CardTitle className="text-white text-lg">
												What's Included
											</CardTitle>
										</div>
										<CardDescription className="text-emerald-100">
											Everything you need to succeed
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4 p-6">
										<div className="flex items-center gap-3">
											<Check className="flex-shrink-0 w-5 h-5 text-emerald-600" />
											<span className="font-medium text-sm">
												Unlimited products & variants
											</span>
										</div>
										<div className="flex items-center gap-3">
											<Check className="flex-shrink-0 w-5 h-5 text-emerald-600" />
											<span className="font-medium text-sm">
												Premium templates & themes
											</span>
										</div>
										<div className="flex items-center gap-3">
											<Check className="flex-shrink-0 w-5 h-5 text-emerald-600" />
											<span className="font-medium text-sm">
												Advanced analytics & reports
											</span>
										</div>
										<div className="flex items-center gap-3">
											<Check className="flex-shrink-0 w-5 h-5 text-emerald-600" />
											<span className="font-medium text-sm">
												Email marketing automation
											</span>
										</div>
										<div className="flex items-center gap-3">
											<Check className="flex-shrink-0 w-5 h-5 text-emerald-600" />
											<span className="font-medium text-sm">
												Priority customer support
											</span>
										</div>
										<div className="flex items-center gap-3">
											<Check className="flex-shrink-0 w-5 h-5 text-emerald-600" />
											<span className="font-medium text-sm">
												Custom domain & SSL
											</span>
										</div>

										<Separator className="my-4" />

										<div className="text-center">
											<div className="flex justify-center items-center gap-1 mb-2">
												{[1, 2, 3, 4, 5].map((star) => (
													<Star
														key={star}
														className="fill-yellow-400 w-4 h-4 text-yellow-400"
													/>
												))}
											</div>
											<p className="text-gray-600 text-sm italic">
												"Best ecommerce platform I've used. Setup was incredibly
												easy!"
											</p>
											<p className="mt-1 text-gray-500 text-xs">
												- Sarah J., StyleCo
											</p>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Signup Form */}
							<div className="lg:col-span-1">
								<Card className="bg-white/95 shadow-2xl backdrop-blur-sm border-0">
									<CardHeader className="space-y-1 pb-6">
										<CardTitle className="text-2xl text-center">
											Create Your Account
										</CardTitle>
										<CardDescription className="text-base text-center">
											Start building your online store in minutes
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										{/* Social Sign Up */}
										<div className="space-y-3">
											<Button
												variant="outline"
												className="bg-white hover:bg-gray-50 border-gray-200 w-full h-12 cursor-pointer"
												type="button"
											>
												<div className="flex justify-center items-center gap-3">
													<img
														src="/icons/google-96.png"
														alt="Google"
														width={20}
														height={20}
														className="rounded"
													/>
													<span className="font-medium">
														Continue with Google
													</span>
												</div>
											</Button>
											<Button
												variant="outline"
												className="bg-white hover:bg-gray-50 border-gray-200 w-full h-12 cursor-pointer"
												type="button"
											>
												<div className="flex justify-center items-center gap-3">
													<img
														src="/icons/github-60.png"
														alt="Github"
														width={20}
														height={20}
														className="rounded"
													/>
													<span className="font-medium">
														Continue with GitHub
													</span>
												</div>
											</Button>
										</div>

										<div className="relative">
											<div className="absolute inset-0 flex items-center">
												<Separator className="w-full" />
											</div>
											<div className="relative flex justify-center text-xs uppercase">
												<span className="px-4 font-medium text-gray-500">
													Or create account with email
												</span>
											</div>
										</div>

										{/* Signup Form */}
										<form onSubmit={handleSubmit} className="space-y-5">
											<div className="gap-4 grid grid-cols-2">
												<div className="space-y-2">
													<Label
														htmlFor="firstName"
														className="font-medium text-gray-700 text-sm"
													>
														First Name
													</Label>
													<div className="relative">
														<User className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2 transform" />
														<Input
															id="firstName"
															type="text"
															placeholder="John"
															value={formData.firstName}
															onChange={(e) =>
																handleInputChange('firstName', e.target.value)
															}
															className="bg-gray-50 focus:bg-white pl-11 border-gray-200 h-12 transition-colors"
															required
														/>
													</div>
												</div>
												<div className="space-y-2">
													<Label
														htmlFor="lastName"
														className="font-medium text-gray-700 text-sm"
													>
														Last Name
													</Label>
													<Input
														id="lastName"
														type="text"
														placeholder="Doe"
														value={formData.lastName}
														onChange={(e) =>
															handleInputChange('lastName', e.target.value)
														}
														className="bg-gray-50 focus:bg-white border-gray-200 h-12 transition-colors"
														required
													/>
												</div>
											</div>

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
														placeholder="john@example.com"
														value={formData.email}
														onChange={(e) =>
															handleInputChange('email', e.target.value)
														}
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
														placeholder="Create a strong password"
														value={formData.password}
														onChange={(e) =>
															handleInputChange('password', e.target.value)
														}
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
												<p className="text-gray-500 text-xs">
													Must be at least 8 characters long
												</p>
											</div>

											<div className="space-y-2">
												<Label
													htmlFor="companyName"
													className="font-medium text-gray-700 text-sm"
												>
													Company Name
												</Label>
												<div className="relative">
													<Building2 className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2 transform" />
													<Input
														id="companyName"
														type="text"
														placeholder="Your Company"
														value={formData.companyName}
														onChange={(e) =>
															handleInputChange('companyName', e.target.value)
														}
														className="bg-gray-50 focus:bg-white pl-11 border-gray-200 h-12 transition-colors"
														required
													/>
												</div>
											</div>

											<div className="space-y-2">
												<Label
													htmlFor="companySize"
													className="font-medium text-gray-700 text-sm"
												>
													Company Size
												</Label>
												<Select
													value={formData.companySize}
													onValueChange={(value) =>
														handleInputChange('companySize', value)
													}
												>
													<SelectTrigger className="bg-gray-50 focus:bg-white border-gray-200 h-12">
														<SelectValue placeholder="Select company size" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="1">Just me</SelectItem>
														<SelectItem value="2-10">2-10 employees</SelectItem>
														<SelectItem value="11-50">
															11-50 employees
														</SelectItem>
														<SelectItem value="51-200">
															51-200 employees
														</SelectItem>
														<SelectItem value="201-1000">
															201-1000 employees
														</SelectItem>
														<SelectItem value="1000+">
															1000+ employees
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-4">
												<div className="flex items-start space-x-3">
													<Checkbox
														id="terms"
														checked={formData.agreeToTerms}
														onCheckedChange={(checked) =>
															handleInputChange(
																'agreeToTerms',
																checked as boolean,
															)
														}
														className="data-[state=checked]:bg-emerald-600 mt-1 data-[state=checked]:border-emerald-600"
														required
													/>
													<Label
														htmlFor="terms"
														className="text-gray-600 text-sm leading-5"
													>
														I agree to the{' '}
														<Link
															to="/"
															className="font-medium text-emerald-600 hover:text-emerald-700"
														>
															Terms of Service
														</Link>{' '}
														and{' '}
														<Link
															to="/"
															className="font-medium text-emerald-600 hover:text-emerald-700"
														>
															Privacy Policy
														</Link>
													</Label>
												</div>

												<div className="flex items-start space-x-3">
													<Checkbox
														id="updates"
														checked={formData.subscribeToUpdates}
														onCheckedChange={(checked) =>
															handleInputChange(
																'subscribeToUpdates',
																checked as boolean,
															)
														}
														className="data-[state=checked]:bg-emerald-600 mt-1 data-[state=checked]:border-emerald-600"
													/>
													<Label
														htmlFor="updates"
														className="text-gray-600 text-sm leading-5"
													>
														Send me product updates and marketing emails
														(optional)
													</Label>
												</div>
											</div>

											<Button
												type="submit"
												className="bg-emerald-600 hover:bg-emerald-700 w-full h-12 font-semibold text-base"
												size="lg"
												disabled={!formData.agreeToTerms}
											>
												Start Free Trial
												<ArrowRight className="ml-2 w-5 h-5" />
											</Button>
										</form>

										<div className="text-gray-600 text-sm text-center">
											Already have an account?{' '}
											<Link
												to="/auth/signin"
												className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
											>
												Sign in
											</Link>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Security Notice */}
						<div className="mt-8 text-center">
							<div className="flex justify-center items-center gap-2 text-white/80 text-sm">
								<Shield className="w-4 h-4" />
								<span>
									🔒 Your information is secure and encrypted. We never share
									your data with third parties.
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
