import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import {
	BarChart3,
	Calendar,
	Check,
	Code,
	CreditCard,
	Crown,
	Database,
	FileText,
	Gift,
	Globe,
	Heart,
	Layers,
	SmartphoneIcon as Mobile,
	Monitor,
	Package,
	Palette,
	Percent,
	PieChart,
	Play,
	Rocket,
	Search,
	Shield,
	Sparkles,
	Star,
	Store,
	Target,
	TrendingUp,
	Zap,
} from 'lucide-react';

import { useEffect, useRef, useState } from 'react';
import z from 'zod';

const featureSearchSchema = z.object({
	pageIndex: z.number().int().min(0).max(3).optional(),
});

// type FeatureSearch = z.infer<typeof featureSearchSchema>;

export const Route = createFileRoute('/_landing/features')({
	component: MoreFeaturesComponent,
	validateSearch: featureSearchSchema,
});

function MoreFeaturesComponent() {
	const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

	const { pageIndex } = Route.useSearch();

	const [activeCategory, setActiveCategory] = useState(pageIndex ?? 0);

	const sectionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (pageIndex !== undefined && sectionRef.current) {
			sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}

		setActiveCategory(pageIndex ?? 0);
	}, [pageIndex]);

	const featureCategories = [
		{
			title: '🚀 Store Building & Design',
			subtitle: 'Build Beautiful Stores in Minutes',
			description:
				'Create stunning, professional stores without any coding knowledge',
			color: 'from-purple-500 to-pink-500',
			bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
			features: [
				{
					icon: Zap,
					title: 'Drag & Drop Builder',
					description:
						'Build your store with our intuitive visual editor. No coding required.',
					highlight: true,
					demo: 'Try Live Demo',
					benefit: 'Save 40+ hours of development time',
				},
				{
					icon: Palette,
					title: 'Professional Templates',
					description:
						'Choose from 100+ professionally designed templates for every industry.',
					demo: 'Browse Templates',
					benefit: 'Instant professional look',
				},
				{
					icon: Code,
					title: 'Custom CSS/HTML',
					description:
						'Advanced customization options for developers and designers.',
					demo: 'View Code Editor',
					benefit: 'Unlimited customization',
				},
				{
					icon: Mobile,
					title: 'Mobile-First Design',
					description:
						'All themes are optimized for mobile devices and responsive design.',
					demo: 'Test Mobile View',
					benefit: '60% of sales come from mobile',
				},
				{
					icon: Monitor,
					title: 'Preview Mode',
					description:
						'Preview your store on desktop, tablet, and mobile before publishing.',
					demo: 'Try Preview',
					benefit: 'Perfect before you publish',
				},
				{
					icon: Layers,
					title: 'Theme Customizer',
					description:
						'Customize colors, fonts, layouts, and branding with real-time preview.',
					demo: 'Customize Now',
					benefit: 'Match your brand perfectly',
				},
			],
			pageQuery: 'store-builder',
		},
		{
			title: '💳 Payment & Checkout',
			subtitle: 'Get Paid Faster, Sell More',
			description:
				'Secure, fast, and flexible payment processing for global commerce',
			color: 'from-emerald-500 to-teal-500',
			bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
			features: [
				{
					icon: CreditCard,
					title: '100+ Payment Methods',
					description:
						'Accept credit cards, digital wallets, bank transfers, and local payment methods.',
					highlight: true,
					demo: 'See Payment Options',
					benefit: 'Increase conversion by 35%',
				},
				{
					icon: Shield,
					title: 'PCI Compliance',
					description:
						'Bank-level security with SSL encryption and PCI DSS compliance.',
					demo: 'Security Details',
					benefit: '100% secure transactions',
				},
				{
					icon: Globe,
					title: 'Multi-Currency Support',
					description:
						'Sell in 130+ currencies with automatic conversion and local pricing.',
					demo: 'Currency Calculator',
					benefit: 'Sell globally with ease',
				},
				{
					icon: Zap,
					title: 'One-Click Checkout',
					description: 'Reduce cart abandonment with express checkout options.',
					demo: 'Try Checkout',
					benefit: 'Reduce abandonment by 25%',
				},
				{
					icon: Percent,
					title: 'Tax Calculation',
					description:
						'Automatic tax calculation for all regions with real-time updates.',
					demo: 'Tax Calculator',
					benefit: 'Stay compliant automatically',
				},
				{
					icon: Gift,
					title: 'Discount Codes',
					description:
						'Create percentage, fixed amount, and BOGO discount campaigns.',
					demo: 'Create Discount',
					benefit: 'Boost sales with promotions',
				},
			],
		},
		{
			title: '📦 Inventory & Products',
			subtitle: 'Manage Everything Effortlessly',
			description:
				'Powerful tools to manage your products, inventory, and variants',
			color: 'from-blue-500 to-cyan-500',
			bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
			features: [
				{
					icon: Package,
					title: 'Unlimited Products',
					description:
						'Add unlimited products with multiple variants, images, and descriptions.',
					highlight: true,
					demo: 'Add Products',
					benefit: 'Scale without limits',
				},
				{
					icon: Database,
					title: 'Inventory Tracking',
					description:
						'Real-time inventory management with low stock alerts and forecasting.',
					demo: 'Inventory Dashboard',
					benefit: 'Never run out of stock',
				},
				{
					icon: Search,
					title: 'Advanced Search & Filters',
					description:
						'Help customers find products with smart search and filtering options.',
					demo: 'Search Demo',
					benefit: 'Customers find products 3x faster',
				},
				{
					icon: Star,
					title: 'Product Reviews',
					description:
						'Built-in review system with photo reviews and Q&A functionality.',
					demo: 'Review System',
					benefit: 'Increase trust and sales',
				},
				{
					icon: Layers,
					title: 'Product Variants',
					description:
						'Manage size, color, and custom variants with separate pricing and inventory.',
					demo: 'Variant Manager',
					benefit: 'Sell more product options',
				},
				{
					icon: FileText,
					title: 'Bulk Import/Export',
					description:
						'Import products via CSV or connect with existing inventory systems.',
					demo: 'Import Tool',
					benefit: 'Migrate in minutes',
				},
			],
		},
		{
			title: '📊 Analytics & Insights',
			subtitle: 'Data-Driven Growth',
			description:
				'Powerful analytics to understand your business and optimize performance',
			color: 'from-orange-500 to-red-500',
			bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
			features: [
				{
					icon: BarChart3,
					title: 'Advanced Analytics',
					description:
						'Comprehensive dashboard with sales, traffic, and conversion analytics.',
					highlight: true,
					demo: 'Live Dashboard',
					benefit: 'Make data-driven decisions',
				},
				{
					icon: TrendingUp,
					title: 'Sales Reports',
					description:
						'Detailed sales reports with trends, forecasting, and performance metrics.',
					demo: 'Sales Reports',
					benefit: 'Predict future revenue',
				},
				{
					icon: PieChart,
					title: 'Customer Insights',
					description:
						'Understand customer behavior, lifetime value, and purchase patterns.',
					demo: 'Customer Analytics',
					benefit: 'Know your customers better',
				},
				{
					icon: Target,
					title: 'Conversion Tracking',
					description:
						'Track conversion funnels and identify optimization opportunities.',
					demo: 'Funnel Analysis',
					benefit: 'Optimize for higher conversions',
				},
				{
					icon: Calendar,
					title: 'Real-Time Dashboard',
					description:
						'Monitor your store performance with live data and customizable widgets.',
					demo: 'Real-Time View',
					benefit: 'Stay updated instantly',
				},
				{
					icon: FileText,
					title: 'Custom Reports',
					description:
						'Create custom reports and export data for external analysis.',
					demo: 'Report Builder',
					benefit: 'Get insights you need',
				},
			],
		},
	];

	const stats = [
		{ number: '50k+', label: 'Active Stores', icon: Store },
		{ number: '$2.5B+', label: 'Sales Processed', icon: TrendingUp },
		{ number: '99.9%', label: 'Uptime', icon: Shield },
		{ number: '4.9/5', label: 'Customer Rating', icon: Star },
	];

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 py-12 md:py-24 lg:py-32 w-full overflow-hidden">
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

					<div className="z-10 relative mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 text-center">
							<div className="space-y-2">
								<Badge className="bg-emerald-200/20 hover:bg-emerald-200/30 backdrop-blur-sm border border-emerald-200/30 text-emerald-100">
									✨ All Features
								</Badge>
								<h1 className="font-bold text-white text-3xl sm:text-5xl xl:text-6xl/none tracking-tighter">
									Everything You Need to
									<span className="block text-emerald-200">
										{' '}
										Succeed Online
									</span>
								</h1>
								<p className="max-w-[900px] text-emerald-100 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
									Discover all the powerful features that make Rhombus X the
									complete ecommerce solution for businesses of all sizes. From
									store building to advanced analytics, we've got you covered.
								</p>
							</div>

							{/* Stats */}
							<div className="gap-6 grid grid-cols-2 md:grid-cols-4 mt-12 w-full max-w-4xl">
								{stats.map((stat, index) => (
									<div
										key={index}
										className="bg-white/10 backdrop-blur-sm p-4 border border-white/20 rounded-xl text-center"
									>
										<div className="flex justify-center items-center bg-white/20 mx-auto mb-2 rounded-lg w-12 h-12">
											<stat.icon className="w-6 h-6 text-white" />
										</div>
										<div className="mb-1 font-bold text-white text-2xl">
											{stat.number}
										</div>
										<div className="text-emerald-200 text-sm">{stat.label}</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Feature Categories */}
				<section
					ref={sectionRef}
					className="bg-gray-50 py-12 md:py-24 lg:py-32 w-full"
				>
					<div className="mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 mb-12 text-center">
							<div className="space-y-2">
								<Badge className="bg-emerald-100 text-emerald-800">
									Interactive Features
								</Badge>
								<h2 className="font-bold text-3xl sm:text-4xl tracking-tighter">
									Explore Our Powerful Features
								</h2>
								<p className="max-w-[900px] text-gray-500 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
									Click on any category to explore the features that will
									transform your business
								</p>
							</div>
						</div>

						{/* Category Tabs */}
						<div className="flex flex-wrap justify-center gap-4 mb-12">
							{featureCategories.map((category, index) => (
								<button
									type="button"
									key={index}
									onClick={() => {
										setActiveCategory(index);
									}}
									className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
										activeCategory === index
											? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
											: 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
									}`}
								>
									{category.title}
								</button>
							))}
						</div>

						{/* Active Category Display */}
						<div
							className={`${featureCategories[activeCategory].bgColor} rounded-3xl p-8 mb-12 transition-all duration-500`}
						>
							<div className="mb-8 text-center">
								<h3 className="mb-2 font-bold text-3xl">
									{featureCategories[activeCategory].subtitle}
								</h3>
								<p className="text-gray-600 text-lg">
									{featureCategories[activeCategory].description}
								</p>
							</div>

							<div className="gap-6 lg:gap-8 grid lg:grid-cols-3">
								{featureCategories[activeCategory].features.map(
									(feature, featureIndex) => (
										<Card
											key={featureIndex}
											className={`group border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
												feature.highlight
													? 'ring-2 ring-emerald-200 bg-white'
													: 'bg-white/80 backdrop-blur-sm'
											}`}
											onMouseEnter={() => setHoveredFeature(featureIndex)}
											onMouseLeave={() => setHoveredFeature(null)}
										>
											<CardHeader className="relative">
												<div className="flex items-center gap-4 mb-4">
													<div
														className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
															feature.highlight
																? `bg-gradient-to-r ${featureCategories[activeCategory].color} text-white shadow-lg`
																: 'bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600'
														}`}
													>
														<feature.icon className="w-7 h-7" />
													</div>
													<div className="flex-1">
														{feature.highlight && (
															<Badge className="bg-emerald-600 mb-2 text-white">
																<Crown className="mr-1 w-3 h-3" />
																Most Popular
															</Badge>
														)}
														<CardTitle className="group-hover:text-emerald-600 text-xl transition-colors">
															{feature.title}
														</CardTitle>
													</div>
												</div>

												<CardDescription className="mb-4 text-base leading-relaxed">
													{feature.description}
												</CardDescription>

												{feature.benefit && (
													<div className="flex items-center gap-2 mb-4">
														<div className="flex justify-center items-center bg-green-100 rounded-full w-6 h-6">
															<TrendingUp className="w-3 h-3 text-green-600" />
														</div>
														<span className="font-medium text-green-700 text-sm">
															{feature.benefit}
														</span>
													</div>
												)}

												<div className="flex gap-2">
													<Button
														size="sm"
														className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
													>
														<Play className="mr-1 w-3 h-3" />
														{feature.demo}
													</Button>
													<Button
														size="sm"
														variant="outline"
														className="bg-transparent hover:bg-emerald-50 border-emerald-200 text-emerald-600"
													>
														<Heart className="w-3 h-3" />
													</Button>
												</div>

												{hoveredFeature === featureIndex && (
													<div className="-top-2 -right-2 absolute flex justify-center items-center bg-emerald-500 rounded-full w-8 h-8 animate-pulse">
														<Sparkles className="w-4 h-4 text-white" />
													</div>
												)}
											</CardHeader>
										</Card>
									),
								)}
							</div>
						</div>
					</div>
				</section>

				{/* Feature Comparison */}
				<section className="bg-white py-12 md:py-24 lg:py-32 w-full">
					<div className="mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 mb-12 text-center">
							<div className="space-y-2">
								<Badge className="bg-blue-100 text-blue-800">Comparison</Badge>
								<h2 className="font-bold text-3xl sm:text-4xl tracking-tighter">
									See How We Compare
								</h2>
								<p className="max-w-[900px] text-gray-500 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
									Rhombus X offers more features and better value than other
									ecommerce platforms.
								</p>
							</div>
						</div>
						<div className="mx-auto max-w-4xl">
							<div className="overflow-x-auto">
								<table className="bg-white shadow-lg rounded-xl w-full overflow-hidden border-collapse">
									<thead>
										<tr className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
											<th className="p-6 font-semibold text-left">Feature</th>
											<th className="p-6 font-semibold text-center">
												<div className="flex justify-center items-center gap-2">
													<Crown className="w-5 h-5" />
													Rhombus X
												</div>
											</th>
											<th className="opacity-70 p-6 font-semibold text-center">
												Competitor A
											</th>
											<th className="opacity-70 p-6 font-semibold text-center">
												Competitor B
											</th>
										</tr>
									</thead>
									<tbody>
										{[
											['Unlimited Products', true, false, true],
											['Advanced Analytics', true, true, false],
											['Multi-Currency', true, false, true],
											['Email Marketing', true, false, false],
											['Live Chat Support', true, true, false],
											['Custom CSS/HTML', true, false, true],
											['Abandoned Cart Recovery', true, false, false],
											['SEO Optimization', true, true, true],
										].map(([feature, commerce, compA, compB], index) => (
											<tr
												key={index}
												className="hover:bg-emerald-50 border-b transition-colors"
											>
												<td className="p-6 font-medium">{feature}</td>
												<td className="p-6 text-center">
													{commerce ? (
														<div className="flex justify-center items-center">
															<div className="flex justify-center items-center bg-emerald-100 rounded-full w-8 h-8">
																<Check className="w-5 h-5 text-emerald-600" />
															</div>
														</div>
													) : (
														<span className="text-gray-400">—</span>
													)}
												</td>
												<td className="p-6 text-center">
													{compA ? (
														<Check className="mx-auto w-5 h-5 text-gray-400" />
													) : (
														<span className="text-gray-400">—</span>
													)}
												</td>
												<td className="p-6 text-center">
													{compB ? (
														<Check className="mx-auto w-5 h-5 text-gray-400" />
													) : (
														<span className="text-gray-400">—</span>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</section>

				{/* Stories */}
				<section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 md:py-24 lg:py-32 w-full">
					<div className="mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 mb-12 text-center">
							<div className="space-y-2">
								<Badge className="bg-emerald-100 text-emerald-800">
									Success Stories
								</Badge>
								<h2 className="font-bold text-3xl sm:text-4xl tracking-tighter">
									Real Results from Real Customers
								</h2>
								<p className="max-w-[900px] text-gray-600 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
									See how our features have transformed businesses just like
									yours
								</p>
							</div>
						</div>
						<div className="items-center gap-6 lg:gap-8 grid lg:grid-cols-3 mx-auto max-w-5xl">
							{[
								{
									quote:
										'The drag & drop builder saved us 40+ hours. We launched in just 2 days!',
									author: 'Sarah Johnson',
									role: 'Founder, StyleCo',
									metric: '40+ hours saved',
									avatar:
										'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541',
									feature: 'Store Builder',
								},
								{
									quote:
										'Multi-currency support helped us expand globally. Sales increased 300%!',
									author: 'Mike Chen',
									role: 'CEO, TechGear',
									metric: '300% sales increase',
									avatar:
										'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541',
									feature: 'Global Commerce',
								},
								{
									quote:
										'Analytics insights helped optimize our funnel. Conversion rate doubled!',
									author: 'Emily Rodriguez',
									role: 'Owner, Artisan Crafts',
									metric: '2x conversion rate',
									avatar:
										'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541',
									feature: 'Analytics',
								},
							].map((testimonial, index) => (
								<Card
									key={index}
									className="group bg-white/80 shadow-xl hover:shadow-2xl backdrop-blur-sm border-0 transition-all duration-300"
								>
									<CardHeader className="relative">
										<div className="flex justify-between items-center mb-4">
											<div className="flex">
												{[1, 2, 3, 4, 5].map((star) => (
													<Star
														key={star}
														className="fill-yellow-400 w-4 h-4 text-yellow-400"
													/>
												))}
											</div>
											<Badge className="bg-emerald-100 font-semibold text-emerald-800 text-xs">
												{testimonial.feature}
											</Badge>
										</div>

										<div className="mb-4 text-center">
											<div className="mb-1 font-bold text-emerald-600 text-3xl">
												{testimonial.metric}
											</div>
											<div className="text-gray-500 text-sm">improvement</div>
										</div>
									</CardHeader>
									<CardDescription className="px-6 pb-6">
										<p className="mb-6 text-gray-700 italic leading-relaxed">
											"{testimonial.quote}"
										</p>
										<div className="flex items-center gap-4">
											<img
												alt={testimonial.author}
												className="border-2 border-emerald-100 rounded-full"
												height="50"
												src={testimonial.avatar || '/placeholder.svg'}
												width="50"
											/>
											<div>
												<p className="font-semibold text-gray-900">
													{testimonial.author}
												</p>
												<p className="text-gray-600 text-sm">
													{testimonial.role}
												</p>
											</div>
										</div>
									</CardDescription>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 py-12 md:py-24 lg:py-32 w-full overflow-hidden">
					{/* Background Pattern */}
					<div className="absolute inset-0 opacity-10">
						<div className="top-20 left-20 absolute bg-white rounded-full w-32 h-32 animate-pulse" />
						<div className="right-20 bottom-20 absolute bg-white rounded-full w-28 h-28 animate-pulse delay-300" />
					</div>

					<div className="z-10 relative mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="flex justify-center items-center gap-2 mb-4">
									<Badge className="bg-yellow-400 px-4 py-2 text-yellow-900 text-lg">
										🚀 Ready to Launch?
									</Badge>
								</div>
								<h2 className="font-bold text-white text-3xl sm:text-5xl tracking-tighter">
									Start Building Your Dream Store Today
								</h2>
								<p className="max-w-[600px] text-emerald-100 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
									Join thousands of successful businesses using Rhombus X. Get
									access to all features with our free trial.
								</p>
							</div>
							<div className="flex min-[400px]:flex-row flex-col gap-2">
								<Button
									size="lg"
									className="bg-white hover:bg-emerald-50 px-8 h-14 font-semibold text-emerald-600"
									asChild
								>
									<Link to="/auth/start-trial">
										<span>
											<Rocket className="mr-2 w-5 h-5" />
										</span>
										Start Free Trial
									</Link>
								</Button>
								<Button
									variant="outline"
									size="lg"
									className="bg-transparent hover:bg-white backdrop-blur-sm px-8 border-white h-14 font-semibold text-white hover:text-emerald-600"
								>
									<Play className="mr-2 w-5 h-5" />
									Watch Demo
								</Button>
							</div>
							<div className="flex items-center gap-6 mt-6 text-emerald-100 text-sm">
								<div className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-200" />
									14-day free trial
								</div>
								<div className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-200" />
									No credit card required
								</div>
								<div className="flex items-center gap-2">
									<Check className="w-4 h-4 text-emerald-200" />
									Cancel anytime
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
