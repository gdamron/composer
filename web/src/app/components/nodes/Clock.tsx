import { WebAudio } from "@audio-graph";
import { AppStore, useStore } from "../../store";
import { ChangeEvent, useContext } from "react";
import { WebAudioContext } from "../../lib";
import { useShallow } from "zustand/react/shallow";
import { NodeCard } from "./NodeCard";
import { Position } from "reactflow";

export interface ClockData {
  bpm: number;
}

const selector = (ctx: WebAudio, id: string) => (store: AppStore) => ({
  setBpm: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(ctx, id, { bpm: +e.target.value }),
});

export const Clock = ({ id, data }: { id: string; data: ClockData }) => {
  const ctx = useContext(WebAudioContext);
  const { setBpm } = useStore(useShallow(selector(ctx, id)));

  return (
    <NodeCard
      title="Clock"
      handles={[
        {
          id: "output#trigger",
          position: Position.Bottom,
          type: "source",
        },
      ]}
    >
      <label className="flex flex-col px-2 pt-1 pb-4">
        <span className="text-xs font-bold my-2">Bpm</span>
        <div className="flex justify-end bg-inputbg py-2 pe-2 rounded-md">
          <input
            className="nodrag bg-transparent text-right grow"
            type="number"
            min="0"
            max="240"
            step="0.1"
            value={data.bpm}
            onChange={setBpm}
          />
        </div>
      </label>
    </NodeCard>
  );
};
