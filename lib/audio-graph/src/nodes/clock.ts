import { ControlEventCoordinator } from "../events/coordinator";
import { AudioGraphNode, connectNodes, disconnectNodes } from "./base";
import { AudioGraphFactoryParameters } from "./factory";

export interface ClockGraphNodeParameters {
  bpm: number;
}

export interface ClockGraphNode extends AudioGraphNode {
  type: "clock";
  defaultSlot: "trigger";
  audioContext: AudioContext;
  eventCoordinator: ControlEventCoordinator;
  nodes: {
    osc: OscillatorNode;
  };
  connections: {
    trigger: string[];
  };
  inputs: {
    bpm: {
      key: "bpm";
      name: "BPM";
      rate: "constant";
    };
  };
  outputs: {
    tick: {
      key: "tick";
      name: "Tick";
      rate: "control";
    };
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

  if (!ctx.eventCoordinator) {
    throw Error("ControlEventCoordinator is required to create nodes");
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
    eventCoordinator: ctx.eventCoordinator,
    nodes: { osc },
    connections: { trigger: [] },
    inputs: {
      bpm: {
        key: "bpm",
        name: "BPM",
        rate: "constant",
      },
    },
    outputs: {
      tick: {
        key: "tick",
        name: "Tick",
        rate: "control",
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

      const freq = osc.frequency.value;

      // ensure a finite value stop time
      const stopTime = freq > 0 ? ctx.currentTime + 1.0 / freq : undefined;
      osc.stop(stopTime);

      osc.onended = () => {
        this.eventCoordinator.emit({
          name: "clock#tick",
          source: this,
          data: {
            bpm: this.nodes.osc.frequency.value * 60.0,
            time: Date.now(),
          },
        });

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
