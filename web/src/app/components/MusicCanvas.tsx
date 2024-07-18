"use client";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Panel,
  SelectionMode,
} from "reactflow";

import "reactflow/dist/style.css";

import { WebAudioContext } from "../lib";
import { AppStore, useStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import { Clock, Oscillator, Gain, Output } from "./";
import { useContext } from "react";

const selector = (store: AppStore) => ({
  nodes: store.nodes,
  edges: store.edges,
  addEdge: store.addEdge,
  addNode: store.addNode,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  removeEdges: store.removeEdges,
  removeNodes: store.removeNodes,
});

const nodeTypes = {
  clock: Clock,
  gain: Gain,
  osc: Oscillator,
  dac: Output,
};

export const MusicCanvas = () => {
  const ctx = useContext(WebAudioContext);
  const {
    nodes,
    edges,
    addEdge,
    addNode,
    onNodesChange,
    onEdgesChange,
    removeNodes,
    removeEdges,
  } = useStore(useShallow(selector));

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      edges={edges}
      onNodesChange={onNodesChange}
      onNodesDelete={(nodes) => removeNodes(ctx, nodes)}
      onEdgesChange={onEdgesChange}
      onConnect={(connection) => addEdge(ctx, connection)}
      onEdgesDelete={(edges) => removeEdges(ctx, edges)}
      selectionMode={SelectionMode.Partial}
      proOptions={{ hideAttribution: true }}
    >
      <Panel className="space-x-4" position="top-right">
        <button
          className="px-2 py-1 rounded bg-cardbg shadow-md"
          onClick={() => addNode(ctx, "osc")}
        >
          Add Osc
        </button>
        <button
          className="px-2 py-1 rounded bg-cardbg shadow-md"
          onClick={() => addNode(ctx, "gain")}
        >
          Add Gain
        </button>
        <button
          className="px-2 py-1 rounded bg-cardbg shadow-md"
          onClick={() => addNode(ctx, "clock")}
        >
          Add Clock
        </button>
      </Panel>
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
};
