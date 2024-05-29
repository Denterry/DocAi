import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import FileUpload from "@/components/FileUpload";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  // Сначала проверяем зарегестрирован ли юзер или нет
  const {userId} = await auth()
  const isAuth = !!userId
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0]
    }
  }
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-700 via-blue-500 to-gray-700">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center">
          <h1 className="mr-3 text-4xl font-bold">
            Общайся со своими <span className="text-white">документами в формате чата</span> за секунды.
          </h1>
          <UserButton afterSignOutUrl="/" />
        </div>
  
        <div className="flex mt-3 mb-2 text-grey-800">
            {isAuth && firstChat && (
              <Link href={`/chat/${firstChat.id}`}>
                <Button variant="secondary" size={'lg'}>Перейти к чатам <ArrowRight className="ml-2 h-5 w-5"/></Button>
              </Link>
            )}
        </div>

        <p className="max-w-xl mt-1 text-lg text-grey-800">
          Присоединяйся ко множеству людей, которые уже используют DocAi для более быстрого и качественного
          ресерча по файлам с использованием AI.
        </p>

        <div className="w-full mt-4">
          {isAuth ? (
            <FileUpload/>
          ):(
            <Link href="/sign-in">
              <Button>
                Авторизируйся, чтобы начать!
                <LogIn className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
