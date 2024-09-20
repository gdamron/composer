export type NodeType =
  | "adc"
  | "author"
  | "clock"
  | "dac"
  | "composition"
  | "gain"
  | "oscillator"
  | "reference";

export type SlotRate = "audio" | "control" | "constant";

export type NodeSlot = {
  name: string;
  rate: SlotRate;
};

export type BaseNode = {
  version: string;
  uuid: string;
  type: NodeType;
  metadata: { [key: string]: unknown };
};

export type NodeConnection = {
  source: ConnectableNode;
  from: NodeSlot;
  to: NodeSlot;
};

export type ConnectableNode = BaseNode & {
  inputs: NodeSlot[];
  outputs: NodeSlot[];

  connect: (connection: NodeConnection) => void;
  disconnect: (connection: NodeConnection) => void;
};
