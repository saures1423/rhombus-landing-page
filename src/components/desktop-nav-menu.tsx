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
									className="bg-white hover:bg-transparent font-medium text-[13px] text-gray-700 hover:text-secondary dark:hover:text-white dark:text-gray-200 tracking-wide"
								>
									<Link to={item.href}>{item.label}</Link>
								</NavigationMenuLink>
							) : (
								<>
									<NavigationMenuTrigger className="bg-white hover:bg-transparent font-regular text-[13px] text-gray-700 hover:text-secondary dark:hover:text-white dark:text-gray-200 tracking-wide">
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
}: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link to={href}>
					<p className="text-muted-foreground text-sm line-clamp-2 leading-snug">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}
