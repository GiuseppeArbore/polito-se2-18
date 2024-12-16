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
      let edges = d.connections.collateral.map((c, index) => {
        return {
          id: (index + 1000).toString(),
          source: d._id!.toString(),
          target: c.toString(),
        };
      });
      edges = edges.concat(
        d.connections.direct.map((c, index) => {
          return {
            id: (index + 2000).toString(),
            source: d._id!.toString(),
            target: c.toString(),
          };
        })
      );
      edges = edges.concat(
        d.connections.projection.map((c, index) => {
          return {
            id: (index + 3000).toString(),
            source: d._id!.toString(),
            target: c.toString(),
          };
        })
      );
      edges = edges.concat(
        d.connections.update.map((c, index) => {
          return {
            id: (index + 4000).toString(),
            source: d._id!.toString(),
            target: c.toString(),
          };
        })
      );
      return edges;
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
