"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import {
  AudioGraphNode,
  WebAudio,
  createControlEventCoordinator,
  createNode,
  updateNode,
  deleteNode,
  toggleAudio,
  connect,
  disconnect,
  isRunning,
  ControlEventCoordinator,
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
  const [eventCoordinator, setEventCoordinator] =
    useState<ControlEventCoordinator>();
  const [nodes] = useState<{ [key: string]: AudioGraphNode }>({});
  useEffect(() => {
    if (audioContext) {
      return;
    }

    console.log("Creating audio context");
    const ctx = new AudioContext();
    ctx.suspend();

    setAudioContext(ctx);

    console.log("Creating event coordinator");
    const coord = createControlEventCoordinator();

    setEventCoordinator(coord);
  }, [audioContext]);

  return (
    <WebAudioContext.Provider
      value={{
        audioContext,
        eventCoordinator,
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
