import AccountProfile from "@/components/AccountProfile"
import { getUserById } from "@/lib/actions/user.actions"
import { IUser } from "@/types/mongo"
import { currentUser } from "@clerk/nextjs/server"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
	title: "Onboarding",
	description: "Complete your onboarding process"
}
export default async function OnboardingPage() {
	const user = await currentUser()

	if (!user) {
		return (
			<main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
				<h1 className='text-base-regular mt-3 text-light-2'>Onboarding</h1>
				<p className='text-lg mb-8'>
					Please log in to complete your onboarding process.
				</p>
			</main>
		)
	}

	const userInfo: IUser | null | undefined = await getUserById(user.id)

	if (userInfo?.onboarded) {
		redirect("/")
	}

	const userData: User = {
		_id: userInfo?._id,
		clerkId: user.id,
		username: user?.username || userInfo?.username,
		name: userInfo?.name || user?.firstName || "",
		bio: userInfo?.bio || "",
		image: userInfo?.image || user?.imageUrl
	}

	return (
		<main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
			<h1 className='text-base-regular mt-3 text-light-2'>Onboarding</h1>
			<p className='text-lg mb-8'>
				Please complete your onboarding process now to use Thready.
			</p>
			<section className='mt-9 bg-dark-2 p-10'>
				<AccountProfile
					user={userData}
					btnTitle='Continue'
				/>
			</section>
		</main>
	)
}
