import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CTASection() {
	return (
		<section className="bg-emerald-600 py-12 lg:py-20 w-full">
			<div className="mx-auto px-4 md:px-6 container">
				<div className="flex flex-col justify-center items-center space-y-4 text-center">
					<div className="flex flex-col items-center space-y-2">
						<h2 className="font-bold text-white text-3xl sm:text-5xl tracking-tighter">
							Ready to start your ecommerce journey?
						</h2>
						<p className="max-w-[600px] text-emerald-100 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
							Join thousands of successful businesses. Start your free trial
							today and see the difference.
						</p>
					</div>
					<div className="space-y-2 w-full max-w-sm">
						<form className="flex gap-2">
							<Input
								className="flex-1 bg-white max-w-lg"
								placeholder="Enter your email"
								type="email"
							/>
							<Button
								type="submit"
								className="bg-white hover:bg-gray-100 text-emerald-600"
							>
								Start Free Trial
							</Button>
						</form>
						<p className="text-emerald-100 text-xs">
							14-day free trial. No credit card required.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
