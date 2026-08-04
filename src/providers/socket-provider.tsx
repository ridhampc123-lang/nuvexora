"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    let socketUrl = "http://localhost:5000";
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
        socketUrl = `http://${hostname}:5000`;
      }
    }
    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
      socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    }

    const socketInstance = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("[Socket.IO] Real-time engine connected:", socketInstance.id);
    });

    socketInstance.on("dashboard_update", () => {
      console.log("[Socket.IO] Real-time mutation event received! Refreshing active queries...");
      queryClient.invalidateQueries();
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("[Socket.IO] Real-time engine disconnected");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

