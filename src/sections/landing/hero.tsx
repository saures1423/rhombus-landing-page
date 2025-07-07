import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

export default function HeroSection() {
	return (
		<section className="bg-gradient-to-br from-emerald-100 to-teal-50 py-12 lg:py-20 xl:py-48 w-full">
			<div className="mx-auto px-4 md:px-6 xl:container">
				<div className="gap-6 lg:gap-12 grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_600px]">
					<div className="flex flex-col justify-center space-y-4">
						<div className="space-y-3">
							<Badge className="bg-emerald-100 hover:bg-emerald-100 text-emerald-800">
								🚀 Launch your store in minutes
							</Badge>
							<h1 className="font-bold text-3xl sm:text-5xl xl:text-6xl/none tracking-tighter">
								Build Your Dream
								<span className="text-emerald-600"> Ecommerce Store</span>
							</h1>
							<p className="max-w-[600px] text-gray-500 md:text-xl">
								Everything you need to start, run, and grow your online
								business. From payments to inventory management, we've got you
								covered.
							</p>
						</div>
						<div className="flex min-[400px]:flex-row flex-col gap-3">
							<Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
								Start Free Trial
								<ArrowRight className="ml-2 w-4 h-4" />
							</Button>
							<Button variant="outline" size="lg">
								Watch Demo
							</Button>
						</div>
						<div className="flex items-center gap-4 text-gray-600 text-xs">
							<div className="flex items-center gap-1">
								<Check className="w-4 h-4 text-emerald-600" />
								14-day free trial
							</div>
							<div className="flex items-center gap-1">
								<Check className="w-4 h-4 text-emerald-600" />
								No credit card required
							</div>
							<div className="flex items-center gap-1">
								<Check className="w-4 h-4 text-emerald-600" />
								Cancel anytime
							</div>
						</div>
					</div>
					<div className="hidden lg:flex justify-center items-center">
						<img
							src="/images/bg-2.jpg"
							alt="Hero"
							className="shadow-2xl rounded-xl object-cover aspect-video overflow-hidden"
							height={400}
							width={600}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
