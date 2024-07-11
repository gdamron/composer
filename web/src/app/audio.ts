"use client";

import { WebAudio } from "./lib/web-audio-provider";

export const updateAudioNode = ({
  ctx,
  id,
  data,
}: {
  ctx: WebAudio;
  id: string;
  data: object;
}) => {
  const nodes = ctx.nodes || {};
  const node = nodes[id];

  for (const [key, val] of Object.entries(data)) {
    if (node[key] instanceof AudioParam) {
      node[key].value = val;
    } else {
      node[key] = val;
    }
  }
};

export type AudioNodeType = "osc" | "gain" | "dac";

export const createAudioNode = ({
  ctx,
  id,
  type,
  data,
}: {
  ctx: WebAudio;
  id: string;
  type: AudioNodeType;
  data: object;
}) => {
  const context = ctx.audioContext;
  if (!context) {
    console.error("No AudioContext");
    return;
  }

  if (!ctx.nodes) {
    console.error("No Nodes");
    return;
  }

  switch (type) {
    case "osc": {
      const node = context.createOscillator();
      const oscData = data as { frequency: number; type: OscillatorType };
      node.frequency.value = oscData.frequency;
      node.type = oscData.type;
      node.start();
      ctx.nodes[id] = node;
      break;
    }
    case "gain": {
      const node = context.createGain();
      const gainData = data as { gain: number };
      node.gain.value = gainData.gain;
      ctx.nodes[id] = node;
      break;
    }
    default:
      return;
  }
};

export const removeAudioNode = ({ ctx, id }: { ctx: WebAudio; id: string }) => {
  const nodes = ctx.nodes || {};
  const node = nodes[id];

  if (node instanceof OscillatorNode) {
    node?.stop();
  }

  node?.disconnect();
  delete nodes[id];
};

export const connect = ({
  ctx,
  sourceId,
  targetId,
}: {
  ctx: WebAudio;
  sourceId: string;
  targetId: string;
}) => {
  const nodes = ctx.nodes || {};
  const source = nodes[sourceId];
  const target = nodes[targetId];

  if (source && target) {
    source.connect(target);
  }
};

export const disconnect = ({
  ctx,
  sourceId,
  targetId,
}: {
  ctx: WebAudio;
  sourceId: string;
  targetId: string;
}) => {
  const nodes = ctx.nodes || {};
  const source = nodes[sourceId];
  const target = nodes[targetId];

  if (source && target) {
    source.disconnect(target);
  }
};

export const isAudioRunning = (ctx: WebAudio) => {
  return ctx.audioContext?.state === "running";
};

export const toggleAudioContext = (ctx: WebAudio) => {
  return isAudioRunning(ctx)
    ? ctx.audioContext?.suspend()
    : ctx.audioContext?.resume();
};
