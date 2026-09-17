import multer from "multer";

const storage = multer.memoryStorage();

export const uploadSingleImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // maksimal 5mb
    },
}).single("image"); // "image" adalah anma key/field saat upload file

