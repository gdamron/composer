"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  WebAudioContext,
  createNode,
  updateNode,
  deleteNode,
  toggleAudio,
  connect,
  disconnect,
  isRunning,
} from "./context";

export const WebAudioProvider = ({ children }: { children: ReactNode }) => {
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [nodes, setNodes] = useState<{ [key: string]: AudioNode }>({});
  useEffect(() => {
    const ctx = new AudioContext();
    ctx.suspend();

    setAudioContext(ctx);
    setNodes({ dac: ctx.destination });
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
