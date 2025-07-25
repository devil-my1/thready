import { redirect } from "next/navigation"

import { getUserById } from "@/lib/actions/user.actions"
import AccountProfile from "@/components/AccountProfile"
import { currentUser } from "@clerk/nextjs/server"

// Copy paste most of the code as it is from the /onboarding

async function Page() {
	const user = await currentUser()
	if (!user) return null

	const userInfo = await getUserById(user.id)
	if (!userInfo?.onboarded) redirect("/onboarding")

	const userData = {
		clerkId: user.id,
		objectId: userInfo?._id,
		username: userInfo ? userInfo?.username : (user.username ?? ""),
		name: userInfo ? userInfo?.name : (user.firstName ?? ""),
		bio: userInfo ? userInfo?.bio : "",
		image: userInfo ? userInfo?.image : user.imageUrl
	}

	return (
		<>
			<h1 className='head-text'>Edit Profile</h1>
			<p className='mt-3 text-base-regular text-light-2'>Make any changes</p>

			<section className='mt-12'>
				<AccountProfile
					user={userData}
					btnTitle='Continue'
				/>
			</section>
		</>
	)
}

export default Page
