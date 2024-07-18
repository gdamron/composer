"use client";

import { ReactNode } from "react";
import { Handle, HandleProps } from "reactflow";

type NodeCardHandleProps = HandleProps & { className?: string };

export interface NodeCardProps {
  title: string;
  handles: NodeCardHandleProps[];
  children: ReactNode;
}

export const NodeCard = ({ title, handles, children }: NodeCardProps) => {
  return (
    <div className="min-w-40">
      <div className="flex flex-row content-around w-full">
        {handles.map((props, idx) => (
          <Handle key={props.id || idx} {...props} />
        ))}
      </div>
      <div className="rounded-md bg-cardbg shadow-xl">
        <p className="rounded-t-md px-2 py-1 bg-accent text-white font-semibold text-sm">
          {title}
        </p>
        <div>{children}</div>
      </div>
    </div>
  );
};
