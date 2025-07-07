const messages = [
	'Free US shipping on all orders over',
	'20% off on your first purchase',
	'New arrivals every week',
	'Exclusive deals for newsletter subscribers',
];

export function ScrollingBanner() {
	return (
		<div className="relative w-full overflow-hidden bg-[#20798E] py-2 text-white">
			<div className="animate-scroll flex whitespace-nowrap">
				<div className="flex items-center">
					{messages.map((message, index) => (
						<span
							key={`first-${index}`}
							className="px-4 text-[.60rem] font-medium md:px-8 md:text-xs"
						>
							<span className="mx-2 md:mx-4">•</span>
							{message}
						</span>
					))}
				</div>
				<div className="flex items-center">
					{messages.map((message, index) => (
						<span
							key={`second-${index}`}
							className="px-4 text-[.60rem] font-medium md:px-8 md:text-xs"
						>
							<span className="mx-2 md:mx-4">•</span>
							{message}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
