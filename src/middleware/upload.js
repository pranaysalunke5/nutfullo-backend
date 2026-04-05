import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "misc";

    if (file.fieldname === "images") {
      folder = "products";
    } else if (file.fieldname === "document") {
      folder = "onboard-docs";
      
    }

    return {
      folder,
      resource_type: "auto", // 👈 allows images + pdf + any file
      allowed_formats: [
        "jpg",
        "png",
        "jpeg",
        "webp",
        "pdf",
      ],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`, // unique name
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;