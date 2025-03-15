import crypto from "crypto";
import path from "path";
import fs from "fs";

const generateFilename = async (filePath, originalName) => {
    const fileBuffer = await fs.promises.readFile(filePath); // Read file content
    const hash = crypto.createHash("md5").update(fileBuffer).digest("hex"); // Generate hash
    return hash + path.extname(originalName); // Filename = hash.ext
};


import crypto from "crypto";
import path from "path";
import fs from "fs";

filename: async (req, file, cb) => {
    try {
        const fileBuffer = await fs.promises.readFile(file.path); // Read file content
        const hash = crypto.createHash("md5").update(fileBuffer).digest("hex"); // Generate hash
        cb(null, hash + path.extname(file.originalname)); // Filename = hash.ext
    } catch (error) {
        cb(error);
    }
}
