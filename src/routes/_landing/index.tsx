import {
	CTASection,
	FeatureSection,
	HeroSection,
	PricingSection,
	TestimonialSection,
} from '@/sections/landing';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_landing/')({
	component: App,
});

function App() {
	return (
		<>
			<HeroSection />
			<FeatureSection />
			<TestimonialSection />
			<CTASection />
			<PricingSection />
		</>
	);
}
