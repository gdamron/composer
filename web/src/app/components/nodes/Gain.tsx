"use client";

import { Handle, Position } from "reactflow";
import { AppStore, useStore } from "../../store";
import { ChangeEvent, useContext } from "react";
import { useShallow } from "zustand/react/shallow";
import { WebAudio, WebAudioContext } from "../../lib/web-audio-provider";

export interface GainData {
  gain: number;
}

const selector = (ctx: WebAudio, id: string) => (store: AppStore) => ({
  setLevel: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(ctx, id, { gain: +e.target.value / 100.0 }),
});

export const Gain = ({ id, data }: { id: string; data: GainData }) => {
  const ctx = useContext(WebAudioContext);
  const { setLevel } = useStore(useShallow(selector(ctx, id)));

  return (
    <div>
      <Handle type="target" position={Position.Top} />

      <div className="rounded-md bg-white shadow-xl">
        <p className="rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm">
          Gain
        </p>
        <label className="flex flex-col px-2 py-1">
          <span className="text-xs font-bold my-2">Level</span>
          <input
            className="nodrag"
            type="range"
            min="0"
            max="100"
            value={data.gain * 100}
            onChange={setLevel}
          />
          <span className="text-right text-xs">{data.gain}</span>
        </label>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
