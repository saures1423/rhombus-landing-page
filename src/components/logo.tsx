import { Link } from '@tanstack/react-router';
import { Printer } from 'lucide-react';

function LogoIconText() {
	return (
		<>
			<Printer className="h-6 w-6 text-secondary" />
			<span className="text-xl font-bold text-secondary">Logo Here</span>
		</>
	);
}

export function Logo() {
	return (
		<div className="flex-shrink-0">
			<Link to="/" className="flex items-center gap-2">
				<LogoIconText />
			</Link>
		</div>
	);
}
