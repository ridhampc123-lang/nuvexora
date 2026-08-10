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
    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
      socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    } else if (process.env.NEXT_PUBLIC_API_URL) {
      socketUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "");
    } else if (typeof window !== "undefined") {
      const { hostname, protocol } = window.location;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        socketUrl = "http://localhost:5000";
      } else if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
        socketUrl = `http://${hostname}:5000`;
      } else if (protocol === "https:") {
        socketUrl = window.location.origin;
      } else {
        socketUrl = `http://${hostname}:5000`;
      }
    }

    const socketInstance = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    const handleRealtimeUpdate = () => {
      console.log("[Socket.IO] Real-time mutation event received! Refreshing active queries...");
      queryClient.invalidateQueries();
      queryClient.refetchQueries({ type: "active" });
    };

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("[Socket.IO] Real-time engine connected:", socketInstance.id);
      handleRealtimeUpdate();
    });

    socketInstance.on("dashboard_update", handleRealtimeUpdate);
    socketInstance.on("new_lead", handleRealtimeUpdate);
    socketInstance.on("attendance_update", handleRealtimeUpdate);
    socketInstance.on("leave_update", handleRealtimeUpdate);
    socketInstance.on("task_update", handleRealtimeUpdate);
    socketInstance.on("project_update", handleRealtimeUpdate);

    // Fallback periodic background sync every 12 seconds to guarantee automated refresh across tabs
    const autoRefreshInterval = setInterval(() => {
      queryClient.invalidateQueries();
    }, 12000);

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("[Socket.IO] Real-time engine disconnected");
    });

    setSocket(socketInstance);

    return () => {
      clearInterval(autoRefreshInterval);
      socketInstance.disconnect();
    };
  }, [queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

