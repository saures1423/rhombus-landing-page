// import AppFooter from '@/components/app-footer';
// import { AppHeader } from '@/components/app-header';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_landing')({
	component: LandingLayout,
});

function LandingLayout() {
	return (
		<div className="bg-white min-h-screen">
			{/* Landing Header */}
			{/* <AppHeader /> */}

			{/* Main Content */}
			<main className="flex-1">
				<Outlet />
			</main>

			{/* Landing Footer */}
			{/* <AppFooter /> */}
		</div>
	);
}
