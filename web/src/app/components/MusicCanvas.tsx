"use client";

import ReactFlow, {
  Background,
  BackgroundVariant,
  SelectionMode,
} from "reactflow";

import "reactflow/dist/style.css";

import { WebAudioContext } from "../lib";
import { AppStore, useStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import { Oscillator, Gain, Output, Clock } from "./";
import { MouseEvent, useCallback, useContext, useMemo, useState } from "react";
import { AudioGraphNodeType } from "@audio-graph";
import { Melody } from "./nodes/Melody";

interface ContextMenuPosition {
  id: string;
  top: number;
  left: number;
}

const selector = (store: AppStore) => ({
  ...store,
});

const nodeTypes = {
  clock: Clock,
  gain: Gain,
  osc: Oscillator,
  dac: Output,
  melody: Melody,
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
  const [menu, setMenu] = useState<ContextMenuPosition | null>(null);

  useMemo(() => {
    if (!ctx.audioContext) {
      return;
    }

    if (ctx.nodes["dac"]) {
      return;
    }
    ctx.createNode({ ctx, id: "dac", type: "dac" });
  }, [ctx]);

  const onPaneContextMenu = useCallback(
    (evt: MouseEvent) => {
      evt.preventDefault();
      setMenu({
        id: "pane",
        top: evt.clientY,
        left: evt.clientX,
      });
    },
    [setMenu],
  );

  const onCreateNode = useCallback(
    (_evt: MouseEvent, nodeType: AudioGraphNodeType) => {
      addNode(ctx, nodeType);
      setMenu(null);
    },
    [ctx, addNode, setMenu],
  );

  const onPaneClick = useCallback(
    (_evt: MouseEvent) => {
      setMenu(null);
    },
    [setMenu],
  );

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
      onPaneContextMenu={onPaneContextMenu}
      onPaneClick={onPaneClick}
      selectionMode={SelectionMode.Partial}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} />
      {menu && (
        <div
          style={{ position: "absolute", top: menu.top, left: menu.left }}
          className="bg-background border p-2 shadow-md z-50"
        >
          {["Osc", "Gain", "Clock", "Melody"].map((btn) => (
            <button
              key={btn}
              className="px-2 py-1 block"
              onClick={(evt) =>
                onCreateNode(evt, btn.toLowerCase() as AudioGraphNodeType)
              }
            >
              {`Add ${btn}`}
            </button>
          ))}
        </div>
      )}
    </ReactFlow>
  );
};
