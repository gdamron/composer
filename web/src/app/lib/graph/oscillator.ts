import { nanoid } from "nanoid";
import { MusicGraph, MusicNode, MusicNodeConnection } from "./music-node";

export interface OscNode extends MusicNode {
  type: "osc";
  audioGraph: {
    nodes: {
      osc: OscillatorNode;
    };
    edges: {};
  };
}

export interface OscNodeConnection extends MusicNodeConnection {
  node: OscNode;
}

export function connectToOsc(
  graph: MusicGraph,
  source: MusicNodeConnection,
  target: OscNodeConnection,
) {
  const node = source.node.audioGraph.nodes[source.propertyId];
  node.connect(target.node.audioGraph.nodes.osc);

  const edges = graph.edges[source.node.id] || [];
  graph.edges[source.node.id] = [...edges, target.node.id];
}

export function disconnectFromOsc(
  graph: MusicGraph,
  source: MusicNodeConnection,
  target: OscNodeConnection,
) {
  const node = source.node.audioGraph.nodes[source.propertyId];
  node.disconnect(target.node.audioGraph.nodes.osc);

  const edges = graph.edges[source.node.id] || [];
  const index = edges.indexOf(source.node.id);
  if (index >= 0) {
    edges.splice(index, 1);
  }

  graph.edges[source.node.id] = edges;
}

export function createOsc(graph: MusicGraph, ctx: AudioContext): OscNode {
  const freq = 440;
  const waveform = "sine";
  const osc = ctx.createOscillator();
  osc.frequency.value = freq;
  osc.type = waveform;

  const node: OscNode = {
    id: nanoid(),
    type: "osc",
    properties: {
      frequency: {
        id: "frequency",
        name: "Frequency",
        value: 440,
        rate: "audio",
        routing: "input",
      },
      type: {
        id: "type",
        name: "Type",
        value: "sine",
        rate: "audio",
        routing: "input",
      },
    },
    outputs: {
      audio: "audio",
    },
    audioGraph: {
      nodes: { osc },
      edges: {},
    },
    parents: [],
    children: [],
  };

  graph.nodes[node.id] = node;

  return node;
}
