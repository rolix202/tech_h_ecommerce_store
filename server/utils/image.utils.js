import dotenv from "dotenv"
import cloudinary from "cloudinary"
import fs from "fs"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDIANRY_CLOUD_NAME,
    api_key: process.env.CLOUDIANRY_API_KEY,
    api_secret: process.env.CLOUDIANRY_API_SECRET
})

export default {
    uploadImageToCloudinary: async (filePath) => {
        return cloudinary.v2.uploader.upload(filePath, {
            folder: "Tech_haven_store"
        })
    },

    deleteLocalFile: async (filePath) => {
        await fs.promises.unlink(filePath)
    },

    deleteLocalFiles: async (files) => {
        for (const file of files) {
            await fs.promises.unlink(file.path)
        }
    },

    cleanupFailedUpload: async (uploads) => {
        for (const upload of uploads) {
            await cloudinary.v2.uploader.destroy(upload.publicId)
        }
    }

}