import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Link } from '@tanstack/react-router';

interface NavItem {
	label: string;
	href: string;
	content: React.ReactNode;
}

export function DesktopNavMenu({ items }: { items: NavItem[] }) {
	return (
		<div className="hidden lg:flex justify-center grow">
			<NavigationMenu viewport={false}>
				<NavigationMenuList>
					{items.map((item) => (
						<NavigationMenuItem key={item.label}>
							{!item.content ? (
								<NavigationMenuLink
									asChild
									className="bg-white hover:bg-transparent font-medium text-gray-700 hover:text-secondary dark:hover:text-white dark:text-gray-200 text-sm tracking-wide"
								>
									<Link
										to={item.href}
										activeProps={{ className: 'text-emerald-600 font-bold' }}
										activeOptions={{ exact: true }}
									>
										{item.label}
									</Link>
								</NavigationMenuLink>
							) : (
								<>
									<NavigationMenuTrigger className="bg-white hover:bg-transparent font-regular text-gray-700 hover:text-secondary dark:hover:text-white dark:text-gray-200 text-sm tracking-wide">
										{item.label}
									</NavigationMenuTrigger>
									<NavigationMenuContent className="top-full left-0 z-50 absolute">
										{item.content}
									</NavigationMenuContent>
								</>
							)}
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}

export function ListItem({
	children,
	href,
	...props
}: React.ComponentPropsWithoutRef<'li'> & {
	href: string;
	linkProps?: object;
}) {
	return (
		<ul>
			<li {...props}>
				<NavigationMenuLink asChild>
					<Link
						to={href}
						activeProps={{ className: 'text-emerald-600 font-bold' }}
						activeOptions={{ exact: true }}
					>
						{children}
					</Link>
				</NavigationMenuLink>
			</li>
		</ul>
	);
}
