import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';

export function HeaderButtons() {
	return (
		<div className="flex flex-1 justify-end items-center space-x-2">
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					className="text-gray-700 cursor-pointer"
					asChild
				>
					<Link to="/auth/signin">Sign In</Link>
				</Button>
				<Button
					size="sm"
					className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
				>
					Start Free Trial
				</Button>
			</div>
		</div>
	);
}
