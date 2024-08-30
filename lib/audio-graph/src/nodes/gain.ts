import { AudioGraphNode, connectNodes, disconnectNodes } from "./base";
import { AudioGraphFactoryParameters } from "./factory";

export type GainGraphNodeParameters = {
  gain: number;
};

export interface GainGraphNode extends AudioGraphNode {
  type: "gain";
  defaultSlot: "gain";
  nodes: {
    gain: GainNode;
  };
  connections: {
    gain: string[];
  };
  inputs: {
    gain: {
      key: "gain";
      name: "Gain";
      rate: "audio";
    };
  };
  outputs: {
    gain: {
      key: "gain";
      name: "Gain";
      rate: "audio";
    };
  };
}

export const createGain = (
  params: AudioGraphFactoryParameters,
): GainGraphNode => {
  const { id, ctx } = params;

  if (!ctx.audioContext) {
    throw Error("AudioContext is required to create nodes.");
  }

  const gain = ctx.audioContext.createGain();

  const gainParams = params as GainGraphNodeParameters;
  gain.gain.value = gainParams?.gain ?? 0.0;

  const node: GainGraphNode = {
    id,
    type: "gain",
    defaultSlot: "gain",
    nodes: { gain },
    connections: {
      gain: [],
    },
    inputs: {
      gain: {
        key: "gain",
        name: "Gain",
        rate: "audio",
      },
    },
    outputs: {
      gain: {
        key: "gain",
        name: "Gain",
        rate: "audio",
      },
    },
    connect(params) {
      connectNodes({
        ...params,
        source: this,
      });
    },
    disconnect(params) {
      disconnectNodes({
        ...params,
        source: this,
      });
    },
    update(params) {
      const { gain } = params as GainGraphNodeParameters;

      if (gain !== undefined) {
        this.nodes.gain.gain.value = gain;
      }
    },
    destroy() {
      this.nodes.gain.disconnect();
    },
  };

  return node;
};
