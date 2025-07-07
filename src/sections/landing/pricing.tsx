import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function PricingSection() {
	return (
		<section id="pricing" className="bg-gray-50 py-12 md:py-24 lg:py-32 w-full">
			<div className="mx-auto px-4 md:px-6 container">
				<div className="flex flex-col justify-center items-center space-y-4 text-center">
					<div className="space-y-2">
						<Badge className="bg-emerald-100 text-emerald-800">Pricing</Badge>
						<h2 className="font-bold text-3xl sm:text-5xl tracking-tighter">
							Simple, transparent pricing
						</h2>
						<p className="max-w-[900px] text-gray-500 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
							Choose the plan that fits your business. Start free and scale as
							you grow.
						</p>
					</div>
				</div>
				<div className="items-center gap-6 lg:gap-12 grid lg:grid-cols-3 mx-auto py-12 max-w-5xl">
					<Card className="shadow-lg border-0">
						<CardHeader>
							<CardTitle>Starter</CardTitle>
							<CardDescription>Perfect for new businesses</CardDescription>
							<div className="mt-4">
								<span className="font-bold text-4xl">$0</span>
								<span className="text-gray-500">/month</span>
							</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									Up to 10 products
								</li>
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									Basic templates
								</li>
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									SSL certificate
								</li>
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									Email support
								</li>
							</ul>
							<Button className="bg-transparent mt-6 w-full" variant="outline">
								Get Started Free
							</Button>
						</CardContent>
					</Card>
					<Card className="relative shadow-lg border-2 border-emerald-200">
						<Badge className="-top-3 left-1/2 absolute bg-emerald-600 text-white -translate-x-1/2 transform">
							Most Popular
						</Badge>
						<CardHeader>
							<CardTitle>Professional</CardTitle>
							<CardDescription>For growing businesses</CardDescription>
							<div className="mt-4">
								<span className="font-bold text-4xl">$29</span>
								<span className="text-gray-500">/month</span>
							</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									Unlimited products
								</li>
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									Premium templates
								</li>
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									Advanced analytics
								</li>
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									Priority support
								</li>
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									Custom domain
								</li>
							</ul>
							<Button className="bg-emerald-600 hover:bg-emerald-700 mt-6 w-full">
								Start Free Trial
							</Button>
						</CardContent>
					</Card>
					<Card className="shadow-lg border-0">
						<CardHeader>
							<CardTitle>Enterprise</CardTitle>
							<CardDescription>For large businesses</CardDescription>
							<div className="mt-4">
								<span className="font-bold text-4xl">$99</span>
								<span className="text-gray-500">/month</span>
							</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									Everything in Professional
								</li>
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									Advanced integrations
								</li>
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									White-label options
								</li>
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									Dedicated support
								</li>
								<li className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-600" />
									Custom development
								</li>
							</ul>
							<Button className="bg-transparent mt-6 w-full" variant="outline">
								Contact Sales
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
