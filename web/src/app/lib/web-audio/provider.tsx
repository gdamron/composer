"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import {
  AudioGraphNode,
  WebAudio,
  createNode,
  updateNode,
  deleteNode,
  toggleAudio,
  connect,
  disconnect,
  isRunning,
} from "@audio-graph";

export const WebAudioContext = createContext<WebAudio>({
  nodes: {},
  createNode,
  updateNode,
  deleteNode,
  connect,
  disconnect,
  isRunning,
  toggleAudio,
});

export const WebAudioProvider = ({ children }: { children: ReactNode }) => {
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [nodes] = useState<{ [key: string]: AudioGraphNode }>({});
  useEffect(() => {
    const ctx = new AudioContext();
    ctx.suspend();

    setAudioContext(ctx);
  }, []);

  return (
    <WebAudioContext.Provider
      value={{
        audioContext,
        nodes,
        createNode,
        updateNode,
        deleteNode,
        connect,
        disconnect,
        isRunning,
        toggleAudio,
      }}
    >
      {children}
    </WebAudioContext.Provider>
  );
};
