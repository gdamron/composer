"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

export interface WebAudio {
  audioContext?: AudioContext | undefined;
  setAudioContext?: ((ctx: AudioContext) => void) | undefined;
  nodes?: { [key: string]: AudioNode } | undefined;
}

export const WebAudioContext = createContext<WebAudio>({});

export const WebAudioProvider = ({ children }: { children: ReactNode }) => {
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [nodes, setNodes] = useState<{ [key: string]: AudioNode }>({});
  useEffect(() => {
    const ctx = new AudioContext();
    setAudioContext(ctx);
    setNodes({ dac: ctx.destination });
  }, []);

  return (
    <WebAudioContext.Provider value={{ audioContext, nodes }}>
      {children}
    </WebAudioContext.Provider>
  );
};
