import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { LogIn } from "lucide-react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import FileUpload from "@/components/FileUpload";

export default async function Home() {
  // Сначала проверяем зарегестрирован ли юзер или нет
  const {userId} = await auth()
  const isAuth = !!userId

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-2xl font-bold">Поиск любой информации по вашему PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          
          <div className="flex mt-2">
            {isAuth && (<Button>Перейти к чатам</Button>)}
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-700">
            Присоединяйся ко множеству людей, которые уже используют DocAi для более быстрого и качественного ресерча по файлам с использованием AI
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
