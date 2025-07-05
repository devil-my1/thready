import mongoose, { Schema } from "mongoose"

export const communitySchema = new Schema({
	id: { type: String, required: true, unique: true },
	username: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	bio: {
		type: String,
		required: true
	},
	image: {
		type: String,
		default: ""
	},
	threads: [
		{
			type: Schema.Types.ObjectId,
			ref: "Thready"
		}
	],
	createdBy: {
		type: String,
		required: true
	},
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: "User"
		}
	]
})

export const Community =
	mongoose.models.Community || mongoose.model("Community", communitySchema)
