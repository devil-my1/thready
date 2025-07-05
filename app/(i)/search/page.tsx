import UserCard from "@/components/UserCard"
import { getAllUsers, getUserById } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import React from "react"

const SearchPage = async () => {
	const user = await currentUser()
	if (!user) redirect("/sign-in")

	const userInfo = await getUserById(user.id)

	const result = await getAllUsers({
		userId: user.id,
		searchTerm: "",
		pageNumber: 1,
		pageSize: 20,
		sortBy: "desc"
	})

	if (!userInfo?.onboarded) redirect("/onboarding")
	return (
		<section>
			<h1 className='head-text'>Search</h1>

			<div className='flex mt-14 flex-col gap-9'>
				{result?.users.length === 0 ? (
					<p className='no-result'>No users</p>
				) : (
					<>
						{result?.users.map(user => (
							<UserCard
								key={user.clerkId}
								id={user.clerkId}
								name={user.name}
								username={user.username}
								imgUrl={user.image}
								personType='User'
							/>
						))}
					</>
				)}
			</div>
		</section>
	)
}

export default SearchPage
