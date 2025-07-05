import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function isBase64Image(imageData: string) {
	const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/
	return base64Regex.test(imageData)
}

export function formatDateString(dateString: string) {
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric"
	}

	const date = new Date(dateString)
	const formattedDate = date.toLocaleDateString(undefined, options)

	const time = date.toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit"
	})

	return `${time} - ${formattedDate}`
}

export function formatThreadCount(count: number): string {
	if (count === 0) {
		return "No Threads"
	} else {
		const threadCount = count.toString().padStart(2, "0")
		const threadWord = count === 1 ? "Thread" : "Threads"
		return `${threadCount} ${threadWord}`
	}
}

// ERROR HANDLER
export const handleError = (error: unknown) => {
	if (error instanceof Error) {
		// This is a native JavaScript error (e.g., TypeError, RangeError)
		console.log(error.message)
	} else if (typeof error === "string") {
		// This is a string error message
		console.log(error)
	} else {
		// This is an unknown type of error
		console.log(error)
		throw new Error(`Unknown error: ${JSON.stringify(error)}`)
	}
}
