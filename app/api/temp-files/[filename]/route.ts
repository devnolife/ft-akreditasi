import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import mime from "mime-types"

const TEMP_UPLOAD_DIR = process.env.TEMP_UPLOAD_DIR || join(process.cwd(), "tmp", "uploads");

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    const filePath = join(TEMP_UPLOAD_DIR, filename);

    // Security check: Ensure the requested file exists in the temp directory
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Determine content type
    const contentType = mime.lookup(filename) || "application/octet-stream";

    // Create response with the file content
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    });
  } catch (error) {
    console.error("Error serving temporary file:", error);
    return NextResponse.json(
      { error: "Error serving file" },
      { status: 500 }
    );
  }
} 
