import { SignIn } from "@clerk/nextjs"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Sign-In"
}

export default function SiginInPage() {
	return (
		<main className='flex h-screen w-full items-center justify-center'>
			<SignIn signInUrl='/' />
		</main>
	)
}
