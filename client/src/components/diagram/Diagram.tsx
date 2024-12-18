import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  ConnectionLineType,
  Panel,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";
import { KxDocument, KxDocumentAggregateData, Scale, ScaleOneToN } from "../../model";
import { Button } from "@tremor/react";
import { YAxis, XAxis } from "./Axes";
import API from "../../API";
import { ScaleType } from "../../enum";
import {CustomNode } from "./CustomNode";
import { da } from "date-fns/locale";

const nodeTypes = {
  yAxis: YAxis,
  xAxis: XAxis,
  custom: CustomNode,
};

interface FlowProps {
  documents: KxDocument[];
}
function Flow(props: FlowProps) {
  type TextualScale = Exclude<ScaleType, ScaleType.ONE_TO_N>;
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const [aggregateData, setAggregateData] = useState<KxDocumentAggregateData>( {
    scales: [],
    stakeholders: [],
    types: [],
  });
  const scales_const = [{type: ScaleType.BLUEPRINT_EFFECTS} as Scale, {type: ScaleType.TEXT} as Scale];
  const [scales, setScales] = useState<Scale[]>(scales_const);
  const nodeWidth = 75;
  const nodeHeight = 18;
  const [scalesByYear, setScaleByYear] = useState<
    Map<number, Map<TextualScale | number, number>>
  >(new Map());
  const [axes, setAxes] = useState<Node[]>([]);
  const [initialNodes] = useState<Node[]>([]);
  const [initialEdges] = useState<Edge[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = "LR"
  ) => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 0, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node: Node) => {
      const date = new Date((node.data as {date:Date}).date);  
      const yearWidth = (nodeWidth * 2);
      const scaleHeight = nodeHeight * 4;
      const margin = 20;
      const scaleHeightWithMargin = scaleHeight - margin;
      const nodeWithPosition = dagreGraph.node(node.id);
      const n = Math.random() * scaleHeightWithMargin;
      const x = nodeWithPosition.x + yearWidth * (Math.abs(Math.min(...Array.from(scalesByYear.keys())) - date.getFullYear()) + ((date.getMonth()+1)*30 + date.getDay())/365);
      const y = scaleHeight * (scales.findIndex((s)=> JSON.stringify(s) === JSON.stringify((node.data as {scale:Scale}).scale)));
      const y_random = y + nodeHeight + n + margin / 2;

      console.log(node)
      const newNode = {
        ...node,
        type: "custom",
        targetPosition: isHorizontal ? "left" : "top",
        sourcePosition: isHorizontal ? "right" : "bottom",
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        position: {
          x: x - nodeWidth,
          y: y_random,
        },
      };

      return newNode as Node;
    });

    return { nodes: newNodes, edges } as { nodes: Node[]; edges: Edge[] };
  };

  useMemo(async () => {
    const mapYearType: Map<
      number,
      Map<TextualScale | number, number>
    > = props.documents
      .map((d) => ({
        year: new Date(d.issuance_date.from).getFullYear(),
        scale: d.scale as Scale,
      }))
      .reduce<Map<number, Map<TextualScale | number, number>>>((acc, val) => {
        const yearMap =
          acc.get(val.year) || new Map<TextualScale | number, number>();
        const key =
          val.scale.type === ScaleType.ONE_TO_N
            ? val.scale.scale
            : val.scale.type;
        const count = yearMap.get(key) || 0;
        yearMap.set(key, count + 1);
        acc.set(val.year, yearMap);
        return acc;
      }, new Map<number, Map<TextualScale | number, number>>());

    setScaleByYear(mapYearType);
    const mapYearMaxDocuments: Map<number, number> = new Map(
      mapYearType.entries().map(([year, typeMap]) => {
        return [year, Math.max(...typeMap.values())];
      })
    );

    const minYear = Math.min(...mapYearMaxDocuments.keys());
    const maxYear = Math.max(...mapYearMaxDocuments.keys());
    const tmpYAxes = [...Array(Math.max(0, maxYear - minYear + 1)).keys()]
      .map(
        (v, i) =>
          ({
            id: `x_axis_${v + minYear}`,
            type: "yAxis",
            position: { x: i * nodeWidth * 2, y: 0 },
            draggable: false,
            selectable: false,
            data: {
              width: 100,
              height: nodeHeight * 4.4 * scales.length,
              label: (v + minYear).toString(),
            },
          } as Node)
      );
    const aggregateData = await API.getKxDocumentsAggregateData();
    setAggregateData(aggregateData);
    const tmpXAxes = [...scales,{type: ScaleType.ONE_TO_N, scale: -1}].map((s)=> {
      if(s.type === ScaleType.ONE_TO_N){
        return s.scale === -1? '' : s.scale.toString();
      } else if (s.type === ScaleType.TEXT){
        return "Text";
      } else if (s.type === ScaleType.BLUEPRINT_EFFECTS){
        return "Blueprint";
      } else {
        return "Unknown";
      }
    }).map((s, i) => (
      {
        id: `y_axis_${s}`,
        type: "xAxis",
        position: { x: -100, y: i * nodeHeight * 4  + 30 },
        draggable: false,
        selectable: false,
        data: {
          width: nodeWidth * 2.2 *  (maxYear - minYear + 1),
          height: 50,
          label: s.toString()
        }
      } as Node
    ));
    setAxes([...tmpYAxes, ...tmpXAxes]);
    let node_list: Node[] = props.documents
      .filter((d) => d._id !== undefined)
      .map((d) => {
        return {
          type: "custom",
          id: d._id!.toString(),
          position: {
            y: Math.floor(Math.random() * 300),
            x: Math.floor(Math.random() * 300),
          },
          data: {
            id: d._id!.toString(),
            label: d.scale.type,
            date: d.issuance_date.from,
            scale: d.scale,
            type: d.type,
          },
        };
      });

    let connections = props.documents.map((d, index_e) => {
      let a = Object.values(d.connections).map((c, index) => {
        return c.map((i: { toString: () => any }, index_i: number) => {
          const iDoc = props.documents.find((doc) => doc._id === i);
          return {
            id: (index_e * 10000 + index * 1000 + index_i).toString(),
            source: d.issuance_date.from < iDoc!.issuance_date.from ? d._id!.toString() : i.toString(),
            target: d.issuance_date.from > iDoc!.issuance_date.from ? d._id!.toString() : i.toString(),
            animated: true,
            type: ConnectionLineType.Bezier,
          };
        });
      });
      return a.flat();
    });
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      node_list,
      connections.flat()
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [props.documents]);
  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.Bezier, animated: true },
          eds
        )
      ),
    []
  );
  const onLayout = useCallback(
    (direction: string | undefined) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );
  useMemo(() => {
    setScales([...scales_const, ...aggregateData.scales.map((s) => {return {type: ScaleType.ONE_TO_N, scale: s} as Scale})]);
  }, [aggregateData]);
  return (
    <ReactFlow
      nodes={nodes.concat(axes)}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.Bezier}
      nodeTypes={nodeTypes}
      fitView
      style={{ backgroundColor: "#F7F9FB" }}
    >
      <Panel position="top-right">
        <Button onClick={() => onLayout("LR")}>Format Diagram</Button>
      </Panel>
      <Controls />
      <Background />
    </ReactFlow>
  );
}

export default Flow;
