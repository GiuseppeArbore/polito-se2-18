import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
 
export function CustomEdge({
  id,
  data,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps & { data: { label: string } }) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  console.log(data);
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: getStrokeFromType(data.label) }} />
    </>
  );
}

const getStrokeFromType = (type: string) => {
    switch (type) {
        case 'direct':
            return "black";
        case 'collateral':
          return "green";
        case 'projection':
          return "blue";
        case 'update':
          return " brown";
        default:
            return "bg-black dark:bg-white";
    }
};