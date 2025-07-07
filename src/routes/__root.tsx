import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { AppHeader } from '@/components/app-header';
import { FooterSection } from '@/sections/landing';
import type { QueryClient } from '@tanstack/react-query';
import { HeadContent } from '@tanstack/react-router';
import TanStackQueryLayout from '../integrations/tanstack-query/layout';

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Root,
});

function Root() {
	return (
		<div className="flex-1">
			<HeadContent />
			<AppHeader />
			<Outlet />
			<FooterSection />

			<TanStackRouterDevtools />
			<TanStackQueryLayout />
		</div>
	);
}
