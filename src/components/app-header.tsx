import useOffSetTop from '@/hooks/use-off-set-top';
import { useResponsive } from '@/hooks/use-responsive';
import { DesktopNavMenu } from './desktop-nav-menu';
import { HeaderButtons } from './header-buttons';
import { Logo } from './logo';
import { ScrollingBanner } from './scrolling-banner';

const mainNavItems = [
	{ label: 'BUSINESS CARDS', href: '#', content: 'BUSINESS CARDS' },
	{
		label: 'PRINT ADVERTISING AND OFFICE',
		href: '#',
		content: 'PRINT ADVERTISING AND OFFICE',
	},
	{
		label: 'SIGNS, BANNERS AND POSTERS',
		href: '#',
		content: 'SIGNS, BANNERS AND POSTERS',
	},
];

export function AppHeader() {
	const isMdUp = useResponsive('up', 'xl');

	const isoffset = useOffSetTop(40);

	return (
		<header
			className={`top-0 z-50 w-full overflow-hidden ${
				isoffset
					? 'sticky bg-white/90 shadow-lg backdrop-blur dark:bg-gray-900/90'
					: 'relative bg-white dark:bg-gray-900'
			}`}
		>
			<div className="w-full border-b border-gray-200 dark:border-gray-800">
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
					className="flex items-center justify-between gap-4 py-4 xl:container xl:mx-auto"
					aria-label="Main navigation"
				>
					<div className="flex w-full flex-wrap items-center justify-between gap-y-5 p-4 sm:flex-row lg:p-2">
						<Logo />

						{!isMdUp && <HeaderButtons />}

						<DesktopNavMenu items={mainNavItems} />

						{isMdUp && <HeaderButtons />}
					</div>
				</nav>
			</div>
		</header>
	);
}
