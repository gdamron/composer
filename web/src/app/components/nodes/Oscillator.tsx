"use client";

import { Handle, Position } from "reactflow";
import { AppStore, useStore } from "../../store";
import { ChangeEvent, useContext } from "react";
import { useShallow } from "zustand/react/shallow";
import { WebAudio, WebAudioContext } from "../../lib/WebAudioProvider";

export interface OscillatorData {
  frequency: number;
  type: OscillatorType;
}

const selector = (ctx: WebAudio, id: string) => (store: AppStore) => ({
  setFrequency: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(ctx, id, { frequency: +e.target.value }),
  setType: (e: ChangeEvent<HTMLSelectElement>) =>
    store.updateNode(ctx, id, { type: e.target.value }),
});

export const Oscillator = ({
  id,
  data,
}: {
  id: string;
  data: OscillatorData;
}) => {
  const ctx = useContext(WebAudioContext);
  const { setFrequency, setType } = useStore(useShallow(selector(ctx, id)));

  return (
    <div className="min-w-40">
      <Handle type="target" position={Position.Top} />

      <div className="rounded-md bg-white shadow-xl">
        <p className="rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm">
          Oscillator
        </p>
        <label className="flex flex-col px-2 py-1">
          <span className="text-xs font-bold my-2">Frequency</span>
          <div className="flex justify-end bg-gray-50 py-2 rounded-md">
            <input
              className="nodrag bg-transparent text-right grow"
              type="number"
              min="0.01"
              max="40000"
              step="0.01"
              value={data.frequency}
              onChange={setFrequency}
            />
            <span className="text-left text-md pe-2">Hz</span>
          </div>
        </label>

        <label className="flex flex-col px-2 pt-1 pb-4">
          <span className="text-xs font-bold mb-2">Waveform</span>
          <div className="flex justify-end bg-gray-50 py-2 px-3 rounded-md">
            <select
              className="nodrag bg-transparent grow text-right px-2"
              value={data.type}
              onChange={setType}
            >
              <option value="sine">Sine</option>
              <option value="triangle">Triangle</option>
              <option value="sawtooth">Sawtooth</option>
              <option value="square">Square</option>
            </select>
          </div>
        </label>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
