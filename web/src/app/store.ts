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
import { GainParameters, OscillatorParameters, WebAudio } from "./lib";

export interface AppStore {
  isAudioRunning: boolean;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addNode: (ctx: WebAudio, type: string) => void;
  addEdge: (ctx: WebAudio, data: Connection | undefined) => void;
  removeEdges: (ctx: WebAudio, edges: Edge[]) => void;
  updateNode: (ctx: WebAudio, id: string, data: any) => void;
  removeNodes: (ctx: WebAudio, nodes: Node[]) => void;
  toggleAudio: (ctx: WebAudio) => void;
}

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
    addNode(ctx: WebAudio, type: string) {
      const id = nanoid();

      switch (type) {
        case "osc": {
          const data: OscillatorParameters = {
            frequency: 440,
            type: "sine",
          };
          const position = { x: 0, y: 0 };

          ctx.createNode({ ctx, id, type, data });
          set({ nodes: [...get().nodes, { id, type, data, position }] });

          break;
        }

        case "gain": {
          const data: GainParameters = { gain: 1.0 };
          const position = { x: 0, y: 0 };
          ctx.createNode({ ctx, id, type, data });
          set({ nodes: [...get().nodes, { id, type, data, position }] });

          break;
        }
      }
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
      ctx.connect({ ctx, sourceId: source, targetId: target });
    },
    removeEdges(ctx: WebAudio, edges: Edge[]) {
      for (const edge of edges) {
        const { source, target } = edge;
        if (source && target) {
          ctx.disconnect({ ctx, sourceId: source, targetId: target });
        }
      }
    },
    updateNode(ctx: WebAudio, id, data) {
      ctx.updateNode({ ctx, id, data });
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
