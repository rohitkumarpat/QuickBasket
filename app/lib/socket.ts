"use client";

import { io, Socket } from "socket.io-client";

type DebugSocket = Socket & {
  __debugListenersAttached?: boolean;
};

declare global {
  interface Window {
    __foodDeliverySocket?: DebugSocket;
  }
}

function attachDebugListeners(socket: DebugSocket) {
  if (socket.__debugListenersAttached) {
    return;
  }

  socket.__debugListenersAttached = true;

  socket.on("connect", () => {
    console.log("[socket] connected", {
      id: socket.id,
      connected: socket.connected,
    });
  });

  socket.on("disconnect", (reason) => {
    console.warn("[socket] disconnected", {
      id: socket.id,
      reason,
    });
  });

  socket.on("connect_error", (error) => {
    console.error("[socket] connect_error", {
      message: error.message,
      name: error.name,
    });
  });

  socket.onAny((event, ...args) => {
    console.log("[socket] onAny", {
      event,
      args,
    });
  });
}

export function getsocket() {
  if (typeof window === "undefined") {
    throw new Error("getsocket() must be called on the client");
  }

  if (!window.__foodDeliverySocket) {
    const socket = io(process.env.NEXT_PUBLIC_SOKET_SERVER_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
    }) as DebugSocket;

    attachDebugListeners(socket);
    window.__foodDeliverySocket = socket;
  }

  return window.__foodDeliverySocket;
}
