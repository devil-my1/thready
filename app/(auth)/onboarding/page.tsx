import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Onboarding",
	description: "Complete your onboarding process"
}
export default async function OnboardingPage() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<h1 className='text-3xl font-bold mb-4'>Welcome to Onboarding</h1>
			<p className='text-lg mb-8'>Please complete your onboarding process.</p>
			{/* Add your onboarding form or components here */}
		</div>
	)
}
