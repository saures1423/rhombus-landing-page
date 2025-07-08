import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CTASection() {
	return (
		<section className="relative bg-gradient-to-br from-emerald-400 via-teal-600 to-cyan-600 py-12 md:py-24 lg:py-32 w-full overflow-hidden">
			<div className="absolute inset-0 opacity-10">
				<div className="top-20 left-20 absolute bg-white rounded-full w-32 h-32 animate-pulse" />
				<div className="right-20 bottom-20 absolute bg-white rounded-full w-28 h-28 animate-pulse delay-300" />
			</div>
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
					<div className="z-50 space-y-2 w-full max-w-sm">
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
