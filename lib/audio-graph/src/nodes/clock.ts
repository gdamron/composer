import { AudioGraphNode, connectNodes, disconnectNodes } from "./base";
import { AudioGraphFactoryParameters } from "./factory";

export interface ClockGraphNodeParameters {
  bpm: number;
}

export interface ClockGraphNode extends AudioGraphNode {
  type: "clock";
  defaultSlot: "trigger";
  audioContext: AudioContext;
  nodes: {
    osc: OscillatorNode;
  };
  connections: {
    trigger: string[];
  };
  start: () => void;
  reset: () => void;
}

export const createClock = (
  params: AudioGraphFactoryParameters,
): ClockGraphNode => {
  const { id, ctx } = params;

  if (!ctx.audioContext) {
    throw Error("AudioContext is required to create nodes.");
  }

  const { bpm = 60.0 } = params as ClockGraphNodeParameters;
  const freq = bpm / 60.0;
  const waveform = "sawtooth";

  const osc = ctx.audioContext.createOscillator();
  osc.frequency.value = freq;
  osc.type = waveform;

  const node: ClockGraphNode = {
    id,
    type: "clock",
    defaultSlot: "trigger",
    audioContext: ctx.audioContext,
    nodes: { osc },
    connections: { trigger: [] },
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
      console.log(params);
      const { bpm = 60.0 } = params as ClockGraphNodeParameters;
      const freq = bpm / 60.0;

      const osc = this.nodes.osc;
      osc.frequency.value = freq;

      this.reset();
      this.start();
    },
    destroy() {
      const osc = this.nodes.osc;
      osc.onended = null;
      osc.stop();
      osc.disconnect();
    },
    start() {
      const osc = this.nodes.osc;
      const ctx = this.audioContext;

      osc.start();
      osc.stop(ctx.currentTime + 1.0 / osc.frequency.value);
      osc.onended = () => {
        console.log(
          `clock ${node.id} triggered at ${node.audioContext.currentTime}`,
        );

        this.reset();
        this.start();
      };
    },
    reset() {
      const oldOsc = this.nodes.osc;
      oldOsc.onended = null;
      oldOsc.stop();

      const newOsc = this.audioContext.createOscillator();
      newOsc.frequency.value = oldOsc.frequency.value;
      newOsc.type = "sawtooth";

      this.nodes.osc = newOsc;
    },
  };

  node.start();

  return node;
};
