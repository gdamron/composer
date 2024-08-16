import {
  AudioGraphConnection,
  AudioGraphNode,
  AudioGraphNodeParameters,
} from "./nodes/base";
import {
  AudioGraphCreateNodeParameters,
  createAudioGraphNode,
} from "./nodes/factory";

export interface WebAudio {
  audioContext?: AudioContext | undefined;
  nodes: { [key: string]: AudioGraphNode };
  createNode: (params: AudioGraphCreateNodeParameters) => void;
  updateNode: (
    params: {
      ctx: WebAudio;
      id: string;
    } & Partial<AudioGraphNodeParameters>,
  ) => void;
  deleteNode: ({ ctx, id }: { ctx: WebAudio; id: string }) => void;
  connect: ({
    ctx,
    sourceId,
    targetId,
    targetSlot,
    sourceSlot,
  }: {
    ctx: WebAudio;
    sourceId: string;
    sourceSlot?: string;
    targetId: string;
    targetSlot?: string;
  }) => void;
  disconnect: ({
    ctx,
    sourceId,
    targetId,
    targetSlot,
    sourceSlot,
  }: {
    ctx: WebAudio;
    sourceId: string;
    sourceSlot?: string;
    targetId: string;
    targetSlot?: string;
  }) => void;
  isRunning: (ctx: WebAudio) => boolean;
  toggleAudio: (ctx: WebAudio) => Promise<void> | undefined;
}

export const createNode = (params: AudioGraphCreateNodeParameters) => {
  const { ctx, id } = params;

  const context = ctx.audioContext;
  if (!context) {
    console.error("No AudioContext");
    return;
  }

  if (!ctx.nodes) {
    console.error("No Nodes");
    return;
  }

  if (ctx.nodes[id]) {
    console.error(`Node with id ${id} already exists.`);
    return;
  }

  ctx.nodes[id] = createAudioGraphNode(params);
};

export const updateNode = (
  params: {
    ctx: WebAudio;
    id: string;
  } & Partial<AudioGraphNodeParameters>,
) => {
  const { ctx, id } = params;
  const nodes = ctx.nodes || {};
  const node = nodes[id];
  node.update(params);
};

export const deleteNode = ({ ctx, id }: { ctx: WebAudio; id: string }) => {
  const nodes = ctx.nodes || {};
  const node = nodes[id];
  node.destroy();
  delete nodes[id];
};

export const connect = ({
  ctx,
  sourceId,
  targetId,
  targetSlot,
  sourceSlot,
}: {
  ctx: WebAudio;
  sourceId: string;
  sourceSlot?: string;
  targetId: string;
  targetSlot?: string;
}) => {
  const nodes = ctx.nodes || {};
  const source = nodes[sourceId];
  const target = nodes[targetId];

  if (!(source && target)) {
    return;
  }

  console.log(`attempting to connect nodes`, source, target);
  source.connect({ sourceSlot, target, targetSlot });
};

export const disconnect = ({
  ctx,
  sourceId,
  targetId,
  targetSlot,
  sourceSlot,
}: {
  ctx: WebAudio;
  sourceId: string;
  sourceSlot?: string;
  targetId: string;
  targetSlot?: string;
}) => {
  const nodes = ctx.nodes || {};
  const source = nodes[sourceId];
  const target = nodes[targetId];

  if (!(source && target)) {
    return;
  }

  source.disconnect({ sourceSlot, target, targetSlot });
};

export const isRunning = (ctx: WebAudio) => {
  return ctx.audioContext?.state === "running";
};

export const toggleAudio = (ctx: WebAudio) => {
  return isRunning(ctx)
    ? ctx.audioContext?.suspend()
    : ctx.audioContext?.resume();
};
