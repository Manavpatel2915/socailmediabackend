import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.config";

cloudinary.config({
  cloud_name: env.CLOUDINARY.CLOUDINARY_NAME as string,
  api_key: env.CLOUDINARY.CLOUDINARY_API_KEY as string,
  api_secret: env.CLOUDINARY.CLOUDINARY_SECRET as string,
});

export default cloudinary;
