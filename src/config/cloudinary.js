import { v2 as cloudinary } from "cloudinary";
import '../config/env.js';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME?.trim(), // .trim() removes accidental spaces
  api_key: process.env.CLOUDINARY_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_SECRET?.trim(),
});

export default cloudinary;