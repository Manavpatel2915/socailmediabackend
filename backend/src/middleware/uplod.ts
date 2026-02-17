import multer, { StorageEngine } from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage: StorageEngine = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "medicines",
    allowed_formats: ["jpg", "jpeg", "png"],
  } as any,
});

const upload = multer({ storage });

export default upload;
