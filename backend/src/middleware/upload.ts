import multer, { StorageEngine } from "multer";
import { CloudinaryStorage, Options } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage: StorageEngine = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "airbin",
    allowed_formats: ["jpg", "jpeg", "png"],
  } as Options["params"],
});

const upload = multer({ storage });

export default upload;
