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
import { Oscillator, Gain, Output, Clock } from "./";
import { useContext, useMemo } from "react";

const selector = (store: AppStore) => ({
  ...store,
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

  useMemo(() => {
    if (!ctx.audioContext) {
      return;
    }

    if (ctx.nodes["dac"]) {
      return;
    }
    ctx.createNode({ ctx, id: "dac", type: "dac" });
  }, [ctx]);
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
