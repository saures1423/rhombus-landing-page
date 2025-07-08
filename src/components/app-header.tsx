import useOffSetTop from '@/hooks/use-off-set-top';

import {
	ArrowRight,
	BarChart3,
	Building2,
	CreditCard,
	Package,
	Palette,
	Shirt,
	Store,
	Users,
	Utensils,
	Zap,
} from 'lucide-react';
import { DesktopNavMenu, ListItem } from './desktop-nav-menu';
import { HeaderButtons } from './header-buttons';
import { Logo } from './logo';
import { MenuFeatureItem } from './menu-item';
import { ScrollingBanner } from './scrolling-banner';

const mainNavItems = [
	{
		label: 'SOLUTIONS',
		href: '#',
		content: SolutionContent(),
	},
	{
		label: 'FEATURES',
		href: '#',
		content: FeaturesContent(),
	},
	{
		label: 'PRICING',
		href: '/pricing',
		content: null,
	},
];

export function AppHeader() {
	const isoffset = useOffSetTop(40);

	return (
		<header
			className={`top-0 w-full z-50 bg-white ${
				isoffset ? 'sticky shadow-lg backdrop-blur ' : 'relative'
			}`}
		>
			<div className="border-gray-200 dark:border-gray-800 border-b w-full">
				<div
					className={`transition-all duration-300 ease-in-out ${
						isoffset
							? 'pointer-events-none max-h-0 opacity-0'
							: 'max-h-16 opacity-100'
					} overflow-hidden`}
					style={{
						transitionProperty: 'max-height, opacity',
					}}
				>
					<ScrollingBanner />
				</div>

				<nav
					className="flex justify-between items-center gap-4 xl:mx-auto md:px-5 md:py-4 xl:container"
					aria-label="navigation"
				>
					<div className="flex sm:flex-row flex-wrap justify-between items-center gap-y-5 p-4 lg:p-2 w-full">
						<Logo />

						<div className="flex justify-center items-center gap-x-6">
							<DesktopNavMenu items={mainNavItems} />

							<HeaderButtons />
						</div>
					</div>
				</nav>
			</div>
		</header>
	);
}

function FeaturesContent() {
	return (
		<div className="flex flex-col p-2 w-80">
			<div className="space-y-3">
				<MenuFeatureItem
					icon={<Zap className="w-5 h-5 text-emerald-600" />}
					title="Store Builder"
					description="Drag-and-drop builder with professional templates"
					href="/features?pageIndex=0"
				/>
				<MenuFeatureItem
					icon={<CreditCard className="w-5 h-5 text-emerald-600" />}
					title="Payment Processing"
					description="Accept 100+ payment methods securely"
					href="/features?pageIndex=1"
				/>
				<MenuFeatureItem
					icon={<Package className="w-5 h-5 text-emerald-600" />}
					title="Inventory Management"
					description="Manage stock levels and suppliers easily"
					href="/features?pageIndex=2"
				/>
				<MenuFeatureItem
					icon={<BarChart3 className="w-5 h-5 text-emerald-600" />}
					title="Analytics & Reports"
					description="Track performance with detailed insights"
					href="/features?pageIndex=3"
				/>
			</div>

			<div className="mt-4 px-2 pt-4 border-t">
				<ListItem href="/features">
					<div className="flex justify-between items-center font-medium text-emerald-600 hover:text-emerald-700 text-sm transition-colors">
						View all features
						<ArrowRight className="w-4 h-4" />
					</div>
				</ListItem>
			</div>
		</div>
	);
}

function SolutionContent() {
	return (
		<div className="flex flex-col p-2 w-[40rem]">
			<ul className="flex space-y-6">
				<li>
					<h4 className="mb-3 font-semibold text-gray-900">By Business Type</h4>
					<ul className="space-y-3">
						<MenuFeatureItem
							icon={<Store className="w-4 h-4 text-emerald-600" />}
							title="Small Business"
							description="Perfect for startups and growing businesses"
							href="/"
						/>
						<MenuFeatureItem
							icon={<Building2 className="w-4 h-4 text-emerald-600" />}
							title="Enterprise"
							description="Scalable solutions for large organizations"
							href="/"
						/>
						<MenuFeatureItem
							icon={<Users className="w-4 h-4 text-emerald-600" />}
							title="Multi-vendor"
							description="Marketplace solutions for multiple sellers"
							href="/"
						/>
					</ul>
				</li>

				<li>
					<h4 className="mb-3 font-semibold text-gray-900">By Industry</h4>
					<ul className="space-y-3">
						<MenuFeatureItem
							icon={<Shirt className="w-4 h-4 text-emerald-600" />}
							title="Fashion & Apparel"
							description="Specialized tools for clothing brands"
							href="/"
						/>
						<MenuFeatureItem
							icon={<Utensils className="w-4 h-4 text-emerald-600" />}
							title="Food & Beverage"
							description="Solutions for restaurants and food delivery"
							href="/"
						/>
						<MenuFeatureItem
							icon={<Palette className="w-4 h-4 text-emerald-600" />}
							title="Art & Crafts"
							description="Perfect for creative entrepreneurs"
							href="/"
						/>
					</ul>
				</li>
			</ul>
		</div>
	);
}
