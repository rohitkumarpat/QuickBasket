import { v2 as cloudinary } from "cloudinary";
import { auth } from "../auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function cloudinaryUpload(file: File): Promise<string> {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized user");
  }

  if (!file) {
    throw new Error("File not found");
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imageUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "QuickBasket",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);

          resolve(result?.secure_url as string);
        }
      );

      uploadStream.end(buffer);
    });

    return imageUrl;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Image upload failed");
  }
}