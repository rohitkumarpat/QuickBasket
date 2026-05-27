"use client"

import React, { useEffect } from 'react'
import { getsocket } from '../lib/socket';

function Geoupdater({userId}:{userId:string}) {
useEffect(() => {
    if (!userId) return;

    const socket = getsocket();
    socket.emit("identity", userId);

    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("updateLocation", { userId, latitude, longitude });
        },
        (error) => {
            console.error("Error getting location:", {
                code: error.code,
                message: error.message
            });
        },
        { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watcher);
}, [userId]);
   

  return null;
}   

export default Geoupdater
