import { Icon } from "@tremor/react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react"
import { KxDocumentType } from "../../enum";
import { KxDocument } from "../../model";
import { useNavigate } from "react-router-dom";
 type CustomNode = Node<{
    id: string,
    width: number,
    height: number,
    label: string, 
    type: KxDocumentType,
}>;
 
export function CustomNode({ data }: NodeProps<CustomNode>) {
    const navigator = useNavigate();
    return (<>
      <Handle type="target" position={Position.Left} />
      <div title={data.label} onClick={() => navigator(`/documents/${data.id}`)} className="flex items-center">
            <img src={getIconFromType(data.type)} alt={data.label} />
        </div>
      <Handle type="source" position={Position.Right} />
        
         </>
      
    );
}

const getIconFromType = (type: string) => {
    console.log(type);
    switch (type) {
        case KxDocumentType.INFORMATIVE:
            return '/InformativeDocument.png';
        case KxDocumentType.PRESCRIPTIVE:
            return '/PrescriptiveDocument.png';
        case KxDocumentType.DESIGN:
            return '/DesignDocument.png';
        case KxDocumentType.TECHNICAL:
            return '/TechnicalDocument.png';
        case KxDocumentType.STRATEGY:
            return '/Strategy.png';
        case KxDocumentType.AGREEMENT:
            return '/Agreement.png';
        case KxDocumentType.CONFLICT:
            return '/ConflictResolution.png';
        case KxDocumentType.CONSULTATION:
            return '/Consultation.png';
        default:
            return '/Default.png';
    }
};