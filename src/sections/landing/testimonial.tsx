import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';

const placeholderImage =
	'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541';
export default function TestimonialSection() {
	return (
		<section id="testimonials" className="py-12 md:py-24 lg:py-32 w-full">
			<div className="mx-auto px-4 md:px-6 container">
				<div className="flex flex-col justify-center items-center space-y-4 text-center">
					<div className="space-y-2">
						<Badge className="bg-emerald-100 text-emerald-800">
							Testimonials
						</Badge>
						<h2 className="font-bold text-3xl sm:text-5xl tracking-tighter">
							Loved by thousands of businesses
						</h2>
					</div>
				</div>
				<div className="items-center gap-6 lg:gap-12 grid lg:grid-cols-3 mx-auto py-12 max-w-5xl">
					<Card className="shadow-lg border-0">
						<CardHeader>
							<div className="flex items-center gap-2">
								<div className="flex">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className="fill-yellow-400 w-4 h-4 text-yellow-400"
										/>
									))}
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="mb-4 text-gray-600">
								"Rhombus X transformed our business. We went from idea to $100k
								in revenue in just 6 months. The platform is incredibly
								intuitive."
							</p>
							<div className="flex items-center gap-3">
								<img
									alt="Sarah Johnson"
									className="rounded-full"
									height="40"
									src={placeholderImage}
									width="40"
								/>
								<div>
									<p className="font-semibold">Sarah Johnson</p>
									<p className="text-gray-500 text-sm">Founder, StyleCo</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="shadow-lg border-0">
						<CardHeader>
							<div className="flex items-center gap-2">
								<div className="flex">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className="fill-yellow-400 w-4 h-4 text-yellow-400"
										/>
									))}
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="mb-4 text-gray-600">
								"The analytics and insights have been game-changing. We can now
								make data-driven decisions that actually move the needle."
							</p>
							<div className="flex items-center gap-3">
								<img
									alt="Mike Chen"
									className="rounded-full"
									height="40"
									src={placeholderImage}
									width="40"
								/>
								<div>
									<p className="font-semibold">Mike Chen</p>
									<p className="text-gray-500 text-sm">CEO, TechGear</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="shadow-lg border-0">
						<CardHeader>
							<div className="flex items-center gap-2">
								<div className="flex">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className="fill-yellow-400 w-4 h-4 text-yellow-400"
										/>
									))}
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="mb-4 text-gray-600">
								"Customer support is outstanding. They helped us migrate from
								our old platform seamlessly. Highly recommend!"
							</p>
							<div className="flex items-center gap-3">
								<img
									alt="Mike Chen"
									className="rounded-full"
									height="40"
									src={placeholderImage}
									width="40"
								/>
								<div>
									<p className="font-semibold">Emily Rodriguez</p>
									<p className="text-gray-500 text-sm">Owner, Artisan Crafts</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
