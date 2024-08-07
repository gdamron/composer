"use client";

import { createContext } from "react";

export type WebAudioNodeType = "osc" | "gain" | "dac";

export interface OscillatorParameters {
  frequency: number;
  type: OscillatorType;
}

export interface GainParameters {
  gain: number;
}

export type WebAudioNodeParameters = OscillatorParameters | GainParameters;

export interface WebAudio {
  audioContext?: AudioContext | undefined;
  nodes?: { [key: string]: AudioNode } | undefined;
  createNode: ({
    ctx,
    id,
    type,
    data,
  }: {
    ctx: WebAudio;
    id: string;
    type: WebAudioNodeType;
    data: WebAudioNodeParameters;
  }) => void;
  updateNode: ({
    ctx,
    id,
    data,
  }: {
    ctx: WebAudio;
    id: string;
    data: Partial<WebAudioNodeParameters>;
  }) => void;
  deleteNode: ({ ctx, id }: { ctx: WebAudio; id: string }) => void;
  connect: ({
    ctx,
    sourceId,
    targetId,
  }: {
    ctx: WebAudio;
    sourceId: string;
    targetId: string;
  }) => void;
  disconnect: ({
    ctx,
    sourceId,
    targetId,
  }: {
    ctx: WebAudio;
    sourceId: string;
    targetId: string;
  }) => void;
  isRunning: (ctx: WebAudio) => boolean;
  toggleAudio: (ctx: WebAudio) => Promise<void> | undefined;
}

export const createNode = ({
  ctx,
  id,
  type,
  data,
}: {
  ctx: WebAudio;
  id: string;
  type: WebAudioNodeType;
  data: WebAudioNodeParameters;
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
      const oscData = data as OscillatorParameters;
      node.frequency.value = oscData.frequency;
      node.type = oscData.type;
      node.start();
      ctx.nodes[id] = node;
      break;
    }
    case "gain": {
      const node = context.createGain();
      const gainData = data as GainParameters;
      node.gain.value = gainData.gain;
      ctx.nodes[id] = node;
      break;
    }
    default:
      return;
  }
};

export const updateNode = ({
  ctx,
  id,
  data,
}: {
  ctx: WebAudio;
  id: string;
  data: Partial<WebAudioNodeParameters>;
}) => {
  const nodes = ctx.nodes || {};
  const node = nodes[id];

  switch (node.constructor) {
    case OscillatorNode:
      const oscParams = data as Partial<OscillatorParameters>;
      const osc = node as OscillatorNode;

      if (oscParams.frequency !== undefined) {
        osc.frequency.value = oscParams.frequency;
      }

      if (oscParams.type !== undefined) {
        osc.type = oscParams.type;
      }
      break;
    case GainNode:
      const gainParams = data as Partial<GainParameters>;
      const gain = node as GainNode;
      if (gainParams.gain !== undefined) {
        gain.gain.value = gainParams.gain;
      }
      break;
  }
};

export const deleteNode = ({ ctx, id }: { ctx: WebAudio; id: string }) => {
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

  if (!(source && target)) {
    return;
  }

  switch (target.constructor) {
    case OscillatorNode:
      const oscTarget = target as OscillatorNode;
      source.connect(oscTarget.frequency);
      break;
    default:
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

  if (!(source && target)) {
    return;
  }

  switch (target.constructor) {
    case OscillatorNode:
      const oscTarget = target as OscillatorNode;
      source.disconnect(oscTarget.frequency);
      break;
    default:
      source.disconnect(target);
  }
};

export const isRunning = (ctx: WebAudio) => {
  return ctx.audioContext?.state === "running";
};

export const toggleAudio = (ctx: WebAudio) => {
  return isRunning(ctx)
    ? ctx.audioContext?.suspend()
    : ctx.audioContext?.resume();
};

export interface WebAudio {
  audioContext?: AudioContext | undefined;
  nodes?: { [key: string]: AudioNode } | undefined;
  createNode: ({
    ctx,
    id,
    type,
    data,
  }: {
    ctx: WebAudio;
    id: string;
    type: WebAudioNodeType;
    data: WebAudioNodeParameters;
  }) => void;
  updateNode: ({
    ctx,
    id,
    data,
  }: {
    ctx: WebAudio;
    id: string;
    data: Partial<WebAudioNodeParameters>;
  }) => void;
  deleteNode: ({ ctx, id }: { ctx: WebAudio; id: string }) => void;
  connect: ({
    ctx,
    sourceId,
    targetId,
  }: {
    ctx: WebAudio;
    sourceId: string;
    targetId: string;
  }) => void;
  disconnect: ({
    ctx,
    sourceId,
    targetId,
  }: {
    ctx: WebAudio;
    sourceId: string;
    targetId: string;
  }) => void;
  isRunning: (ctx: WebAudio) => boolean;
  toggleAudio: (ctx: WebAudio) => Promise<void> | undefined;
}

export const WebAudioContext = createContext<WebAudio>({
  createNode,
  updateNode,
  deleteNode,
  connect,
  disconnect,
  isRunning,
  toggleAudio,
});
