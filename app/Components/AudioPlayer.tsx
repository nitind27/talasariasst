"use client";
import { useEffect, useRef } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (document.getElementById("global-audio")) return;

    const audio = document.createElement("audio");
    audio.id = "global-audio";
    audio.src = "https://talasariassistance.nptalasari.org/audio/audio.mp3"; // correct path
    audio.loop = true;
    audio.autoplay = true;
    audio.style.display = "none";
    document.body.appendChild(audio);

    // Autoplay restriction fix
    const startMusic = () => {
      audio.play().catch(() => {});
      document.removeEventListener("click", startMusic);
    };
    document.addEventListener("click", startMusic);

    audioRef.current = audio;
  }, []);

  return null;
}
