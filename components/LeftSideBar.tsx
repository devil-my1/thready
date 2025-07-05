"use client"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import { SignedIn, SignOutButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const LeftSideBar = ({ currentUserId }: { currentUserId: string | null }) => {
	const pathname = usePathname()

	return (
		<section className='custom-scrollbar leftsidebar'>
			<div className='flex w-full flex-1 flex-col gap-6 px-6'>
				{sidebarLinks.map(link => {
					const isActive =
						(pathname.includes(link.route) && link.route.length > 1) ||
						pathname === link.route ||
						pathname.startsWith(link.route + "/")

					if (link.route === "/profile")
						link.route = `/profile/${currentUserId}`

					return (
						<Link
							key={link.label}
							href={link.route}
							className={cn("leftsidebar_link", {
								"bg-[#fa5a7c]": isActive,
								"hover:bg-gray-700 ": !isActive
							})}
						>
							<Image
								src={link.imgURL}
								alt={link.label}
								width={24}
								height={24}
							/>

							<p className='text-light-1 max-lg:hidden'>{link.label}</p>
						</Link>
					)
				})}
			</div>
			<div className='mt-10 px-6'>
				<SignedIn>
					<SignOutButton
						signOutOptions={{
							redirectUrl: "/sign-in"
						}}
					>
						<div className='flex cursor-pointer gap-4 p-4'>
							<Image
								alt='logout'
								width={24}
								height={24}
								src='/assets/logout.svg'
							/>
							<p className='text-light-1 max-lg:hidden'>Logout</p>
						</div>
					</SignOutButton>
				</SignedIn>
			</div>
		</section>
	)
}

export default LeftSideBar
