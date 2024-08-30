import { AudioGraphNode, connectNodes, disconnectNodes } from "./base";
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
  inputs: {
    frequency: {
      key: "frequency";
      name: "Frequency";
      rate: "audio";
    };
    waveform: {
      key: "frequency";
      name: "Frequency";
      rate: "constant";
    };
  };
  outputs: {
    audio: {
      key: "audio";
      name: "Audio";
      rate: "audio";
    };
  };
}

export const createOscillator = (
  params: AudioGraphFactoryParameters,
): OscillatorGraphNode => {
  const { id, ctx } = params;

  if (!ctx.audioContext) {
    throw Error("AudioContext is required to create nodes.");
  }

  const defaultFreq = 440.0;
  const defaultWaveform = "sine";

  const osc = ctx.audioContext.createOscillator();
  const { frequency, waveform } = params as OscillatorGraphNodeParameters;
  osc.frequency.value = frequency ?? defaultFreq;
  osc.type = waveform ?? defaultWaveform;
  osc.start();

  const node: OscillatorGraphNode = {
    id,
    type: "osc",
    defaultSlot: "osc",
    nodes: { osc, freq: osc.frequency },
    connections: { osc: [] },
    inputs: {
      frequency: {
        key: "frequency",
        name: "Frequency",
        rate: "audio",
      },
      waveform: {
        key: "frequency",
        name: "Frequency",
        rate: "constant",
      },
    },
    outputs: {
      audio: {
        key: "audio",
        name: "Audio",
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
