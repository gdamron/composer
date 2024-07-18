import { Position } from "reactflow";
import { AppStore, useStore } from "../../store";
import { ChangeEvent, useContext } from "react";
import { useShallow } from "zustand/react/shallow";
import { WebAudio, WebAudioContext } from "../../lib/WebAudioProvider";
import { NodeCard } from "./NodeCard";

export interface ClockData {
  frequency: number;
}

const selector = (ctx: WebAudio, id: string) => (store: AppStore) => ({
  setBpm: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(ctx, id, { frequency: +e.target.value / 60.0 }),
});

export const Clock = ({ id, data }: { id: string; data: ClockData }) => {
  const ctx = useContext(WebAudioContext);
  const { setBpm } = useStore(useShallow(selector(ctx, id)));

  return (
    <NodeCard
      title="Clock"
      handles={[
        {
          id: "clickOut",
          position: Position.Bottom,
          type: "source",
          className: "ml-[-25%]",
        },
        {
          id: "triggerOut",
          position: Position.Bottom,
          type: "source",
          className: "ml-[25%]",
        },
      ]}
    >
      <label className="flex flex-col px-2 pt-1 pb-4">
        <span className="text-xs font-bold my-2">Speed</span>
        <div className="flex justify-end bg-inputbg py-2 rounded-md">
          <input
            className="nodrag bg-transparent text-right grow"
            type="number"
            min="0"
            max="240"
            step="0.1"
            value={data.frequency * 60.0}
            onChange={setBpm}
          />
          <span className="text-left text-md pe-2">BPM</span>
        </div>
      </label>
    </NodeCard>
  );
};
