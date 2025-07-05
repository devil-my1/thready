import mongoose from "mongoose"
import { handleError } from "./utils"

let isConnected = false

export const connectToDatabase = async () => {
	mongoose.set("strictQuery", true)

	if (!process.env.MONGODB_URL) {
		console.log(
			"Please define the MONGODB_URL environment variable inside .env.local"
		)
	}
	if (isConnected) {
		return
	}

	try {
		await mongoose.connect(process.env.MONGODB_URL!!)
		isConnected = true
	} catch (error) {
		handleError(error)
	}
}
