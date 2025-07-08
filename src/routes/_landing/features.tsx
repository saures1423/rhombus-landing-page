import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { createFileRoute } from '@tanstack/react-router';
import {
	ArrowRight,
	BarChart3,
	Bell,
	Calendar,
	Check,
	Cloud,
	Code,
	CreditCard,
	Database,
	FileText,
	Gift,
	Globe,
	HeadphonesIcon,
	Layers,
	Lock,
	Mail,
	Megaphone,
	MessageSquare,
	SmartphoneIcon as Mobile,
	Monitor,
	Package,
	Palette,
	Percent,
	PieChart,
	Repeat,
	Search,
	Settings,
	Shield,
	Star,
	Target,
	TrendingUp,
	Truck,
	Users,
	Workflow,
	Zap,
} from 'lucide-react';

export const Route = createFileRoute('/_landing/features')({
	component: MoreFeaturesComponent,
});

function MoreFeaturesComponent() {
	const featureCategories = [
		{
			title: 'Store Building & Design',
			id: 'store-builder',
			description:
				'Create beautiful, professional stores without any coding knowledge',
			features: [
				{
					icon: Zap,
					title: 'Drag & Drop Builder',
					description:
						'Build your store with our intuitive visual editor. No coding required.',
					highlight: true,
				},
				{
					icon: Palette,
					title: 'Professional Templates',
					description:
						'Choose from 100+ professionally designed templates for every industry.',
				},
				{
					icon: Code,
					title: 'Custom CSS/HTML',
					description:
						'Advanced customization options for developers and designers.',
				},
				{
					icon: Mobile,
					title: 'Mobile-First Design',
					description:
						'All themes are optimized for mobile devices and responsive design.',
				},
				{
					icon: Monitor,
					title: 'Preview Mode',
					description:
						'Preview your store on desktop, tablet, and mobile before publishing.',
				},
				{
					icon: Layers,
					title: 'Theme Customizer',
					description:
						'Customize colors, fonts, layouts, and branding with real-time preview.',
				},
			],
		},
		{
			title: 'Payment & Checkout',
			id: 'payment-processing',
			description:
				'Secure, fast, and flexible payment processing for global commerce',
			features: [
				{
					icon: CreditCard,
					title: '100+ Payment Methods',
					description:
						'Accept credit cards, digital wallets, bank transfers, and local payment methods.',
					highlight: true,
				},
				{
					icon: Shield,
					title: 'PCI Compliance',
					description:
						'Bank-level security with SSL encryption and PCI DSS compliance.',
				},
				{
					icon: Globe,
					title: 'Multi-Currency Support',
					description:
						'Sell in 130+ currencies with automatic conversion and local pricing.',
				},
				{
					icon: Zap,
					title: 'One-Click Checkout',
					description: 'Reduce cart abandonment with express checkout options.',
				},
				{
					icon: Percent,
					title: 'Tax Calculation',
					description:
						'Automatic tax calculation for all regions with real-time updates.',
				},
				{
					icon: Gift,
					title: 'Discount Codes',
					description:
						'Create percentage, fixed amount, and BOGO discount campaigns.',
				},
			],
		},
		{
			title: 'Inventory & Product Management',
			id: 'inventory-management',
			description:
				'Powerful tools to manage your products, inventory, and variants',
			features: [
				{
					icon: Package,
					title: 'Unlimited Products',
					description:
						'Add unlimited products with multiple variants, images, and descriptions.',
					highlight: true,
				},
				{
					icon: Database,
					title: 'Inventory Tracking',
					description:
						'Real-time inventory management with low stock alerts and forecasting.',
				},
				{
					icon: Search,
					title: 'Advanced Search & Filters',
					description:
						'Help customers find products with smart search and filtering options.',
				},
				{
					icon: Star,
					title: 'Product Reviews',
					description:
						'Built-in review system with photo reviews and Q&A functionality.',
				},
				{
					icon: Layers,
					title: 'Product Variants',
					description:
						'Manage size, color, and custom variants with separate pricing and inventory.',
				},
				{
					icon: FileText,
					title: 'Bulk Import/Export',
					description:
						'Import products via CSV or connect with existing inventory systems.',
				},
			],
		},
		{
			title: 'Analytics & Reporting',
			id: 'analytics-reporting',
			description:
				'Data-driven insights to grow your business and optimize performance',
			features: [
				{
					icon: BarChart3,
					title: 'Advanced Analytics',
					description:
						'Comprehensive dashboard with sales, traffic, and conversion analytics.',
					highlight: true,
				},
				{
					icon: TrendingUp,
					title: 'Sales Reports',
					description:
						'Detailed sales reports with trends, forecasting, and performance metrics.',
				},
				{
					icon: PieChart,
					title: 'Customer Insights',
					description:
						'Understand customer behavior, lifetime value, and purchase patterns.',
				},
				{
					icon: Target,
					title: 'Conversion Tracking',
					description:
						'Track conversion funnels and identify optimization opportunities.',
				},
				{
					icon: Calendar,
					title: 'Real-Time Dashboard',
					description:
						'Monitor your store performance with live data and customizable widgets.',
				},
				{
					icon: FileText,
					title: 'Custom Reports',
					description:
						'Create custom reports and export data for external analysis.',
				},
			],
		},
		{
			title: 'Marketing & SEO',
			id: 'marketing-seo',
			description:
				'Built-in marketing tools to drive traffic and increase conversions',
			features: [
				{
					icon: Megaphone,
					title: 'Email Marketing',
					description:
						'Built-in email campaigns with automation, segmentation, and templates.',
					highlight: true,
				},
				{
					icon: Search,
					title: 'SEO Optimization',
					description:
						'Built-in SEO tools with meta tags, sitemaps, and search engine optimization.',
				},
				{
					icon: MessageSquare,
					title: 'Social Media Integration',
					description:
						'Connect with Facebook, Instagram, Google, and other marketing channels.',
				},
				{
					icon: Bell,
					title: 'Abandoned Cart Recovery',
					description:
						'Automatically recover lost sales with targeted email sequences.',
				},
				{
					icon: Users,
					title: 'Customer Segmentation',
					description:
						'Create targeted campaigns based on customer behavior and preferences.',
				},
				{
					icon: Gift,
					title: 'Loyalty Programs',
					description:
						'Build customer loyalty with points, rewards, and referral programs.',
				},
			],
		},
		{
			title: 'Shipping & Fulfillment',
			id: 'shipping-fulfillment',
			description:
				'Flexible shipping options and automated fulfillment workflows',
			features: [
				{
					icon: Truck,
					title: 'Smart Shipping',
					description:
						'Real-time shipping rates from major carriers with label printing.',
					highlight: true,
				},
				{
					icon: Globe,
					title: 'International Shipping',
					description:
						'Ship worldwide with customs forms, duties calculation, and tracking.',
				},
				{
					icon: Package,
					title: 'Dropshipping Integration',
					description:
						'Connect with suppliers for automated order fulfillment.',
				},
				{
					icon: Workflow,
					title: 'Order Management',
					description:
						'Streamlined order processing with status tracking and notifications.',
				},
				{
					icon: Repeat,
					title: 'Return Management',
					description:
						'Automated return process with return labels and refund handling.',
				},
				{
					icon: Calendar,
					title: 'Delivery Scheduling',
					description:
						'Allow customers to schedule deliveries and set delivery preferences.',
				},
			],
		},
		{
			title: 'Customer Support & Communication',
			id: 'customer-support',
			description:
				'Tools to provide excellent customer service and build relationships',
			features: [
				{
					icon: MessageSquare,
					title: 'Live Chat',
					description:
						'Real-time customer support with chat widgets and automated responses.',
					highlight: true,
				},
				{
					icon: HeadphonesIcon,
					title: 'Help Desk',
					description:
						'Integrated ticketing system for customer support and issue tracking.',
				},
				{
					icon: Mail,
					title: 'Email Automation',
					description:
						'Automated emails for orders, shipping, and customer communication.',
				},
				{
					icon: Users,
					title: 'Customer Accounts',
					description:
						'Customer portals with order history, wishlists, and account management.',
				},
				{
					icon: Bell,
					title: 'Push Notifications',
					description:
						'Engage customers with web and mobile push notifications.',
				},
				{
					icon: Star,
					title: 'Feedback Collection',
					description:
						'Collect customer feedback with surveys and review requests.',
				},
			],
		},
		{
			title: 'Security & Performance',
			id: 'security-performance',

			description: 'Enterprise-grade security and performance optimization',
			features: [
				{
					icon: Shield,
					title: 'SSL Security',
					description:
						'Free SSL certificates with automatic renewal and security monitoring.',
					highlight: true,
				},
				{
					icon: Lock,
					title: 'Data Protection',
					description:
						'GDPR compliance with data encryption and privacy controls.',
				},
				{
					icon: Cloud,
					title: 'Cloud Hosting',
					description: '99.9% uptime with global CDN and automatic scaling.',
				},
				{
					icon: Zap,
					title: 'Performance Optimization',
					description:
						'Fast loading times with image optimization and caching.',
				},
				{
					icon: Database,
					title: 'Automatic Backups',
					description:
						'Daily automated backups with one-click restore functionality.',
				},
				{
					icon: Settings,
					title: 'Admin Controls',
					description:
						'Role-based access control with detailed permission management.',
				},
			],
		},
	];

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1">
				<section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-12 md:py-24 lg:py-32 w-full">
					<div className="mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 text-center">
							<div className="flex flex-col items-center space-y-2">
								<Badge className="bg-emerald-100 text-emerald-800">
									All Features
								</Badge>
								<h1 className="font-bold text-3xl sm:text-5xl xl:text-6xl/none tracking-tighter">
									Everything You Need to
									<span className="text-emerald-600"> Succeed Online</span>
								</h1>
								<p className="max-w-[900px] text-gray-500 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
									Discover all the powerful features that make CommerceFlow the
									complete ecommerce solution for businesses of all sizes. From
									store building to advanced analytics, we've got you covered.
								</p>
							</div>
							<div className="flex min-[400px]:flex-row flex-col gap-2">
								<Button
									size="lg"
									className="bg-emerald-600 hover:bg-emerald-700"
								>
									Start Free Trial
									<ArrowRight className="ml-2 w-4 h-4" />
								</Button>
								<Button variant="outline" size="lg">
									Schedule Demo
								</Button>
							</div>
						</div>
					</div>
				</section>

				{featureCategories.map((category, categoryIndex) => (
					<section
						id={category.id}
						key={categoryIndex}
						className={`w-full py-12 md:py-24 lg:py-32 ${
							categoryIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
						}`}
					>
						<div className="mx-auto px-4 md:px-6 container">
							<div className="flex flex-col justify-center items-center space-y-4 mb-12 text-center">
								<div className="space-y-2">
									<h2 className="font-bold text-3xl sm:text-4xl tracking-tighter">
										{category.title}
									</h2>
									<p className="max-w-[900px] text-gray-500 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
										{category.description}
									</p>
								</div>
							</div>
							<div className="gap-6 lg:gap-8 grid lg:grid-cols-3 mx-auto max-w-6xl">
								{category.features.map((feature, featureIndex) => (
									<Card
										key={featureIndex}
										className={`border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${
											feature.highlight
												? 'ring-2 ring-emerald-200 bg-emerald-50/50'
												: ''
										}`}
									>
										<CardHeader>
											<div className="flex items-center gap-3 mb-4">
												<div
													className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
														feature.highlight
															? 'bg-emerald-600 text-white'
															: 'bg-emerald-100 text-emerald-600'
													}`}
												>
													<feature.icon className="w-6 h-6" />
												</div>
												{feature.highlight && (
													<Badge className="bg-emerald-600 text-white">
														Popular
													</Badge>
												)}
											</div>
											<CardTitle className="text-xl">{feature.title}</CardTitle>
											<CardDescription className="text-base leading-relaxed">
												{feature.description}
											</CardDescription>
										</CardHeader>
									</Card>
								))}
							</div>
						</div>
					</section>
				))}

				<section className="bg-white py-12 md:py-24 lg:py-32 w-full">
					<div className="mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 mb-12 text-center">
							<div className="space-y-2">
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
								<table className="w-full border-collapse">
									<thead>
										<tr className="border-b">
											<th className="p-4 font-semibold text-left">Feature</th>
											<th className="p-4 font-semibold text-emerald-600 text-center">
												Rhombus X
											</th>
											<th className="p-4 font-semibold text-gray-500 text-center">
												Competitor A
											</th>
											<th className="p-4 font-semibold text-gray-500 text-center">
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
											<tr key={index} className="hover:bg-gray-50 border-b">
												<td className="p-4 font-medium">{feature}</td>
												<td className="p-4 text-center">
													{commerce ? (
														<Check className="mx-auto w-5 h-5 text-emerald-600" />
													) : (
														<span className="text-gray-400">—</span>
													)}
												</td>
												<td className="p-4 text-center">
													{compA ? (
														<Check className="mx-auto w-5 h-5 text-gray-400" />
													) : (
														<span className="text-gray-400">—</span>
													)}
												</td>
												<td className="p-4 text-center">
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

				<section className="bg-emerald-600 py-12 md:py-24 lg:py-32 w-full">
					<div className="mx-auto px-4 md:px-6 container">
						<div className="flex flex-col justify-center items-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="font-bold text-white text-3xl sm:text-5xl tracking-tighter">
									Ready to Get Started?
								</h2>
								<p className="max-w-[600px] text-emerald-100 lg:text-base/relaxed md:text-xl/relaxed xl:text-xl/relaxed">
									Join thousands of successful businesses using CommerceFlow.
									Start your free trial today and experience all these features
									yourself.
								</p>
							</div>
							<div className="flex min-[400px]:flex-row flex-col gap-2">
								<Button
									size="lg"
									className="bg-white hover:bg-gray-100 text-emerald-600"
								>
									Start Free Trial
									<ArrowRight className="ml-2 w-4 h-4" />
								</Button>
								<Button
									variant="outline"
									size="lg"
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
	);
}
