import { Link } from '@tanstack/react-router';
import { Printer } from 'lucide-react';

function LogoIconText() {
	return (
		<>
			<Printer className="w-6 h-6 text-secondary" />
			<span className="font-bold text-secondary text-xl">Rhombus X</span>
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
