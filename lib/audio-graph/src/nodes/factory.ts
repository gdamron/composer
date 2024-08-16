import { WebAudio } from "../context";
import {
  AudioGraphNode,
  AudioGraphNodeParameters,
  AudioGraphNodeType,
} from "./base";
import { createDac } from "./dac";
import { createGain } from "./gain";
import { createOscillator } from "./oscillator";

export type AudioGraphFactoryParameters = Partial<AudioGraphNodeParameters> & {
  ctx: WebAudio;
  id: string;
};

const factories: Record<
  AudioGraphNodeType,
  (params: AudioGraphFactoryParameters) => AudioGraphNode
> = {
  dac: createDac,
  gain: createGain,
  osc: createOscillator,
};

export type AudioGraphCreateNodeParameters = AudioGraphFactoryParameters & {
  type: AudioGraphNodeType;
};

export const createAudioGraphNode = (
  params: AudioGraphCreateNodeParameters,
): AudioGraphNode => factories[params.type](params);
