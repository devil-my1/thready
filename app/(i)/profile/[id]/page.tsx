import ProfileHeader from "@/components/ProfileHeader"
import { getUserById } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants"
import Image from "next/image"
import ThreadyTab from "@/components/ThreadyTab"

const ProfilePage = async ({ params }: SearchParamProps) => {
	// const { id } = useParams<{ id: string }>()
	const { id } = await params

	const user = await currentUser()
	if (!user) redirect("/sign-in")

	const userInfo = await getUserById(id)

	if (!userInfo?.onboarded) redirect("/onboarding")

	return (
		<section>
			<ProfileHeader
				accountId={userInfo.clerkId}
				authUserId={user.id}
				name={userInfo.name}
				username={userInfo.username}
				image={userInfo.image}
				bio={userInfo.bio}
				createdAt={userInfo.createdAt}
			/>

			<div className='mt-9'>
				<Tabs
					defaultValue='threads'
					className='w-full'
				>
					<TabsList className='tab w-full'>
						{profileTabs.map(tab => (
							<TabsTrigger
								key={tab.label}
								value={tab.value}
								className='tab'
							>
								<Image
									src={tab.icon}
									alt='tab-icon'
									width={24}
									height={24}
									className='object-contain'
								/>
								<p className='max-sm:hidden'>{tab.label}</p>

								{tab.value === "threads" && userInfo?.threads.length > 0 && (
									<p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
										{userInfo?.threads.length}
									</p>
								)}
							</TabsTrigger>
						))}
					</TabsList>
					{profileTabs.map(tab => (
						<TabsContent
							key={`${tab.value}-content`}
							value={tab.value}
							className='w-full text-light-1'
						>
							{tab.value === "threads" && (
								<ThreadyTab
									currentUserId={user.id}
									accountId={userInfo.clerkId}
									accountType='User'
								/>
							)}
						</TabsContent>
					))}
				</Tabs>
			</div>
		</section>
	)
}

export default ProfilePage
