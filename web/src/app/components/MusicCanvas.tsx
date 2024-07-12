"use client";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Panel,
  SelectionMode,
} from "reactflow";

import "reactflow/dist/style.css";

import { WebAudioContext } from "../lib/WebAudioProvider";
import { AppStore, useStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import {
  Oscillator,
  LowFrequencyOscillator,
  Gain,
  Output,
  Amplifier,
} from "./";
import { useContext } from "react";

const selector = (store: AppStore) => ({
  ...store,
});

const nodeTypes = {
  amp: Amplifier,
  gain: Gain,
  lfo: LowFrequencyOscillator,
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
          className="px-2 py-1 rounded bg-white shadow-md"
          onClick={() => addNode(ctx, "osc")}
        >
          Add Osc
        </button>
        <button
          className="px-2 py-1 rounded bg-white shadow-md"
          onClick={() => addNode(ctx, "gain")}
        >
          Add Gain
        </button>
        <button
          className="px-2 py-1 rounded bg-white shadow-md"
          onClick={() => addNode(ctx, "amp")}
        >
          Add Amp
        </button>
        <button
          className="px-2 py-1 rounded bg-white shadow-md"
          onClick={() => addNode(ctx, "lfo")}
        >
          Add LFO
        </button>
      </Panel>
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
};
