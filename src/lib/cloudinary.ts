import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Uploads a file buffer to Cloudinary using streams.
 * 
 * @param buffer - The file buffer to upload
 * @param options - Cloudinary upload options (e.g. folder, public_id, resource_type)
 */
export const uploadBuffer = (
  buffer: Buffer,
  options: UploadApiOptions = {}
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'alumni_portal',
        ...options,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed with empty result'));
        }
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Uploads a standard Web File (e.g., from Next.js App Router Request Form Data) to Cloudinary.
 * 
 * @param file - The Web File object
 * @param folder - Folder path in Cloudinary (defaults to 'alumni_portal')
 */
export const uploadFile = async (
  file: File,
  folder: string = 'alumni_portal'
): Promise<UploadApiResponse> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Clean special characters or spaces in filename for public_id
  const cleanFilename = file.name
    .replace(/\.[^/.]+$/, '') // remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '_'); // replace non-alphanumeric with _
    
  return uploadBuffer(buffer, {
    folder,
    public_id: `${cleanFilename}_${Date.now()}`,
    resource_type: 'auto',
  });
};

/**
 * Uploads a base64 encoded string to Cloudinary.
 * 
 * @param base64String - Base64 encoded file string (with or without data URI scheme prefix)
 * @param options - Cloudinary upload options
 */
export const uploadBase64 = async (
  base64String: string,
  options: UploadApiOptions = {}
): Promise<UploadApiResponse> => {
  // Automatically add data URI prefix if it's a raw base64 string and we assume image/jpeg
  const formattedString = base64String.startsWith('data:')
    ? base64String
    : `data:image/jpeg;base64,${base64String}`;

  return cloudinary.uploader.upload(formattedString, {
    folder: 'alumni_portal',
    ...options,
  });
};

/**
 * Deletes an asset from Cloudinary using its public ID.
 * 
 * @param publicId - The public ID of the resource to delete
 * @param resourceType - The resource type (e.g., 'image', 'video', 'raw')
 */
export const deleteAsset = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<{ result: string }> => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
