import { Document, Types } from "mongoose"

// Base User interface matching the MongoDB schema
declare interface IUser extends Document {
	_id: Types.ObjectId
	clerkId: string
	name: string
	username: string
	bio: string
	image: string
	threads: Types.ObjectId[]
	onboarded: boolean
	communities: Types.ObjectId[]
	createdAt: Date
	updatedAt: Date
}

// Base Thready interface matching the MongoDB schema
declare interface IThready extends Document {
	_id: Types.ObjectId
	parentId?: string
	text: string
	author: Types.ObjectId
	communityId?: Types.ObjectId | null
	children: Types.ObjectId[]
	createdAt: Date
}

// Interface for creating a new thread
declare interface ICreateThready {
	parentId?: string
	text: string
	author: string | Types.ObjectId
	communityId?: string | null
}

// Interface for creating a comment
declare interface ICommentCreateParams {
	parrentThreadID: string
	author: string
	text: string
}

// Populated user data for thread responses
declare interface IPopulatedUser {
	_id: string
	clerkId: string
	name: string
	image: string
}

// Populated thread with nested children (for getThreadById)
declare interface IGetThreadByIdResult {
	_id: string
	text: string
	author: IPopulatedUser
	communityId?: string | null
	parentId?: string
	children: IPopulatedThreadChild[]
	createdAt: Date
}

// Child thread with populated author (for nested comments)
declare interface IPopulatedThreadChild {
	_id: string
	text: string
	author: IPopulatedUser
	parentId?: string
	children: IPopulatedThreadGrandChild[]
	createdAt: Date
}

// Grand child thread (nested comments)
declare interface IPopulatedThreadGrandChild {
	_id: string
	text: string
	author: IPopulatedUser
	parentId?: string
	createdAt: Date
}

// Populated thread for general listing (like getAllThreads)
declare interface IPopulatedThread {
	_id: string
	text: string
	author: IPopulatedUser
	communityId?: string | null
	parentId?: string
	children: {
		_id: string
		author: Pick<IPopulatedUser, "image">
	}[]
	createdAt: Date
}

// Response interface for getAllThreads
declare interface AllThreadsParams {
	threads: IPopulatedThread[]
	isNext: boolean
}

// Thread parameters for creation (used in actions)
declare interface ThreadyCreateParams {
	text: string
	author: string
	communityId?: string | null
}

// User update parameters
declare interface IUpdateUserParams {
	clerkId: string
	name: string
	username: string
	bio?: string
	image?: string
	onboarded?: boolean
}

// Populated user for profile pages
declare interface IPopulatedUserProfile extends IPopulatedUser {
	username: string
	bio: string
	threads: IPopulatedThread[]
	communities: string[]
	onboarded: boolean
	createdAt: Date
	updatedAt: Date
}

// Utility types for better type safety
declare type ThreadId = string
declare type UserId = string
declare type CommunityId = string

// Activity/notification related types
declare interface IActivity {
	_id: string
	user: UserId
	type: "like" | "comment" | "follow" | "mention"
	thread?: ThreadId
	createdAt: Date
}

// Activity reply interface (for getActivity function)
declare interface IActivityReply {
	_id: string
	text: string
	parentId?: string
	author: IPopulatedUser
	communityId?: string | null
	children: string[]
	createdAt: Date
}

// Search results type
declare interface ISearchResult {
	users: IPopulatedUser[]
	threads: IPopulatedThread[]
	communities: IPopulatedCommunity[]
}

// Thread statistics
declare interface IThreadStats {
	totalThreads: number
	totalComments: number
	totalLikes: number
}

// Base Community interface matching the MongoDB schema
declare interface ICommunity extends Document {
	_id: Types.ObjectId
	id: string
	username: string
	name: string
	bio: string
	image: string
	threads: Types.ObjectId[]
	createdBy: string
	members: Types.ObjectId[]
	createdAt: Date
	updatedAt: Date
}

// Interface for creating a new community
declare interface ICreateCommunityParams {
	id: string
	name: string
	username: string
	image: string
	bio: string
	createdById: string
}

// Populated community with member details (for fetchCommunityDetails)
declare interface IPopulatedCommunity {
	_id: string
	id: string
	username: string
	name: string
	bio: string
	image: string
	createdBy: IPopulatedUser
	members: {
		_id: string
		name: string
		username: string
		image: string
		id: string
	}[]
	threads: string[]
	createdAt: Date
	updatedAt: Date
}

// Community with populated threads (for fetchCommunityPosts)
declare interface ICommunityWithPosts {
	_id: string
	id: string
	username: string
	name: string
	bio: string
	image: string
	createdBy: string
	members: string[]
	threads: {
		_id: string
		text: string
		author: {
			name: string
			image: string
			id: string
		}
		children: {
			_id: string
			author: {
				image: string
				_id: string
			}
		}[]
		createdAt: Date
	}[]
	createdAt: Date
	updatedAt: Date
}

// Response interface for fetchCommunities
declare interface IFetchCommunitiesResult {
	communities: IPopulatedCommunity[]
	isNext: boolean
}

// Parameters for fetchCommunities function
declare interface IFetchCommunitiesParams {
	searchString?: string
	pageNumber?: number
	pageSize?: number
	sortBy?: "asc" | "desc"
}

// Community update parameters
declare interface IUpdateCommunityParams {
	communityId: string
	name: string
	username: string
	image: string
}

// Success response for member operations
declare interface ICommunityOperationSuccess {
	success: boolean
}

declare interface GetAllUsersResult {
	users: IUser[]
	isNext: boolean
}
