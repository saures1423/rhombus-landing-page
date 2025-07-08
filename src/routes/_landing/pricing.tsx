import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Check, HelpCircle, Star, X } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_landing/pricing')({
	component: PricingComponent,
});

function PricingComponent() {
	const [isAnnual, setIsAnnual] = useState(false);

	const plans = [
		{
			name: 'Starter',
			description: 'Perfect for new businesses getting started',
			monthlyPrice: 0,
			annualPrice: 0,
			popular: false,
			features: [
				{ name: 'Up to 10 products', included: true },
				{ name: 'Basic templates', included: true },
				{ name: 'SSL certificate', included: true },
				{ name: 'Email support', included: true },
				{ name: 'Mobile responsive', included: true },
				{ name: 'Basic analytics', included: true },
				{ name: 'Payment processing', included: true },
				{ name: 'Advanced analytics', included: false },
				{ name: 'Email marketing', included: false },
				{ name: 'Priority support', included: false },
				{ name: 'Custom domain', included: false },
				{ name: 'Advanced integrations', included: false },
			],
			cta: 'Get Started Free',
			ctaVariant: 'outline' as const,
		},
		{
			name: 'Professional',
			description: 'For growing businesses that need more power',
			monthlyPrice: 29,
			annualPrice: 24,
			popular: true,
			features: [
				{ name: 'Unlimited products', included: true },
				{ name: 'Premium templates', included: true },
				{ name: 'SSL certificate', included: true },
				{ name: 'Priority support', included: true },
				{ name: 'Mobile responsive', included: true },
				{ name: 'Advanced analytics', included: true },
				{ name: 'Payment processing', included: true },
				{ name: 'Email marketing', included: true },
				{ name: 'Custom domain', included: true },
				{ name: 'SEO optimization', included: true },
				{ name: 'Abandoned cart recovery', included: true },
				{ name: 'Advanced integrations', included: false },
			],
			cta: 'Start Free Trial',
			ctaVariant: 'default' as const,
		},
		{
			name: 'Enterprise',
			description: 'For large businesses with custom needs',
			monthlyPrice: 99,
			annualPrice: 79,
			popular: false,
			features: [
				{ name: 'Everything in Professional', included: true },
				{ name: 'Advanced integrations', included: true },
				{ name: 'White-label options', included: true },
				{ name: 'Dedicated support', included: true },
				{ name: 'Custom development', included: true },
				{ name: 'API access', included: true },
				{ name: 'Advanced security', included: true },
				{ name: 'Multi-store management', included: true },
				{ name: 'Custom reporting', included: true },
				{ name: 'SLA guarantee', included: true },
				{ name: 'Onboarding assistance', included: true },
				{ name: 'Training sessions', included: true },
			],
			cta: 'Contact Sales',
			ctaVariant: 'outline' as const,
		},
	]

	const faqs = [
		{
			question: 'Can I change my plan at any time?',
			answer:
				"Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
		},
		{
			question: 'Is there a free trial available?',
			answer:
				'Yes! We offer a 14-day free trial for all paid plans. No credit card required to start your trial.',
		},
		{
			question: 'What payment methods do you accept?',
			answer:
				'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.',
		},
		{
			question: 'Are there any setup fees?',
			answer:
				'No, there are no setup fees or hidden costs. You only pay the monthly or annual subscription fee.',
		},
		{
			question: 'Can I cancel my subscription anytime?',
			answer:
				'Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period.',
		},
		{
			question: 'Do you offer refunds?',
			answer:
				"We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll provide a full refund.",
		},
		{
			question: 'What kind of support do you provide?',
			answer:
				'We provide email support for all plans, priority support for Professional plans, and dedicated support for Enterprise customers.',
		},
		{
			question: 'Are there transaction fees?',
			answer:
				"We don't charge transaction fees. However, payment processors (like Stripe or PayPal) charge their standard processing fees.",
		},
	]

	const getPrice = (plan: (typeof plans)[0]) => {
		return isAnnual ? plan.annualPrice : plan.monthlyPrice;
	}

	const getSavings = (plan: (typeof plans)[0]) => {
		if (plan.monthlyPrice === 0) return 0;
		return (
			((plan.monthlyPrice - plan.annualPrice) / plan.monthlyPrice) *
			100
		).toFixed(0);
	}

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1">
				<section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-12 md:py-24 lg:py-32 w-full">
					<div className="mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 text-center">
							<div className="space-y-2">
								<Badge className="bg-emerald-100 text-emerald-800">
									Pricing
								</Badge>
								<h1 className="font-bold text-3xl sm:text-5xl xl:text-6xl/none tracking-tighter">
									Simple, Transparent
									<span className="text-emerald-600"> Pricing</span>
								</h1>
								<p className="max-w-[900px] text-gray-500 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
									Choose the perfect plan for your business. Start free and
									scale as you grow. No hidden fees, no surprises.
								</p>
							</div>

							{/* Billing Toggle */}
							<div className="flex items-center gap-4 mt-8">
								<span
									className={`text-sm font-medium ${
										!isAnnual ? 'text-emerald-600' : 'text-gray-500'
									}`}
								>
									Monthly
								</span>
								<Switch
									checked={isAnnual}
									onCheckedChange={setIsAnnual}
									className="data-[state=checked]:bg-emerald-600"
								/>
								<span
									className={`text-sm font-medium ${isAnnual ? 'text-emerald-600' : 'text-gray-500'}`}
								>
									Annual
								</span>
								<Badge className="bg-emerald-100 text-emerald-800 text-xs">
									Save up to 20%
								</Badge>
							</div>
						</div>
					</div>
				</section>

				{/* Pricing Plans */}
				<section className="py-12 md:py-24 lg:py-32 w-full">
					<div className="mx-auto px-4 md:px-6 container">
						<div className="gap-8 lg:gap-8 grid lg:grid-cols-3 mx-auto max-w-6xl">
							{plans.map((plan, index) => (
								<Card
									key={index}
									className={`relative border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${
										plan.popular ? 'ring-2 ring-emerald-200 scale-105' : ''
									}`}
								>
									{plan.popular && (
										<Badge className="-top-3 left-1/2 absolute bg-emerald-600 text-white -translate-x-1/2 transform">
											Most Popular
										</Badge>
									)}
									<CardHeader className="pb-8 text-center">
										<CardTitle className="text-2xl">{plan.name}</CardTitle>
										<CardDescription className="text-base">
											{plan.description}
										</CardDescription>
										<div className='mt-6'>
											<div className="flex justify-center items-baseline gap-1">
												<span className="font-bold text-5xl">
													${getPrice(plan)}
												</span>
												<span className='text-gray-500'>
													/{isAnnual ? 'year' : 'month'}
												</span>
											</div>
											{isAnnual && plan.monthlyPrice > 0 && (
												<div className='mt-2'>
													<span className="text-gray-500 text-sm line-through">
														${plan.monthlyPrice * 12}/year
													</span>
													<Badge className="bg-green-100 ml-2 text-green-800 text-xs">
														Save {getSavings(plan)}%
													</Badge>
												</div>
											)}
										</div>
									</CardHeader>
									<CardContent>
										<ul className="space-y-3 mb-8">
											{plan.features.map((feature, featureIndex) => (
												<li
													key={featureIndex}
													className='flex items-center gap-3'
												>
													{feature.included ? (
														<Check className="flex-shrink-0 w-5 h-5 text-emerald-600" />
													) : (
														<X className="flex-shrink-0 w-5 h-5 text-gray-300" />
													)}
													<span
														className={`text-sm ${
															feature.included
																? 'text-gray-900'
																: 'text-gray-400'
														}`}
													>
														{feature.name}
													</span>
												</li>
											))}
										</ul>
										<Button
											className={`w-full ${
												plan.ctaVariant === 'default'
													? 'bg-emerald-600 hover:bg-emerald-700'
													: 'bg-transparent border-emerald-600 text-emerald-600 hover:bg-emerald-50'
											}`}
											variant={plan.ctaVariant}
											size='lg'
										>
											{plan.cta}
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* Feature Comparison Table */}
				<section className="bg-gray-50 py-12 md:py-24 lg:py-32 w-full">
					<div className="mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 mb-12 text-center">
							<div className="space-y-2">
								<h2 className="font-bold text-3xl sm:text-4xl tracking-tighter">
									Compare All Features
								</h2>
								<p className="max-w-[900px] text-gray-500 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
									See exactly what's included in each plan with our detailed
									feature comparison.
								</p>
							</div>
						</div>
						<div className="mx-auto max-w-5xl">
							<div className="overflow-x-auto">
								<table className="bg-white shadow-sm rounded-lg w-full border-collapse">
									<thead>
										<tr className="bg-gray-50 border-b">
											<th className="p-4 font-semibold text-left">Features</th>
											<th className="p-4 font-semibold text-center">Starter</th>
											<th className="p-4 font-semibold text-emerald-600 text-center">
												Professional
											</th>
											<th className="p-4 font-semibold text-center">
												Enterprise
											</th>
										</tr>
									</thead>
									<tbody>
										{[
											['Products', 'Up to 10', 'Unlimited', 'Unlimited'],
											['Templates', 'Basic', 'Premium', 'Premium + Custom'],
											['Analytics', 'Basic', 'Advanced', 'Advanced + Custom'],
											['Email Marketing', '❌', '✅', '✅'],
											['Priority Support', '❌', '✅', '✅'],
											['Custom Domain', '❌', '✅', '✅'],
											['API Access', '❌', '❌', '✅'],
											['White-label', '❌', '❌', '✅'],
											['Dedicated Support', '❌', '❌', '✅'],
										].map(
											([feature, starter, professional, enterprise], index) => (
												<tr key={index} className="hover:bg-gray-50 border-b">
													<td className="p-4 font-medium">{feature}</td>
													<td className="p-4 text-sm text-center">{starter}</td>
													<td className="p-4 text-sm text-center">
														{professional}
													</td>
													<td className="p-4 text-sm text-center">
														{enterprise}
													</td>
												</tr>
											),
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</section>

				{/* FAQ Section */}
				<section className="py-12 md:py-24 lg:py-32 w-full">
					<div className="mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 mb-12 text-center">
							<div className="space-y-2">
								<h2 className="font-bold text-3xl sm:text-4xl tracking-tighter">
									Frequently Asked Questions
								</h2>
								<p className="max-w-[900px] text-gray-500 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
									Got questions? We've got answers. If you can't find what
									you're looking for, feel free to contact us.
								</p>
							</div>
						</div>
						<div className="mx-auto max-w-3xl">
							<Accordion type="single" collapsible className="w-full">
								{faqs.map((faq, index) => (
									<AccordionItem key={index} value={`item-${index}`}>
										<AccordionTrigger className="text-left">
											<div className="flex items-center gap-3">
												<HelpCircle className="flex-shrink-0 w-5 h-5 text-emerald-600" />
												{faq.question}
											</div>
										</AccordionTrigger>
										<AccordionContent className="pl-8 text-gray-600">
											{faq.answer}
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</div>
					</div>
				</section>

				{/* Testimonials */}
				<section className="bg-gray-50 py-12 md:py-24 lg:py-32 w-full">
					<div className="mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 mb-12 text-center">
							<div className="space-y-2">
								<h2 className="font-bold text-3xl sm:text-4xl tracking-tighter">
									What Our Customers Say
								</h2>
								<p className="max-w-[900px] text-gray-500 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
									Don't just take our word for it. Here's what real customers
									say about CommerceFlow.
								</p>
							</div>
						</div>
						<div className="items-center gap-6 lg:gap-8 grid lg:grid-cols-3 mx-auto max-w-5xl">
							{[
								{
									quote:
										'The Professional plan has everything we need. The email marketing feature alone has increased our sales by 40%.',
									author: 'Sarah Johnson',
									role: 'Founder, StyleCo',
									plan: 'Professional Plan',
								},
								{
									quote:
										'Started with the free plan and quickly upgraded. The transition was seamless and the support team was incredibly helpful.',
									author: 'Mike Chen',
									role: 'CEO, TechGear',
									plan: 'Enterprise Plan',
								},
								{
									quote:
										'Best value for money in the market. The features you get for $29/month would cost hundreds elsewhere.',
									author: 'Emily Rodriguez',
									role: 'Owner, Artisan Crafts',
									plan: 'Professional Plan',
								},
							].map((testimonial, index) => (
								<Card key={index} className="shadow-lg border-0">
									<CardHeader>
										<div className="flex items-center gap-2 mb-4">
											<div className='flex'>
												{[1, 2, 3, 4, 5].map((star) => (
													<Star
														key={star}
														className="fill-yellow-400 w-4 h-4 text-yellow-400"
													/>
												))}
											</div>
											<Badge className="bg-emerald-100 text-emerald-800 text-xs">
												{testimonial.plan}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<p className="mb-4 text-gray-600">"{testimonial.quote}"</p>
										<div>
											<p className="font-semibold">{testimonial.author}</p>
											<p className="text-gray-500 text-sm">
												{testimonial.role}
											</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="bg-emerald-600 py-12 md:py-24 lg:py-32 w-full">
					<div className="mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="font-bold text-white text-3xl sm:text-5xl tracking-tighter">
									Ready to Get Started?
								</h2>
								<p className="max-w-[600px] text-emerald-100 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
									Join thousands of successful businesses using CommerceFlow.
									Start your free trial today.
								</p>
							</div>
							<div className="flex min-[400px]:flex-row flex-col gap-2">
								<Button
									size='lg'
									className="bg-white hover:bg-gray-100 text-emerald-600"
								>
									Start Free Trial
									<ArrowRight className="ml-2 w-4 h-4" />
								</Button>
								<Button
									variant='outline'
									size='lg'
									className="bg-transparent hover:bg-white border-white text-white hover:text-emerald-600"
								>
									Contact Sales
								</Button>
							</div>
							<p className="text-emerald-100 text-sm">
								14-day free trial • No credit card required • Cancel anytime
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}
