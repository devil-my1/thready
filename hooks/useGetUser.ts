import { getUserById } from "@/lib/actions/user.actions"
import { useUser } from "@clerk/nextjs"
import React, { useState } from "react"

const useGetUser = () => {
	const { isLoaded, user } = useUser()
	const [userData, setUserData] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	React.useEffect(() => {
		const fetchUserData = async () => {
			if (!user) {
				setIsLoading(false)
				return
			}

			const userInfo = await getUserById(user.id)

			if (!userInfo) {
				setIsLoading(false)
				return
			}

			setUserData({
				_id: userInfo._id,
				clerkId: user.id,
				username: user.username || userInfo.username,
				name: userInfo.name || user.firstName || "",
				bio: userInfo.bio || "",
				image: userInfo.image || user.imageUrl
			} as User)
			setIsLoading(false)
		}

		if (isLoaded) {
			fetchUserData()
		}
	}, [user, isLoaded])

	return { userData, isLoading, error }
}

export default useGetUser
