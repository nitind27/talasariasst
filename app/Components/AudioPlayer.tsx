"use client";
import { useEffect, useRef } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Agar pehle se audio hai toh dobara mat banao
    if (document.getElementById("global-audio")) return;

    const audio = document.createElement("audio");
    audio.id = "global-audio";
    audio.src = "/audio/audio.mpeg";
    audio.loop = true;
    audio.autoplay = true;
    audio.style.display = "none"; // hide element
    document.body.appendChild(audio);

    // Autoplay restriction fix
    const startMusic = () => {
      audio.play().catch(() => {});
      document.removeEventListener("click", startMusic);
    };
    document.addEventListener("click", startMusic);

    audioRef.current = audio;
  }, []);

  return null; // koi UI render nahi hoga
}
