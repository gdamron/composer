"use client";

import { Handle, Position } from "reactflow";
import { AppStore, useStore } from "../../store";
import { ChangeEvent, useContext } from "react";
import { useShallow } from "zustand/react/shallow";
import { WebAudio, WebAudioContext } from "../../lib/WebAudioProvider";

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
    <div className="min-w-40">
      <Handle type="target" position={Position.Top} />

      <div className="rounded-md bg-white shadow-xl">
        <p className="rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm">
          Gain
        </p>
        <label className="flex flex-col px-2 pt-1 pb-4">
          <span className="text-xs font-bold my-2">Level</span>
          <div className="flex justify-end bg-gray-50 py-2 pe-2 rounded-md">
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
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
