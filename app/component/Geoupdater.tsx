"use client";

import { useEffect, useRef } from "react";
import { getsocket } from "../lib/socket";

type GeoPoint = {
  latitude: number;
  longitude: number;
};

function Geoupdater({
  userId,
  onLocationChange,
}: {
  userId: string;
  onLocationChange?: (location: GeoPoint) => void;
}) {
  const lastSentLocationRef = useRef<GeoPoint | null>(null);
  const onLocationChangeRef = useRef(onLocationChange);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const socket = getsocket();
    socket.connect();

    const emitIdentity = () => {
      console.log("[geo] emitting identity", { userId, socketId: socket.id });
      socket.emit("identity", userId);
    };

    if (socket.connected) {
      emitIdentity();
    }

    socket.on("connect", emitIdentity);

    if (!navigator.geolocation) {
      console.error("[geo] geolocation is not supported in this browser");
      return () => {
        socket.off("connect", emitIdentity);
      };
    }

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        const previousLocation = lastSentLocationRef.current;
        const unchanged =
          previousLocation?.latitude === nextLocation.latitude &&
          previousLocation?.longitude === nextLocation.longitude;

        if (unchanged) {
          return;
        }

        lastSentLocationRef.current = nextLocation;
        onLocationChangeRef.current?.(nextLocation);

        console.log("[geo] emitting updateLocation", {
          userId,
          ...nextLocation,
        });

        socket.emit("updateLocation", {
          userId,
          ...nextLocation,
        });
      },
      (error) => {
        console.error("[geo] Error getting location:", {
          code: error.code,
          message: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );

    return () => {
      socket.off("connect", emitIdentity);
      navigator.geolocation.clearWatch(watcher);
    };
  }, [userId]);

  return null;
}

export default Geoupdater;
