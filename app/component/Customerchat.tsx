"use client";

import React, { useEffect, useRef, useState } from "react";
import { getsocket } from "../lib/socket";
import { Imsg } from "../model/msg.model";
import axios from "axios";

interface CustomerchatProps {
  orderid: string;
  userid: string;
}

function Customerchat({ orderid, userid }: CustomerchatProps) {
  const [message, setMessage] = useState("");
  const [chatmessages, setchatmessages] = useState<Imsg[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = getsocket();
    socket.connect();
    socket.emit("joinroom", orderid);

    const handleNewMessage = (incomingMessage: Imsg) => {
      if (String(incomingMessage.roomid) !== orderid) {
        return;
      }

      setchatmessages((prev) => [...prev, incomingMessage]);
    };

    socket.on("send-message", handleNewMessage);

    return () => {
      socket.off("send-message", handleNewMessage);
    };
  }, [orderid]);

  useEffect(() => {
    const getmessages = async () => {
      try {
        const response = await axios.post("/api/chat/message", { roomid: orderid });
        setchatmessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getmessages();
  }, [orderid]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [chatmessages]);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    const socket = getsocket();

    socket.emit("send-message", {
      roomid: orderid,
      text: trimmedMessage,
      senderid: userid,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setMessage("");
  };

  return (
    <section
      className="flex h-[420px] flex-col rounded-[28px] border border-neutral-400 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-5"
      data-orderid={String(orderid)}
      data-userid={String(userid)}
    >
      <div
        ref={messagesContainerRef}
        className="mb-3 flex-1 overflow-y-auto rounded-[20px] bg-neutral-50 p-4"
      >
        <div className="space-y-2">
          {chatmessages.map((msg, index) => (
            <div
              key={msg._id ? String(msg._id) : index}
              className={`max-w-[70%] rounded-lg p-3 ${
                String(msg.senderid) === userid
                  ? "ml-auto bg-green-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p>{msg.text}</p>
              <div className="mt-1 text-xs opacity-80">{msg.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a Message..."
            className="h-11 w-full rounded-2xl border-2 border-emerald-400 px-4 text-sm text-neutral-700 outline-none transition focus:border-emerald-500"
          />
          <button
            onClick={handleSendMessage}
            type="button"
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm transition hover:bg-emerald-600"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M22 2 11 13" />
              <path d="m22 2-7 20-4-9-9-4Z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Customerchat;
