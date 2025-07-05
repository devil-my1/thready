import { generateUploadDropzone } from "@uploadthing/react"

import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { generateUploadButton } from "@uploadthing/react"
import { genUploader } from "uploadthing/client"

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()

export const { uploadFiles, createUpload } = genUploader<OurFileRouter>()
