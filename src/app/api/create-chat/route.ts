import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getVkUrl } from "@/lib/vkcloud";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name, url } = body;
    console.log(file_key, file_name, url);
    await loadS3IntoPinecone(file_key);

    const clean_url = truncateStringBeforeQuestionMark(url);

    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: clean_url,
        userId,
      })
      .returning({
        insertedId: chats.id,
      });
    console.log("we are here at route of creating chat")
    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}

function truncateStringBeforeQuestionMark(inputString: string) {
  const questionMarkIndex = inputString.indexOf('?');
  
  if (questionMarkIndex !== -1) {
    return inputString.substring(0, questionMarkIndex);
  }

  return inputString;
}