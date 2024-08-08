import { nanoid } from "nanoid";
import { MusicGraph, MusicNode, MusicNodeConnection } from "./music-node";

export interface ClockNode extends MusicNode {
  type: "clock";
  audioGraph: {
    nodes: {
      osc: OscillatorNode;
    };
    edges: {};
  };
}

export interface ClockNodeConnection extends MusicNodeConnection {
  node: ClockNode;
}

export function connectToClock(
  _graph: MusicGraph,
  _source: MusicNodeConnection,
  _target: ClockNodeConnection,
) {
  throw Error(
    "Cannot connect since clock does not support incoming connections.",
  );
}

export function disconnectFromClock(
  _graph: MusicGraph,
  _source: MusicNodeConnection,
  _target: ClockNodeConnection,
) {
  throw Error(
    "Cannot disconnect since clock does not support incoming connections.",
  );
}

export function createClock(graph: MusicGraph, ctx: AudioContext): ClockNode {
  // set to 60 bpm or 1 Hz by default
  const bpm = 60.0;
  const freq = bpm / 60.0;
  const waveform = "sine";
  const osc = ctx.createOscillator();
  osc.frequency.value = freq;
  osc.type = waveform;

  const node: ClockNode = {
    id: nanoid(),
    type: "clock",
    properties: {
      bpm: {
        id: "bpm",
        name: "BPM",
        value: bpm,
        rate: "constant",
        routing: "internal",
      },
    },
    outputs: {
      trigger: "note",
    },
    audioGraph: {
      nodes: { osc },
      edges: {},
    },
    parents: [],
    children: [],
  };

  graph.nodes[node.id] = node;

  return node;
}
