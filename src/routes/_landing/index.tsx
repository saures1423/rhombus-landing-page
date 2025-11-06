// import {
// 	CTASection,
// 	FeatureSection,
// 	HeroSection,
// 	PricingSection,
// 	TestimonialSection,
// } from '@/sections/landing';
import Games from '@/sections/landing/games';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_landing/')({
	component: App,
});

function App() {
	return (
		<>
			<Games />
			{/* <HeroSection />
			<FeatureSection />
			<TestimonialSection />
			<CTASection />
			<PricingSection /> */}
		</>
	);
}
