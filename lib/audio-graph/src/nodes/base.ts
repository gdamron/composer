import { DacGraphNodeParameters } from "./dac";
import { GainGraphNodeParameters } from "./gain";
import { OscillatorGraphNodeParameters } from "./oscillator";

export type AudioGraphNodeType = "osc" | "gain" | "dac";

export type AudioGraphNodeParameters =
  | DacGraphNodeParameters
  | GainGraphNodeParameters
  | OscillatorGraphNodeParameters;

export type AudioGraphConnection = {
  target: AudioGraphNode;
  targetSlot?: string;
  sourceSlot?: string;
};

export interface AudioGraphNode {
  /** A unique identifier for the node. */
  id: string;

  /** The node type. */
  type: AudioGraphNodeType;

  /** The underlying web audio nodes for this object. */
  nodes: { [key: string]: AudioNode | AudioParam };

  /** A map of connections with other nodes. */
  connections: { [key: string]: string[] };

  /** The default slot the nodes uses when working with connections. */
  defaultSlot: string;

  /** Establishes a connection with another node, if permitted by the target. */
  connect: (params: AudioGraphConnection) => void;

  /** Removes a connection with another node. */
  disconnect: (params: AudioGraphConnection) => void;

  /** Updates one or more values used by the node. */
  update: (params: Partial<AudioGraphNodeParameters>) => void;

  /** Destroys all web audio resources for the node, at which point it is no longer usable. */
  destroy: () => void;
}
