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
  Position,
  ConnectionLineType,
  Panel,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";
import { KxDocument } from "../../model";
import { Button } from '@tremor/react';
import { on } from "events";

interface FlowProps {
  documents: KxDocument[];
}
function Flow(props: FlowProps) {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 36;
  const [initialNodes] = useState<Node[]>([]);
  const [initialEdges] = useState<Edge[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const getLayoutedElements = (nodes:Node[], edges:Edge[], direction = "LR") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node:Node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const newNode = {
        ...node,
        targetPosition: isHorizontal ? 'left' : 'top',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
   
      return newNode as Node;
    });

    return { nodes: newNodes, edges } as { nodes:Node[], edges:Edge[] };
  };

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
    
    let connections = props.documents.map((d, index_e) => {
      let a = Object.values(d.connections).map((c, index) => {
        return c.map((i: { toString: () => any }, index_i: number) => {
          return {
            id: (index_e * 10000 + index * 1000 + index_i).toString(),
            source: d._id!.toString(),
            target: i.toString(),
            animated: true,
            type: ConnectionLineType.SmoothStep,
          };
        });
      });
      return a.flat();
    });
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      node_list,
      connections.flat(),
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [props.documents]);
 
  
  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds,
        ),
      ),
    [],
  );
  const onLayout = useCallback(
    (direction: string | undefined) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);
 
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges],
  );
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}  
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      style={{ backgroundColor: "#F7F9FB" }}
    >
      <Panel position="top-right">
        <Button onClick={() => onLayout('LR')}>Format Diagram</Button>
      </Panel>
      <Controls />
      <Background />
    </ReactFlow>
  );
}

export default Flow;
