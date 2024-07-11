"use client";

import { Handle, Position } from "reactflow";
import { AppStore, useStore } from "../../store";
import { ChangeEvent } from "react";
import { useShallow } from "zustand/react/shallow";

export interface OscillatorData {
  frequency: number;
  type: OscillatorType;
}

const selector = (id: string) => (store: AppStore) => ({
  setFrequency: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { frequency: +e.target.value }),
  setType: (e: ChangeEvent<HTMLSelectElement>) =>
    store.updateNode(id, { type: e.target.value }),
});

export const Oscillator = ({
  id,
  data,
}: {
  id: string;
  data: OscillatorData;
}) => {
  const { setFrequency, setType } = useStore(useShallow(selector(id)));

  return (
    <div>
      <div className="rounded-md bg-white shadow-xl">
        <p className="rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm">
          Oscillator
        </p>
        <label className="flex flex-col px-2 py-1">
          <span className="text-xs font-bold my-2">Frequency</span>
          <input
            className="nodrag"
            type="range"
            min="10"
            max="1000"
            value={data.frequency}
            onChange={setFrequency}
          />
          <span className="text-right text-xs">{data.frequency}Hz</span>
          <hr className="border-gray-200 m-1" />
        </label>

        <label className="flex flex-col px-2 pt-1 pb-4">
          <span className="text-xs font-bold mb-2">Waveform</span>
          <select className="nodrag" value={data.type} onChange={setType}>
            <option value="sine">Sine</option>
            <option value="triangle">Triangle</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="square">Square</option>
          </select>
        </label>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
