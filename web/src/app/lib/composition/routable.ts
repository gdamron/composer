import { BaseNode } from "./base";

export type ConnectionRate = "audio" | "event" | "constant";

export type Connection = {
  key: string;
  name: string;
  rate: ConnectionRate;
};

export type RoutableNode = BaseNode & {
  inlets: Connection[];
  outlets: Connection[];
};
