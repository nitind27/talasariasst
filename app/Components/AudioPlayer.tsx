"use client";
import { useEffect, useRef } from "react";

export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    console.log("fasdf",process.env.NEXT_PUBLIC_API_URL);
    useEffect(() => {
        if (document.getElementById("global-audio")) return;

        const audio = document.createElement("audio");
        audio.id = "global-audio";
        audio.src = `${process.env.NEXT_PUBLIC_API_URL}/audio/audio.mp3`; // correct path
        audio.loop = true;
        audio.autoplay = true;
        audio.style.display = "none";
        document.body.appendChild(audio);

        // Autoplay restriction fix
        const startMusic = () => {
            audio.play().catch(() => { });
            document.removeEventListener("click", startMusic);
        };
        document.addEventListener("click", startMusic);

        audioRef.current = audio;
    }, []);

    return null;
}
