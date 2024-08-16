import { AudioGraphNode } from "./base";
import { AudioGraphFactoryParameters } from "./factory";

export interface OscillatorGraphNodeParameters {
  frequency: number;
  waveform: OscillatorType;
}

export interface OscillatorGraphNode extends AudioGraphNode {
  type: "osc";
  defaultSlot: "osc";
  nodes: {
    osc: OscillatorNode;
    freq: AudioParam;
  };
  connections: {
    osc: string[];
  };
}

export const createOscillator = (
  params: AudioGraphFactoryParameters,
): OscillatorGraphNode => {
  const { id, ctx } = params;

  console.log(params);

  if (!ctx.audioContext) {
    throw Error("AudioContext is required to create nodes.");
  }

  const osc = ctx.audioContext.createOscillator();
  const { frequency, waveform } = params as OscillatorGraphNodeParameters;
  osc.frequency.value = frequency ?? 440.0;
  osc.type = waveform ?? "sine";
  osc.start();

  const node: OscillatorGraphNode = {
    id,
    type: "osc",
    defaultSlot: "osc",
    nodes: { osc, freq: osc.frequency },
    connections: { osc: [] },
    connect({ target, targetSlot }) {
      const tSlot = targetSlot ?? target.defaultSlot;
      const targetNode = target.nodes[tSlot];

      if (targetNode as AudioNode) {
        this.nodes.osc.connect(targetNode as AudioNode);
      } else if (targetNode as AudioParam) {
        this.nodes.osc.connect(targetNode as AudioParam);
      } else {
        throw Error(`Invalide connection request to node ${target.id}`);
      }

      this.connections.osc.push(`${target.id}#${tSlot}`);
    },
    disconnect({ target, targetSlot }) {
      const connectionVal = `${target.id}#${targetSlot}`;
      const slotIndex = this.connections.osc.indexOf(connectionVal);
      if (slotIndex == -1) {
        console.warn(
          `Connection not found for target ${target.id} on GainGraphNode ${this.id}`,
        );
        return;
      }

      const tSlot = targetSlot ?? target.defaultSlot;
      const node = target.nodes[tSlot];
      if (node as AudioNode) {
        this.nodes.osc.disconnect(node as AudioNode);
      } else if (node as AudioParam) {
        this.nodes.osc.disconnect(node as AudioParam);
      }

      this.connections.osc.splice(slotIndex, 1);
    },
    update(params) {
      const { frequency, waveform } = params as OscillatorGraphNodeParameters;
      const osc = this.nodes.osc;
      osc.frequency.value = frequency ?? osc.frequency.value;
      osc.type = waveform ?? osc.type;
    },
    destroy() {
      const osc = this.nodes.osc;
      osc.stop();
      osc.disconnect();
    },
  };

  return node;
};
