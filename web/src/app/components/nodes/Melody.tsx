import { useState } from "react";
import { NodeCard } from "./NodeCard";
import { Position } from "reactflow";

export interface ClockData {
  bpm: number;
}

export const Melody = ({ id, data }: { id: string; data: ClockData }) => {
  const [melody, setMelody] = useState([]);
  return (
    <NodeCard
      title="Melody"
      handles={[
        {
          id: "input#trigger",
          position: Position.Top,
          type: "target",
        },
        {
          id: "output#pitch",
          position: Position.Bottom,
          type: "source",
        },
      ]}
    >
      <label className="flex flex-col px-2 pt-1 pb-4">
        <div className="flex justify-end bg-inputbg py-2 pe-2 rounded-md">
          Melody {melody}
        </div>
      </label>
    </NodeCard>
  );
};
