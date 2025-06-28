"use client"

import Loader from "@/components/Loader"
import { navLinks } from "@/constants"
import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/clerk-react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"

const HomePage = () => {
	const { user, isLoaded } = useUser()
	const pathname = usePathname()

	return !isLoaded ? (
		<Loader />
	) : (
		<div className='flex flex-row items-center justify-center min-h-screen'>
			<aside className='min-h-screen flex flex-col w-[240px] bg-gray-800 text-white p-4'>
				<ul className='flex flex-col items-start justify-center flex-1'>
					{navLinks.map(link => {
						const isActive =
							pathname === link.route || pathname.startsWith(link.route + "/")
						return (
							<li
								className={cn("mb-4 w-full rounded", {
									"bg-[#fa5a7c]": isActive
								})}
								key={link.label}
							>
								<Link
									key={link.label}
									href={link.route}
									className={cn(
										"flex items-center gap-2 p-2 rounded transition-colors",
										{
											"hover:bg-gray-700 ": !isActive
										}
									)}
								>
									{link.label}
								</Link>
							</li>
						)
					})}
				</ul>
				<div className='mt-auto'>
					<UserButton
						appearance={{
							variables: {
								colorText: "#fff",
								colorPrimary: "#624cf5",
								colorBackground: "#1C1F2E",
								colorInputBackground: "#252A41",
								colorInputText: "#fff"
							}
						}}
					/>
				</div>
			</aside>
			<div className='flex flex-1 flex-col items-center justify-center'>
				<h1 className='text-heading1-bold'>
					Welcome to the Home,{" "}
					<span className='text-[#fa5a7c] font-bold text-[40px] uppercase'>
						{user?.username}
					</span>
					!
				</h1>
				<p>This is the main content of the home page.</p>
			</div>
		</div>
	)
}

export default HomePage
