"use client"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const BottomBar = () => {
	const pathname = usePathname()
	return (
		<section className='bottombar'>
			<div className='bottombar_container'>
				{sidebarLinks.map(link => {
					const isActive =
						(pathname.includes(link.route) && link.route.length > 1) ||
						pathname === link.route ||
						pathname.startsWith(link.route + "/")
					return (
						<Link
							key={link.label}
							href={link.route}
							className={cn("bottombar_link", {
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
							<p className='text-light-1 text-subtle-medium max-sm:hidden'>
								{link.label.split(/\s+/)[0]}
							</p>
						</Link>
					)
				})}
			</div>
		</section>
	)
}

export default BottomBar
