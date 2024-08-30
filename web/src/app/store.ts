import { create } from "zustand";
import {
  Connection,
  Edge,
  Node,
  NodeChange,
  applyNodeChanges,
  EdgeChange,
  applyEdgeChanges,
} from "reactflow";
import { nanoid } from "nanoid";
import {
  AudioGraphNodeParameters,
  AudioGraphNodeType,
  WebAudio,
} from "@audio-graph";

export interface AppStore {
  isAudioRunning: boolean;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addNode: (ctx: WebAudio, type: AudioGraphNodeType) => void;
  addEdge: (ctx: WebAudio, data: Connection | undefined) => void;
  removeEdges: (ctx: WebAudio, edges: Edge[]) => void;
  updateNode: (ctx: WebAudio, id: string, data: any) => void;
  removeNodes: (ctx: WebAudio, nodes: Node[]) => void;
  toggleAudio: (ctx: WebAudio) => void;
}

const defaultParameters: Record<AudioGraphNodeType, AudioGraphNodeParameters> =
  {
    clock: { bpm: 60.0 },
    dac: {},
    gain: { gain: 1.0 },
    osc: { frequency: 440, waveform: "sine" },
  };

export const useStore = create(
  (set, get: () => AppStore): AppStore => ({
    isAudioRunning: false,
    nodes: [
      {
        id: "dac",
        type: "dac",
        data: {},
        position: { x: 50, y: 450 },
      },
    ],
    edges: [],
    onNodesChange(changes) {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange(changes) {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    addNode(ctx: WebAudio, type: AudioGraphNodeType) {
      const id = nanoid();
      const position = { x: 0, y: 0 };
      const data = defaultParameters[type];

      ctx.createNode({ ctx, id, type, ...data });
      set({ nodes: [...get().nodes, { id, type, data, position }] });
    },
    addEdge(ctx: WebAudio, connection: Connection | undefined) {
      const { source, target, sourceHandle, targetHandle } = connection || {};
      if (!source || !target) {
        return;
      }

      const id = nanoid(6);
      const edge = {
        id,
        source,
        target,
        sourceHandle,
        targetHandle,
      };

      set({
        edges: [edge, ...get().edges],
      });

      const sourceId = source;
      const sourceSlot = sourceHandle?.split("#")[1];
      const targetId = target;
      const targetSlot = targetHandle?.split("#")[1];

      ctx.connect({ ctx, sourceId, sourceSlot, targetId, targetSlot });
    },
    removeEdges(ctx: WebAudio, edges: Edge[]) {
      for (const edge of edges) {
        const { source, sourceHandle, target, targetHandle } = edge;
        if (source && target) {
          const sourceId = source;
          const sourceSlot = sourceHandle?.split("#")[1];
          const targetId = target;
          const targetSlot = targetHandle?.split("#")[1];

          ctx.disconnect({ ctx, sourceId, sourceSlot, targetId, targetSlot });
        }
      }
    },
    updateNode(ctx: WebAudio, id, data) {
      ctx.updateNode({ ctx, id, ...data });
      set({
        nodes: get().nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
        ),
      });
    },
    removeNodes(ctx: WebAudio, nodes: Node[]) {
      for (const node of nodes) {
        const { id } = node;
        ctx.deleteNode({ ctx, id });
      }
    },
    toggleAudio(ctx: WebAudio) {
      ctx.toggleAudio(ctx)?.then(() => {
        set({
          isAudioRunning: ctx.isRunning(ctx),
        });
      });
    },
  }),
);
