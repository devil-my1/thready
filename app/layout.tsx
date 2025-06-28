import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner"
import "react-datepicker/dist/react-datepicker.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/providers/theme-provider"

const inter = Inter({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-inter"
})

export const metadata: Metadata = {
	title: {
		default: "Thready",
		template: `%s | Thready`
	},
	description: "Thready - shares your threads with the world",
	icons: ["/assets/logo-icon.png"]
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider
			appearance={{
				layout: {
					socialButtonsVariant: "iconButton",
					logoImageUrl: "/assets/logo-icon.png"
				},
				variables: {
					colorText: "#fff",
					colorPrimary: "#624cf5",
					colorBackground: "#1C1F2E",
					colorInputBackground: "#252A41",
					colorInputText: "#fff"
				}
			}}
		>
			<html
				lang='en'
				suppressHydrationWarning
			>
				<body className={cn("--font-inter antialiased", inter.variable)}>
					<ThemeProvider
						attribute='class'
						defaultTheme='dark'
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Toaster />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
