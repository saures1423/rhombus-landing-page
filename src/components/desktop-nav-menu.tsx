import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

interface NavItem {
    label: string;
    href: string;
    content: string;
}

export function DesktopNavMenu({ items }: { items: NavItem[] }) {
    return (
        <div className="hidden grow justify-center lg:flex">
            <NavigationMenu viewport={false}>
                <NavigationMenuList>
                    {items.map((item) => (
                        <NavigationMenuItem key={item.label}>
                            <NavigationMenuTrigger className="font-regular bg-transparent text-xs tracking-wide text-gray-500 hover:text-secondary dark:text-gray-200 dark:hover:text-white">
                                {item.label}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-amber-400">
                                <NavigationMenuLink href={item.href}>{item.content}</NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}
