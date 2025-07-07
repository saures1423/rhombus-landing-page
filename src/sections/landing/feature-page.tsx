import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	BarChart3,
	CreditCard,
	Globe,
	Shield,
	Smartphone,
	Zap,
} from 'lucide-react';

export default function FeatureSection() {
	return (
		<section id="features" className="bg-gray-50 py-12 lg:py-20 w-full">
			<div className="mx-auto px-4 md:px-6 container">
				<div className="flex flex-col justify-center items-center space-y-4 text-center">
					<div className="space-y-2">
						<Badge className="bg-emerald-100 text-emerald-800">Features</Badge>
						<h2 className="font-bold text-3xl sm:text-5xl tracking-tighter">
							Everything you need to succeed online
						</h2>
						<p className="max-w-[900px] text-gray-500 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
							From storefront design to payment processing, our platform
							provides all the tools you need to build and scale your ecommerce
							business.
						</p>
					</div>
				</div>
				<div className="items-center gap-6 lg:gap-12 grid lg:grid-cols-3 mx-auto py-12 max-w-5xl">
					<Card className="shadow-lg border-0">
						<CardHeader>
							<div className="flex justify-center items-center bg-emerald-100 mb-4 rounded-lg w-12 h-12">
								<Zap className="w-6 h-6 text-emerald-600" />
							</div>
							<CardTitle>Lightning Fast Setup</CardTitle>
							<CardDescription>
								Get your store online in minutes with our intuitive
								drag-and-drop builder and pre-designed templates.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="shadow-lg border-0">
						<CardHeader>
							<div className="flex justify-center items-center bg-emerald-100 mb-4 rounded-lg w-12 h-12">
								<CreditCard className="w-6 h-6 text-emerald-600" />
							</div>
							<CardTitle>Secure Payments</CardTitle>
							<CardDescription>
								Accept payments from anywhere with built-in support for 100+
								payment methods and fraud protection.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="shadow-lg border-0">
						<CardHeader>
							<div className="flex justify-center items-center bg-emerald-100 mb-4 rounded-lg w-12 h-12">
								<BarChart3 className="w-6 h-6 text-emerald-600" />
							</div>
							<CardTitle>Advanced Analytics</CardTitle>
							<CardDescription>
								Track your performance with detailed analytics, conversion
								tracking, and actionable insights.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="shadow-lg border-0">
						<CardHeader>
							<div className="flex justify-center items-center bg-emerald-100 mb-4 rounded-lg w-12 h-12">
								<Smartphone className="w-6 h-6 text-emerald-600" />
							</div>
							<CardTitle>Mobile Optimized</CardTitle>
							<CardDescription>
								Your store looks perfect on every device with responsive design
								and mobile-first approach.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="shadow-lg border-0">
						<CardHeader>
							<div className="flex justify-center items-center bg-emerald-100 mb-4 rounded-lg w-12 h-12">
								<Globe className="w-6 h-6 text-emerald-600" />
							</div>
							<CardTitle>Global Reach</CardTitle>
							<CardDescription>
								Sell worldwide with multi-currency support, international
								shipping, and localization features.
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className="shadow-lg border-0">
						<CardHeader>
							<div className="flex justify-center items-center bg-emerald-100 mb-4 rounded-lg w-12 h-12">
								<Shield className="w-6 h-6 text-emerald-600" />
							</div>
							<CardTitle>Enterprise Security</CardTitle>
							<CardDescription>
								Bank-level security with SSL certificates, PCI compliance, and
								regular security updates.
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</div>
		</section>
	);
}
