declare interface User {
	_id?: string
	clerkId: string
	username?: string
	name?: string
	bio?: string
	image?: string
}
declare interface AccountProfileProps {
	user: User
	btnTitle: string
}

declare interface SearchParamProps {
	params: {
		id: string
	}
	searchParams: { [key: string]: string | string[] | undefined }
}

declare interface ThreadyCreateParams {
	text: string
	author: ObjectId
	communityId?: string | null
}

interface ThreadyCardProps {
	id: string
	author: {
		_id?: string
		clerkId: string
		name: string
		image?: string
	}
	currentUser: string
	community: {
		_id: string
		id: string
		name: string
		image?: string
	} | null
	text: string
	createdAt: Date
	parrentId: string | null
	likes?: string[]
	likesCount?: number
	comments:
		| {
				_id: string
				author: {
					_id: string
					name: string
					image?: string
				}
		  }[]
		| null
	isComment?: boolean
	showActions?: boolean
}

declare interface CommentProps {
	parrentThreadId: string
	currentUserImg: string | undefined
	currentUserId: string
}

declare interface ProfileHeaderProps {
	accountId: string
	authUserId: string
	name: string
	username: string
	image: string
	bio: string
	type: "User" | "Community"
	createdAt: Date
}

declare interface GetAllUsersParams {
	userId: string
	searchTerm?: string
	pageNumber?: number
	pageSize?: number
	sortBy?: "asc" | "desc" | -1 | 1 | "ascending" | "descending"
}

interface UserCardProps {
	id: string
	name: string
	username: string
	imgUrl: string
	personType: "User" | "Community"
}
