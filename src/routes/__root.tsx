import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { AppHeader } from '@/components/app-header';
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
		<div className="bg-red-500 text-[#1b1b18] dark:bg-[#0a0a0a]">
			<HeadContent />
			<AppHeader />

			<Outlet />

			<TanStackRouterDevtools />

			<TanStackQueryLayout />
		</div>
	);
}
