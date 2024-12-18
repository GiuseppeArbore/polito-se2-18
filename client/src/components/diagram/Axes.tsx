import { memo } from 'react';
import { Node, NodeProps } from "@xyflow/react"

 type Axes = Node<{
    width: number,
    height: number,
    label: string
}>;
 
export function YAxis({ data }: NodeProps<Axes>) {
    return (
        <div
            className="flex"
            style={{
                width: data.width,
                height: data.height,
            }}
        >
            <div
                style={{
                    width: 5,
                    height: data.height,
                    borderRadius: 999,
                    position: "relative",
                    overflow: "hidden",
                    borderLeft: "2.5px dashed #c0c8d2"
                }}
            >
            </div>
            <p className='ml-2'>{data.label}</p>
        </div>
    );
}

export function XAxis({ data }: NodeProps<Axes>) {
    return (
        <div
            style={{
            width: data.width,
            height: data.height,
            marginLeft: -100,
            }}
        >
            <p className='ml-2'>{data.label}</p>
            <div
                style={{
                    height: 2.5,
                    width: data.width,
                    borderRadius: 999,
                    borderTop: "2.5px dashed #c0c8d2"
                }}
            >
            </div>
        </div>
    );
}