"use server"

import * as Minio from "minio"
import { writeFile, mkdir, unlink, readFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { existsSync } from "fs"
import * as mime from 'mime-types'

// --- Retrieve Environment Variables ---
const RAW_MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
const MINIO_BUCKET = process.env.MINIO_BUCKET || "edgersystem"; // Set default bucket name
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
const MINIO_PORT = process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 9000;
const TEMP_UPLOAD_DIR = process.env.TEMP_UPLOAD_DIR || join(process.cwd(), "tmp", "uploads");

// --- Validate Essential Environment Variables ---
// In development, use default values if env variables are not set
if (process.env.NODE_ENV !== 'development') {
  if (!RAW_MINIO_ENDPOINT) {
    throw new Error("CRITICAL: MINIO_ENDPOINT environment variable is not set");
  }
  if (!MINIO_ACCESS_KEY) {
    throw new Error("CRITICAL: MINIO_ACCESS_KEY environment variable is not set");
  }
  if (!MINIO_SECRET_KEY) {
    throw new Error("CRITICAL: MINIO_SECRET_KEY environment variable is not set");
  }
}

// Since we've validated these variables above, we can safely assert they are non-null
const BUCKET_NAME = MINIO_BUCKET;

// --- MinIO Client Options ---
const clientOptions: Minio.ClientOptions = {
  endPoint: RAW_MINIO_ENDPOINT || "localhost",
  port: MINIO_PORT,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: MINIO_ACCESS_KEY || "minioadmin",
  secretKey: MINIO_SECRET_KEY || "minioadmin"
};

// --- Initialize MinIO Client ---
const minioClient = new Minio.Client(clientOptions);

// --- Verify Bucket Existence ---
async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      try {
        await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
        return true;
      } catch (createError) {
        throw createError;
      }
    }
    return true;
  } catch (error) {
    console.error("Error checking or creating bucket:", error);
    throw error;
  }
}

// Attempt to ensure bucket exists on startup
ensureBucketExists().catch(err => {
  console.error("MinIO configuration error at startup:", err);
  // We don't throw here to allow the application to start even if MinIO is temporarily unavailable
});

/**
 * Create a temporary directory for file uploads if it doesn't exist
 */
async function ensureTempDirExists() {
  if (!existsSync(TEMP_UPLOAD_DIR)) {
    try {
      await mkdir(TEMP_UPLOAD_DIR, { recursive: true });
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Process the uploaded file and store it temporarily
 * @param formData FormData containing the file
 * @returns Object with success status and temporary file path or error message
 */
export async function processUploadedFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    // Validate file existence
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 10MB" };
    }

    // Ensure temporary directory exists
    await ensureTempDirExists();

    // Generate a unique filename for temporary storage
    const tempId = uuidv4();
    const fileExt = file.name.split('.').pop();
    const tempFilename = `${tempId}-${Date.now()}.${fileExt}`;
    const tempFilePath = join(TEMP_UPLOAD_DIR, tempFilename);

    // Store file metadata for later use
    const fileMetadata = {
      originalName: file.name,
      tempFilePath,
      tempFilename,
      fileType: file.type,
      fileSize: file.size,
      tempId,
      timestamp: Date.now()
    };

    // Convert file to buffer and write to temporary location
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(tempFilePath, buffer);

    return {
      success: true,
      tempFile: fileMetadata,
      previewUrl: `/api/temp-files/${tempFilename}` // Endpoint to serve temporary files for preview
    };
  } catch (error) {
    console.error("Error processing uploaded file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred during file processing",
      errorType: "PROCESSING_ERROR",
      details: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : undefined
    };
  }
}

/**
 * Upload a previously processed file to MinIO storage
 * @param tempFileData Data from the temporarily stored file
 * @param metadata Additional metadata for the file (category, related items, etc.)
 * @returns Object with success status and object details or error message
 */
export async function finalizeUpload(tempFileData: any, metadata?: any) {
  try {
    // Verify bucket exists before attempting upload
    await ensureBucketExists();

    if (!tempFileData || !tempFileData.tempFilePath) {
      console.error("Upload error: Invalid temporary file data");
      return { success: false, error: "No valid file data provided" };
    }

    // Generate a unique object key for the file in MinIO
    const uniqueFileName = uuidv4();
    const mimeType = mime.lookup(tempFileData.originalName) || 'application/octet-stream';
    const fileExtension = mime.extension(mimeType) || '';

    // Prepare metadata for MinIO
    const minioMetadata = {
      'Content-Type': mimeType,
      'X-Amz-Meta-Original-Filename': tempFileData.originalName,
      'X-Amz-Meta-File-Extension': fileExtension,
      'X-Amz-Meta-File-Size': tempFileData.fileSize.toString(),
      'X-Amz-Meta-Uploaded-By': metadata?.userId || 'system',
      'X-Amz-Meta-Category': metadata?.category || 'document',
      'X-Amz-Meta-Related-Item-Id': metadata?.relatedItemId || '',
      'X-Amz-Meta-Related-Item-Type': metadata?.relatedItemType || '',
    };

    // Read the file from temporary storage and upload to MinIO
    try {
      await minioClient.putObject(
        BUCKET_NAME,
        uniqueFileName,
        await readFile(tempFileData.tempFilePath),
        undefined, // size parameter is optional
        minioMetadata
      );

      // Generate a presigned URL for immediate access
      const presignedUrl = await minioClient.presignedGetObject(
        BUCKET_NAME,
        uniqueFileName,
        24 * 60 * 60 // 24 hours expiry
      );

      // After successful upload to MinIO, delete the temporary file
      try {
        await unlink(tempFileData.tempFilePath);
      } catch (deleteError) {
        console.warn("Failed to delete temporary file:", deleteError);
        // Log the error but don't fail the operation if temp file deletion fails
      }

      return {
        success: true,
        objectName: uniqueFileName,
        bucketName: BUCKET_NAME,
        url: presignedUrl,
        metadata: {
          originalName: tempFileData.originalName,
          mimeType,
          fileSize: tempFileData.fileSize,
          fileExtension,
          category: metadata?.category,
          relatedItemId: metadata?.relatedItemId,
          relatedItemType: metadata?.relatedItemType,
        }
      };
    } catch (uploadError) {
      console.error("Error uploading to MinIO:", uploadError);
      throw uploadError;
    }
  } catch (error) {
    // Comprehensive error logging
    console.error("ERROR in finalizeUpload function:", error);

    // Specific handling for common MinIO errors
    if (error instanceof Error) {
      // Check for connection errors
      if (error.message.includes("ECONNREFUSED") || error.message.includes("connect ETIMEDOUT")) {
        return {
          success: false,
          error: "Tidak dapat terhubung ke server penyimpanan. Mohon periksa apakah server berjalan.",
          errorType: "CONNECTION_ERROR"
        };
      }

      // Check for authentication errors
      if (error.message.includes("AccessDenied") || error.message.includes("InvalidAccessKeyId")) {
        return {
          success: false,
          error: "Autentikasi penyimpanan gagal. Mohon periksa kredensial akses.",
          errorType: "AUTH_ERROR"
        };
      }

      // Check for permission errors
      if (error.message.includes("NoSuchBucket") || error.message.includes("AllAccessDisabled")) {
        return {
          success: false,
          error: "Bucket penyimpanan tidak ditemukan atau akses ditolak.",
          errorType: "BUCKET_ERROR"
        };
      }
    }

    // Enhanced error reporting
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred during file upload",
      errorType: "UNKNOWN_ERROR",
      details: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : undefined
    };
  }
}

/**
 * Retrieve a file from MinIO storage
 * @param bucketName The bucket where the file is stored
 * @param objectName The object name (file identifier) in MinIO
 * @returns Object with file stream, statistics, and download file name
 */
export async function getFile(bucketName: string, objectName: string) {
  try {
    const stat = await minioClient.statObject(bucketName, objectName);
    // Get metadata
    const originalFileName = stat.metaData['original-filename'] || objectName;
    const fileExtension = stat.metaData['file-extension'] || '';
    const downloadFileName = originalFileName.includes('.')
      ? originalFileName
      : `${originalFileName}.${fileExtension}`;

    // Get file stream
    const fileStream = await minioClient.getObject(bucketName, objectName);

    return {
      fileStream,
      stat,
      downloadFileName
    };
  } catch (error: any) {
    console.error("Error retrieving file from MinIO:", error);
    throw new Error(`Failed to get file: ${error.message}`);
  }
}

/**
 * Generate a presigned URL for a file in MinIO
 * @param bucketName The bucket where the file is stored
 * @param objectName The object name (file identifier) in MinIO
 * @param expirySeconds How long the URL should be valid (in seconds)
 * @returns The presigned URL for accessing the file
 */
export async function getPresignedUrl(bucketName: string, objectName: string, expirySeconds = 24 * 60 * 60) {
  try {
    const url = await minioClient.presignedGetObject(
      bucketName,
      objectName,
      expirySeconds
    );
    return url;
  } catch (error: any) {
    console.error("Error generating presigned URL:", error);
    throw new Error(`Failed to generate presigned URL: ${error.message}`);
  }
}

/**
 * Upload a file directly to MinIO (combining processUploadedFile and finalizeUpload)
 * @param formData FormData containing the file
 * @param metadata Additional metadata for the file
 * @returns Object with success status and file details or error message
 */
export async function uploadFile(formData: FormData, metadata?: any) {
  try {
    // Process the file first
    const processResult = await processUploadedFile(formData);

    if (!processResult.success) {
      return processResult; // Return the error from processing
    }

    // Finalize the upload to MinIO
    const uploadResult = await finalizeUpload(processResult.tempFile, metadata);

    return uploadResult;
  } catch (error) {
    console.error("ERROR in uploadFile function:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred during file upload",
      errorType: "UNKNOWN_ERROR",
      details: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : undefined
    };
  }
} 
