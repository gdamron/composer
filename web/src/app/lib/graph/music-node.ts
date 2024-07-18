import { createDac } from "./dac";
import { createOsc } from "./oscillator";

export type MusicNodeType = "clock" | "dac" | "gain" | "osc";

export type MusicNodeRate = "audio" | "note" | "constant" | "none";

export type MusicNodeRouting = "input" | "internal";

export type MusicNodeProperty<T> = {
  value: T;
  name: string;
  rate: MusicNodeRate;
  id: string;
  routing: MusicNodeRouting;
};

export type MusicNodeBoolean = MusicNodeProperty<boolean>;
export type MusicNodeNumber = MusicNodeProperty<number>;
export type MusicNodeString = MusicNodeProperty<string>;

export type AnyMusicNodeProperty =
  | MusicNodeBoolean
  | MusicNodeNumber
  | MusicNodeString;

export type WebAudioNodeType = "clock" | "osc" | "gain" | "dac";

export type WebAudioGraph = {
  nodes: { [key: string]: AudioNode };
  edges: { [key: string]: string };
};

export interface MusicNode {
  id: string;
  type: MusicNodeType;
  properties: { [key: string]: AnyMusicNodeProperty };
  outputs: { [key: string]: MusicNodeRate };
  audioGraph: WebAudioGraph;
  parents: string[];
  children: string[];
}

export interface MusicGraph {
  root?: MusicNode;
  nodes: { [key: string]: MusicNode };
  edges: { [key: string]: string[] };
}

export interface MusicNodeConnection {
  node: MusicNode;
  propertyId: string;
}

export const MusicNodeActions = {
  connect(
    graph: MusicGraph,
    source: MusicNodeConnection,
    target: MusicNodeConnection,
  ) {},
  disconnect(
    graph: MusicGraph,
    source: MusicNodeConnection,
    target: MusicNodeConnection,
  ) {},
  update(node: MusicNode, property: AnyMusicNodeProperty) {},
};

type CreateNodeFunction = (graph: MusicGraph, ctc: AudioContext) => MusicNode;
const createFunctionMap: {
  [key in MusicNodeType]: CreateNodeFunction;
} = {
  clock: createDac,
  dac: createDac,
  gain: createDac,
  osc: createDac,
};
