import { AudioGraphNode } from "./base";
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
    connect({ target, targetSlot }) {
      const tSlot = targetSlot ?? target.defaultSlot;
      const node = target.nodes[tSlot];
      if (node as AudioNode) {
        this.nodes.gain.connect(node as AudioNode);
      } else if (node as AudioParam) {
        this.nodes.gain.connect(node as AudioParam);
      }

      this.connections.gain.push(`${target.id}#${targetSlot}`);
    },
    disconnect({ target, targetSlot }) {
      const connectionVal = `${target.id}#${targetSlot}`;
      const slotIndex = this.connections.gain.indexOf(connectionVal);
      if (slotIndex == -1) {
        console.warn(
          `Connection not found for target ${target.id} on GainGraphNode ${this.id}`,
        );
        return;
      }

      const tSlot = targetSlot ?? target.defaultSlot;
      const node = target.nodes[tSlot];
      if (node as AudioNode) {
        this.nodes.gain.disconnect(node as AudioNode);
      } else if (node as AudioParam) {
        this.nodes.gain.disconnect(node as AudioParam);
      }

      this.connections.gain.splice(slotIndex, 1);
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
