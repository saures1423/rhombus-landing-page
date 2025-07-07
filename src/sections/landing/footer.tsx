// import { ArrowRight, FileUp } from 'lucide-react';

import { Link } from '@tanstack/react-router';
import { Printer } from 'lucide-react';

export default function FooterSection() {
	return (
		<footer className="mx-auto mt-10 border-t w-full container">
			<div className="px-4 md:px-0 py-8 md:py-12">
				<div className="gap-8 grid grid-cols-1 md:grid-cols-4">
					<div>
						<div className="flex items-center gap-2 mb-4">
							<Printer className="w-5 h-5" />
							<span className="font-bold text-lg">Logo here</span>
						</div>
						<p className="mb-4 text-muted-foreground text-sm">
							Your one-stop shop for all printing needs. Quality printing
							services since 2025.
						</p>
					</div>
					<div>
						<h3 className="mb-4 font-semibold">Products</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									to="/"
									className="text-muted-foreground hover:text-primary"
								>
									Business Cards
								</Link>
							</li>
							<li>
								<Link
									to="/"
									className="text-muted-foreground hover:text-primary"
								>
									Flyers & Brochures
								</Link>
							</li>
							<li>
								<Link
									to="/"
									className="text-muted-foreground hover:text-primary"
								>
									Posters
								</Link>
							</li>
							<li>
								<Link
									to="/"
									className="text-muted-foreground hover:text-primary"
								>
									Banners
								</Link>
							</li>
							<li>
								<Link
									to="/"
									className="text-muted-foreground hover:text-primary"
								>
									Stationery
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="mb-4 font-semibold">Services</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									to="/"
									className="text-muted-foreground hover:text-primary"
								>
									Design Services
								</Link>
							</li>
							<li>
								<Link
									to="/"
									className="text-muted-foreground hover:text-primary"
								>
									Bulk Printing
								</Link>
							</li>
							<li>
								<Link
									to="/"
									className="text-muted-foreground hover:text-primary"
								>
									Rush Orders
								</Link>
							</li>
							<li>
								<Link
									to="/"
									className="text-muted-foreground hover:text-primary"
								>
									Custom Projects
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="mb-4 font-semibold">Contact</h3>
						<address className="space-y-2 text-muted-foreground text-sm not-italic">
							<p>123 Print Avenue</p>
							<p>New York, NY 10001</p>
							<p className="pt-2">Email: info@sampleni.com</p>
							<p>Phone: (555) 123-4567</p>
						</address>
					</div>
				</div>
				<div className="flex md:flex-row flex-col justify-between items-center gap-4 mt-8 pt-8 border-t">
					<p className="text-muted-foreground text-sm">
						© 2025 Rhombus Ecommerce. All rights reserved.
					</p>
					<div className="flex gap-4">
						<Link
							to="/"
							className="text-muted-foreground hover:text-primary text-sm"
						>
							Terms
						</Link>
						<Link
							to="/"
							className="text-muted-foreground hover:text-primary text-sm"
						>
							Privacy
						</Link>
						<Link
							to="/"
							className="text-muted-foreground hover:text-primary text-sm"
						>
							FAQ
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
