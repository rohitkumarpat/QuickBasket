
import { io,Socket } from "socket.io-client";

let socket:Socket|null=null;

export function getsocket() {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOKET_SERVER_URL);
    }
    return socket;
}