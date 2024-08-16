"use client";

import { Position } from "reactflow";
import { AppStore, useStore } from "../../store";
import { ChangeEvent, useContext } from "react";
import { useShallow } from "zustand/react/shallow";
import { NodeCard } from "./NodeCard";
import { WebAudioContext } from "../../lib";
import { WebAudio } from "@audio-graph";

export interface GainData {
  gain: number;
}

const selector = (ctx: WebAudio, id: string) => (store: AppStore) => ({
  setLevel: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(ctx, id, { gain: +e.target.value }),
});

export const Gain = ({ id, data }: { id: string; data: GainData }) => {
  const ctx = useContext(WebAudioContext);
  const { setLevel } = useStore(useShallow(selector(ctx, id)));

  return (
    <NodeCard
      title="Gain"
      handles={[
        {
          id: "audioIn",
          position: Position.Top,
          type: "target",
        },
        {
          id: "audioOut",
          position: Position.Bottom,
          type: "source",
        },
      ]}
    >
      <label className="flex flex-col px-2 pt-1 pb-4">
        <span className="text-xs font-bold my-2">Level</span>
        <div className="flex justify-end bg-inputbg py-2 pe-2 rounded-md">
          <input
            className="nodrag bg-transparent text-right grow"
            type="number"
            min="0"
            max="10000"
            step="0.01"
            value={data.gain}
            onChange={setLevel}
          />
        </div>
      </label>
    </NodeCard>
  );
};
