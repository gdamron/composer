import { AudioGraphNode } from "./base";
import { AudioGraphFactoryParameters } from "./factory";

export type DacGraphNodeParameters = {};

export interface DacGraphNode extends AudioGraphNode {
  type: "dac";
  defaultSlot: "dac";
  audioContext: AudioContext;
  nodes: {
    dac: AudioDestinationNode;
  };
}

export const createDac = (
  params: AudioGraphFactoryParameters,
): AudioGraphNode => {
  const { id, ctx } = params;

  if (!ctx.audioContext) {
    throw Error("AudioContext is required to create nodes.");
  }

  const dac = ctx.audioContext.destination;

  const node: DacGraphNode = {
    id,
    type: "dac",
    defaultSlot: "dac",
    audioContext: ctx.audioContext,
    nodes: { dac },
    connections: {},
    connect() {
      console.warn("A DAC node does not support connections.");
    },
    disconnect() {
      console.warn("A DAC node does not support connections.");
    },
    update() {
      console.warn("There are no values to update on a DAC node.");
    },
    destroy() {
      this.nodes.dac.disconnect();
    },
  };

  return node;
};
