import PostThready from "@/components/PostThready"
import { getUserById } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import React from "react"

const CreateThreadPage = async () => {
	const user = await currentUser()
	if (!user) redirect("/sign-in")

	const userInfo = await getUserById(user.id)

	if (!userInfo?.onboarded) redirect("/onboarding")

	return (
		<>
			<h1 className='head-text'>Create Thready</h1>
			<PostThready userId={userInfo._id as unknown as string} />
		</>
	)
}

export default CreateThreadPage
