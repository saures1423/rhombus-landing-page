import { ListItem } from './desktop-nav-menu';

type FeatureItemProps = {
	icon: React.ReactNode;
	title: string;
	description: string;
	href: string;
};

export function MenuFeatureItem({
	icon,
	title,
	description,
	href,
}: FeatureItemProps) {
	return (
		<ListItem href={href}>
			<div className="flex items-start gap-3 p-3 rounded-lg transition-colors">
				<div className="flex flex-shrink-0 justify-center items-center bg-emerald-100 rounded-lg w-10 h-10">
					{icon}
				</div>
				<div>
					<h4 className="mb-1 font-semibold text-gray-900 text-sm">{title}</h4>
					<p className="text-gray-500 text-sm">{description}</p>
				</div>
			</div>
		</ListItem>
	);
}
