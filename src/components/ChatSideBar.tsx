"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="w-full max-h-screen overflow-scroll soff h-screen p-4 text-gray-200 bg-blue-900">
      <Link href="/">
        <Button className="w-full border-dashed border-white border bg-gradient-to-r from-blue-700  to-gray-600">
          <PlusCircle className="mr-2 w-4 h-4" />
          Новый чат
        </Button>
      </Link>

      <div className="flex pb-20 flex-col gap-2 mt-4 ">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-gradient-to-r from-blue-700 to-gray-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                  {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-10 left-3">
            <div className="flex items-center gap-2 text-sm text-gray-300 flex-wrap">
                <Link href='/'><Home size="2.5em"/></Link>
                {/* {Payment Button} */}
            </div>
      </div>
    </div>
  );
};

export default ChatSideBar;