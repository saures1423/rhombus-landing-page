import { Link, createFileRoute } from '@tanstack/react-router';
import type React from 'react';

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
import { ArrowRight, Chrome, Eye, EyeOff, Lock, Mail } from 'lucide-react';
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
		<div className="flex justify-center items-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4 pt-10 h-screen">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="font-bold text-gray-900 text-2xl">Welcome back</h1>
					<p className="mt-2 text-gray-600">
						Sign in to your account to continue
					</p>
				</div>

				<Card className="shadow-xl border-0">
					<CardHeader className="space-y-1 pb-6">
						<CardTitle className="text-xl text-center">Sign In</CardTitle>
						<CardDescription className="text-center">
							Enter your email and password to access your account
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Social Sign In */}
						<div className="space-y-3">
							<Button
								variant="outline"
								className="bg-transparent w-full"
								type="button"
							>
								<Chrome className="mr-2 w-4 h-4" />
								Continue with Google
							</Button>
						</div>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<Separator className="w-full" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-gray-500">
									Or continue with email
								</span>
							</div>
						</div>

						{/* Sign In Form */}
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<div className="relative">
									<Mail className="top-3 left-3 absolute w-4 h-4 text-gray-400" />
									<Input
										id="email"
										type="email"
										placeholder="Enter your email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Lock className="top-3 left-3 absolute w-4 h-4 text-gray-400" />
									<Input
										id="password"
										type={showPassword ? 'text' : 'password'}
										placeholder="Enter your password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="pr-10 pl-10"
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="top-3 right-3 absolute text-gray-400 hover:text-gray-600"
									>
										{showPassword ? (
											<EyeOff className="w-4 h-4" />
										) : (
											<Eye className="w-4 h-4" />
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
									/>
									<Label htmlFor="remember" className="text-gray-600 text-sm">
										Remember me
									</Label>
								</div>
								<Link
									to="/"
									className="text-emerald-600 hover:text-emerald-700 text-sm"
								>
									Forgot password?
								</Link>
							</div>

							<Button
								type="submit"
								className="bg-emerald-600 hover:bg-emerald-700 w-full"
								size="lg"
							>
								Sign In
								<ArrowRight className="ml-2 w-4 h-4" />
							</Button>
						</form>

						<div className="text-gray-600 text-sm text-center">
							Don't have an account?{' '}
							<Link
								to="/"
								className="font-medium text-emerald-600 hover:text-emerald-700"
							>
								Start free trial
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
