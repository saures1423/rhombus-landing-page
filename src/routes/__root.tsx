import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import type { QueryClient } from '@tanstack/react-query';
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
			<Outlet />

			<TanStackRouterDevtools />
			<TanStackQueryLayout />
		</div>
	);
}
