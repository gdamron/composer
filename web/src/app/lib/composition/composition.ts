import { BaseNode, ConnectableNode, NodeSlot } from "./base";

export type EdgeIO = {
  uuid: string;
  slot: number;
};

export type Edge = {
  from: EdgeIO;
  to: EdgeIO;
};

export type CompositionNode = BaseNode & {
  documentVersion: string;
  metadata: {
    title: string;
    description: string;
  };
  nodes: BaseNode[];
  edges: Edge[];
};
