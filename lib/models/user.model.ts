import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
	clerkId: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true,
		trim: true
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	bio: {
		type: String,
		default: "",
		trim: true
	},
	image: {
		type: String,
		default: "",
		trim: true
	},
	threads: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Thready"
		}
	],
	likedThreads: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Thready"
		}
	],
	onboarded: {
		type: Boolean,
		default: false
	},
	communities: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Community"
		}
	],
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
})

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
