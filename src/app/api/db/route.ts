import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB } from "@/lib/db";

// Generic GET handler to fetch collection
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collection = searchParams.get("collection");

    const db = await getDB();
    
    if (collection) {
      const collectionData = db[collection as keyof typeof db] as any[];
      if (!collectionData) return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
      return NextResponse.json(collectionData);
    }
    
    // Return whole DB if no collection specified
    return NextResponse.json(db);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// Generic POST handler to CREATE new items
export async function POST(req: NextRequest) {
  try {
    const { collection, data } = await req.json();
    if (!collection || !data) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    const db = await getDB();
    const collectionData = db[collection as keyof typeof db] as any[];
    if (!collectionData) return NextResponse.json({ error: "Invalid collection" }, { status: 400 });

    // Ensure it has an ID
    if (!data.id) data.id = crypto.randomUUID();
    data.createdAt = data.createdAt || new Date().toISOString();

    collectionData.unshift(data);
    await saveDB(db);

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}

// Generic PUT handler to UPDATE items (Full object or just status)
export async function PUT(req: NextRequest) {
  try {
    const { collection, id, status, data } = await req.json();
    
    if (!collection || !id) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const db = await getDB();
    const collectionData = db[collection as keyof typeof db] as any[];
    
    if (!collectionData) {
      return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
    }

    const itemIndex = collectionData.findIndex((i: any) => i.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (data) {
      // Full object update
      collectionData[itemIndex] = { ...collectionData[itemIndex], ...data };
    } else if (status) {
      // Status-only update (Trash/Restore)
      collectionData[itemIndex].status = status;
    }

    await saveDB(db);

    return NextResponse.json({ success: true, item: collectionData[itemIndex] });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// Generic DELETE handler for Hard Deletes
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collection = searchParams.get("collection");
    const id = searchParams.get("id");

    if (!collection || !id) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const db = await getDB();
    const collectionData = db[collection as keyof typeof db] as any[];
    
    if (!collectionData) {
      return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
    }

    const newCollectionData = collectionData.filter((i: any) => i.id !== id);
    (db as any)[collection] = newCollectionData;
    
    await saveDB(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
