import mongoose from "mongoose"

const threadySchema = new mongoose.Schema({
	parentId: { type: String },
	text: { type: String, required: true },
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	communityId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Community",
		default: null
	},
	children: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Thready"
		}
	],
	createdAt: { type: Date, default: Date.now }
})

const Thready =
	mongoose.models.Thready || mongoose.model("Thready", threadySchema)

export default Thready
