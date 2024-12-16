import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { KxDocument } from "../../model";
import { set } from "date-fns";

interface FlowProps {
  documents: KxDocument[];
}
function Flow(props: FlowProps) {
  const [initialNodes] = useState<Node[]>([]);
  const [initialEdges] = useState<Edge[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useMemo(() => {
    let node_list: Node[] = props.documents
      .filter((d) => d._id !== undefined)
      .map((d) => {
        return {
          id: d._id!.toString(),
          position: {
            y: Math.floor(Math.random() * 300),
            x: Math.floor(Math.random() * 300),
          },
          data: {
            label: d.title,
          },
        };
      });
    setNodes(node_list);
    let connections = props.documents.map((d) => {
      let a = Object.values(d.connections).map((c, index) => {
        return c.map((i: { toString: () => any; }, index_i: number) => {
          return {
            id: (index*1000 + index_i ).toString(),
            source: d._id!.toString(),
            target: i.toString(),
          };
        });
      });
      return a.flat();
    });
    setEdges(connections.flat());

  }, [props.documents]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
}

export default Flow;
