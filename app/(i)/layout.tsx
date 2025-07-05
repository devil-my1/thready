"use client"
import React from "react"
import BottomBar from "@/components/BottomBar"
import LeftSideBar from "@/components/LeftSideBar"
import RightSideBar from "@/components/RightSideBar"
import TopBar from "@/components/TopBar"
import { useAuth } from "@clerk/nextjs"
import { Loader } from "lucide-react"
export default function MainLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const { userId, isLoaded } = useAuth()

	if (!isLoaded) return <Loader />

	return (
		<>
			<TopBar />
			<main className='flex'>
				<LeftSideBar currentUserId={userId!!} />
				<section className='main-container'>
					<div className='w-full max-w-4xl'>{children}</div>
				</section>
				<RightSideBar />
			</main>
			<BottomBar />
		</>
	)
}
