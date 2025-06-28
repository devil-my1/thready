import BottomBar from "@/components/BottomBar"
import LeftSideBar from "@/components/LeftSideBar"
import MobileNav from "@/components/MobileNav"
import RightSideBar from "@/components/RightSideBar"
import TopBar from "@/components/TopBar"

export default function MainLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<main className='root'>
			<TopBar />

			<main className='root-container'>
				<LeftSideBar />
				<section className='main-container'>
					<div className='w-full max-w-4xl'>{children}</div>
				</section>
				<RightSideBar />
			</main>
			<BottomBar />
		</main>
	)
}
