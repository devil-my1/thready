"use client"
import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { dark } from "@clerk/themes"
import useGetUser from "@/hooks/useGetUser"

const TopBar = () => {
	const { userData } = useGetUser()

	return (
		<nav className='topbar'>
			<Link
				href='/'
				className='flex items-center'
			>
				<Image
					src='/assets/logo-icon.png'
					alt='Logo'
					width={40}
					height={40}
				/>
				<p className='text-heading3-bold text-light-1 max-xs:hidden'>Thready</p>
			</Link>
			<div className='flex items-center gap-1'>
				<div className='block md:hidden'>
					<SignedIn>
						<SignOutButton>
							<div className='flex cursor-pointer'>
								<Image
									alt='logout'
									width={24}
									height={24}
									src='/assets/logout.svg'
								/>
							</div>
						</SignOutButton>
					</SignedIn>
				</div>

				<OrganizationSwitcher
					appearance={{
						baseTheme: dark,
						elements: {
							organizationSwitcherTrigger: "py-2 px-4",
							avatarImage:
								"https://k2far3z952.ufs.sh/f/lyA8G7ZwhP5faVUewx7Y6CPXLdUMpRJZlw2zoVkHWOhbmgSD"
						}
					}}
				/>
			</div>
		</nav>
	)
}

export default TopBar
