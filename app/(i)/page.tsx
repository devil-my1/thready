import Loader from "@/components/Loader"
import ThreadyCard from "@/components/ThreadyCard"
import { getAllThreads } from "@/lib/actions/thready.actions"
import { currentUser } from "@clerk/nextjs/server"

const HomePage = async () => {
	const user = await currentUser()
	const result = await getAllThreads()

	if (!user) return <Loader />

	return (
		<>
			<h1 className='head-text text-left'>Home</h1>

			<section className='mt-9 flex flex-col gap-10'>
				{result?.threads && result.threads.length > 0 ? (
					<>
						{result.threads.map(thread => (
							<ThreadyCard
								key={thread?._id as string}
								id={thread?._id as string}
								parrentId={thread.parentId!! || null}
								author={thread.author}
								currentUser={user?.id}
								comments={thread.children}
								text={thread.text}
								community={null}
								createdAt={thread.createdAt!}
							/>
						))}
					</>
				) : (
					<p>No thready found.</p>
				)}

				{result?.isNext && <button className='load-more'>Load More</button>}
			</section>
		</>
	)
}

export default HomePage
