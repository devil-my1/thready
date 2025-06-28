import {
	OrganizationSwitcher,
	SignedIn,
	SignIn,
	SignOutButton
} from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const TopBar = () => {
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
						<div className='flex cursor-pointer'>
							<Image
								alt='logout'
								width={24}
								height={24}
								src='/assets/logout.svg'
							/>
							<SignOutButton />
						</div>
					</SignedIn>
				</div>

				<OrganizationSwitcher
					appearance={{
						variables: {
							colorText: "#fff",
							colorPrimary: "#624cf5",
							colorBackground: "#1C1F2E",
							colorInputBackground: "#252A41",
							colorInputText: "#fff"
						},
						elements: {
							organizationSwitcherTrigger: "py-2 px-4"
						}
					}}
				/>
			</div>
		</nav>
	)
}

export default TopBar
