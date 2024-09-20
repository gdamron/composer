"use client";

import { ReactNode } from "react";
import { Handle, HandleProps } from "reactflow";

export interface NodeCardProps {
  title: string;
  handles: HandleProps[];
  children: ReactNode;
}

export const NodeCard = ({ title, handles, children }: NodeCardProps) => {
  return (
    <div className="min-w-40">
      {handles.map((props, idx) => (
        <Handle key={props.id || idx} {...props} />
      ))}
      <div className="rounded-md bg-cardbg shadow-xl">
        <p className="rounded-t-md px-2 py-1 bg-accent text-white font-semibold text-sm">
          {title}
        </p>
        <div>{children}</div>
      </div>
    </div>
  );
};
