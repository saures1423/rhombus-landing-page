import { Search, ShoppingCart, User } from 'lucide-react';
import { Input } from './ui/input';

export function HeaderButtons() {
	return (
		<div className="flex flex-1 items-center justify-end space-x-2 md:space-x-6">
			<div className="relative">
				<Input
					type="search"
					placeholder="SEARCH"
					className="h-8 w-50 border-gray-300 text-xs placeholder:text-xs placeholder:tracking-wider placeholder:text-gray-500 focus:border-gray-500"
				/>
				<Search className="absolute top-1/2 right-2 h-3 w-3 -translate-y-1/2 transform text-gray-400" />
			</div>
			<User className="h-5 w-5 cursor-pointer text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white" />
			<div className="relative">
				<ShoppingCart className="h-5 w-5 cursor-pointer text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white" />
				<span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-800 text-xs text-white">
					1
				</span>
			</div>
		</div>
	);
}
