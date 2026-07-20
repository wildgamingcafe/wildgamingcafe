import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB } from "@/lib/db";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const extension = path.extname(file.name);
    const filename = `${path.basename(file.name, extension)}-${uniqueSuffix}${extension}`;
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Save file
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    const fileType = file.type.startsWith("video/") ? "video" : "image";

    // Add to local DB
    const db = await getDB();
    const newMedia = {
      id: crypto.randomUUID(),
      url: fileUrl,
      type: fileType,
      name: file.name,
      createdAt: new Date().toISOString(),
      status: "Published" // 'Published' or 'Trashed'
    };
    
    db.media.push(newMedia);
    await saveDB(db);

    return NextResponse.json(newMedia);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
