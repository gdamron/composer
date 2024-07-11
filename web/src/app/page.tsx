"use client";

import "reactflow/dist/style.css";
import { WebAudioProvider } from "./lib/web-audio-provider";
import { MusicCanvas } from "./components/MusicCanvas";

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <WebAudioProvider>
        <MusicCanvas />
      </WebAudioProvider>
    </main>
  );
}
