import { useCallback, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Node
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { KxDocument } from '../../model';

const doc_width = 2;
const min_width = 4;



const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];


interface FlowProps {
    documents: KxDocument[];
}
function Flow(props: FlowProps) {
    const mapYearType: Map<number, Map<string, number>> = props.documents.map(d => ({year: new Date(d.issuance_date.from).getFullYear(), type: d.type})).reduce<Map<number, Map<string, number>>>((acc, val) => {
        
        const yearMap = acc.get(val.year) || new Map<string, number>();
        const count = yearMap.get(val.type) || 0;
        yearMap.set(val.type, count + 1);
        acc.set(val.year, yearMap);
        return acc;
    }, new Map<number, Map<string, number>>());


    const mapYearMaxDocuments: Map<number, number> = new Map(mapYearType.entries().map( ([year, typeMap]) => {
        return [year, Math.max(...typeMap.values())];
    }));


    let initialNodes: Node[] = props.documents.filter(d => d._id !== undefined).map((d) => {
        return {
            id: d._id!.toString(),
            data: {
                label: d.title
            },
            position: {
                y: Math.random() * 100,
                x: Math.random() * 100
            }
        };
    });
    initialNodes = [{
        id: '1',
        data: { label: 'Node 1' },
        position: { x: 250, y: 50 }
    }];
    console.log(initialNodes);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    console.log(nodes);
    const onConnect = useCallback((params: any) => setEdges((eds: any) => addEdge(params, eds)), [setEdges]);

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