import { nanoid } from "nanoid";
import { MusicGraph, MusicNode, MusicNodeConnection } from "./music-node";

export interface DacNode extends MusicNode {
  type: "dac";
  audioGraph: {
    nodes: {
      dac: AudioDestinationNode;
    };
    edges: {};
  };
}

export interface DacNodeConnection extends MusicNodeConnection {
  node: DacNode;
}

export function connectToDac(
  graph: MusicGraph,
  source: MusicNodeConnection,
  target: DacNodeConnection,
) {
  const node = source.node.audioGraph.nodes[source.propertyId];
  node.connect(target.node.audioGraph.nodes.dac);

  const edges = graph.edges[source.node.id] || [];
  graph.edges[source.node.id] = [...edges, target.node.id];
}

export function disconnectFromDac(
  graph: MusicGraph,
  source: MusicNodeConnection,
  target: DacNodeConnection,
) {
  const node = source.node.audioGraph.nodes[source.propertyId];
  node.disconnect(target.node.audioGraph.nodes.dac);

  const edges = graph.edges[source.node.id] || [];
  const index = edges.indexOf(source.node.id);
  if (index >= 0) {
    edges.splice(index, 1);
  }

  graph.edges[source.node.id] = edges;
}

export function createDac(graph: MusicGraph, ctx: AudioContext): DacNode {
  const node: DacNode = {
    id: nanoid(),
    type: "dac",
    properties: {},
    outputs: {},
    audioGraph: {
      nodes: {
        dac: ctx.destination,
      },
      edges: {},
    },
    parents: [],
    children: [],
  };

  graph.nodes[node.id] = node;

  return node;
}
