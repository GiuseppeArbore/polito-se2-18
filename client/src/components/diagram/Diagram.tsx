import { useCallback } from 'react';
import {
ReactFlow,
MiniMap,
Controls,
Background,
useNodesState,
useEdgesState,
addEdge,
Node } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { KxDocument } from '../../model';

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];


interface FlowProps {
    documents: KxDocument[];
}
function Flow(props: FlowProps) {
    
const initialNodes = props.documents.map((d)=>{
    return{
        id: d._id?.toString(),
        data: {
            label: d.title
        },
        position: {
            y: Math.random() * 10,
            x: Math.random() * 10 
        }
    } as Node;
});

const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

const onConnect = useCallback((params:any) => setEdges((eds:any) => addEdge(params, eds)), [setEdges]);

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