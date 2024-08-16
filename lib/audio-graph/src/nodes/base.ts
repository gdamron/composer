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

export type ConnectableNode = AudioNode | AudioParam;

export interface AudioGraphNode {
  /** A unique identifier for the node. */
  id: string;

  /** The node type. */
  type: AudioGraphNodeType;

  /** The underlying web audio nodes for this object. */
  nodes: { [key: string]: ConnectableNode };

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

export type NodesConnectionInput = AudioGraphConnection & {
  source: AudioGraphNode;
};

export const connectNodes = (params: NodesConnectionInput) => {
  const { source, target } = params;
  const { sourceSlot = source.defaultSlot, targetSlot = target.defaultSlot } =
    params;

  const sourceNode = source.nodes[sourceSlot] as AudioNode;
  if (!sourceNode) {
    throw Error(
      `Source node of type ${source.type} can connect with slot ${sourceSlot}`,
    );
  }

  const targetNode = target.nodes[targetSlot];

  if (targetNode as AudioNode) {
    sourceNode.connect(targetNode as AudioNode);
  } else if (targetNode as AudioParam) {
    sourceNode.connect(targetNode as AudioParam);
  } else {
    throw Error(`Invalid connection request to node ${target.id}`);
  }

  source.connections[sourceSlot]?.push(`${target.id}#${targetSlot}`);
};

export const disconnectNodes = (params: NodesConnectionInput) => {
  const { source, target } = params;
  const { sourceSlot = source.defaultSlot, targetSlot = target.defaultSlot } =
    params;

  const sourceNode = source.nodes[sourceSlot] as AudioNode;
  if (!sourceNode) {
    throw Error(
      `Source node of type ${source.type} and slot ${sourceSlot} does not support connections`,
    );
  }

  const connectionVal = `${target.id}#${targetSlot}`;
  const targetSlotIndex = source.connections[sourceSlot].indexOf(connectionVal);

  if (targetSlotIndex === -1) {
    throw Error(
      `Connection not found for target ${connectionVal} on GainGraphNode ${source.id}`,
    );
  }

  const targetNode = target.nodes[targetSlot];

  if (targetNode as AudioNode) {
    sourceNode.disconnect(targetNode as AudioNode);
  } else if (targetNode as AudioParam) {
    sourceNode.disconnect(targetNode as AudioParam);
  } else {
    throw Error(`Invalid connection request to node ${target.id}`);
  }

  source.connections[sourceSlot]?.splice(targetSlotIndex, 1);
};
