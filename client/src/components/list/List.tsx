import 'ag-grid-enterprise';
import { ColDef, GridOptions } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useCallback, useMemo, useRef, useState } from "react";
import { KxDocument } from "../../model";
import locales from "../../locales.json";
interface ListProps {
    documents: KxDocument[];
}

function List(props: ListProps) {
    const gridRef = useRef<AgGridReact<KxDocument>>(null);
    const onFirstDataRendered = useCallback(() => {
        onGridReady();
        gridRef.current!.api.sizeColumnsToFit();
    }, []);;

    const [colDefs, _ ] = useState<ColDef<KxDocument>[]>([
        { headerName: "ID", minWidth: 100, enableRowGroup: true, valueFormatter: () => { return ""} },
        { headerName: "Title", field: "title", minWidth: 170, enableRowGroup: false,  filter: true, sortable: true },
        { headerName: "Stakeholders", field: "stakeholders", enableRowGroup: false,  filter: true,},
        { headerName: "Scale", field: "scale", enableRowGroup: true,  filter: true, valueFormatter: (params: { value: string | number; }) => {
             return params.value !== undefined ? "1:" + params.value.toLocaleString() : ""
        }},
        { headerName: "Issuance Date", field: "issuance_date", valueFormatter: (params: { value: string | number; }) => {
             return params.value !== undefined ? new Date(params.value).toLocaleDateString() : ""
        }},
        { headerName: "Type", field: "type", enableRowGroup: true,  filter: true},
        { headerName: "Language", field: "language", enableRowGroup: true,  filter: true, valueFormatter: (params: { value: string | number; }) => {
             return locales.find((l) => l.code === params.value)?.name || "" 
        }},
        { headerName: "Pages", field: "pages", enableRowGroup: false,  filter: true  },
    ]);
    const autoGroupColumnDef = {
        sortable: false,
        headerName: 'Group',
        minWidth: 200,
    };
    const gridOptions: GridOptions<KxDocument> = {
        columnDefs: colDefs,
        rowGroupPanelShow: 'always',
        animateRows: true,
        pagination: false,
        defaultColDef: {
            filter: true,
            flex: 1,
            resizable: true,
            sortable: true,
            enableRowGroup: true,

        },
        sideBar: {
            toolPanels: [
                {
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: 'agColumnsToolPanel',
                },
                {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
            ],
        },
        autoGroupColumnDef: autoGroupColumnDef,
    };

    function onGridReady() {
        gridRef.current!.api.sizeColumnsToFit();
    }

    const rowData = useMemo(() => {
        return props.documents;
    }, [props.documents]);

   

    const defaultColDef: ColDef = {
        flex: 1,
    };

    return (
        <div
            className={
                "ag-theme-quartz-auto-dark"
            }
            style={{ width: "100%", height: "100%" }}
        >
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                onFirstDataRendered={onFirstDataRendered}
                gridOptions={gridOptions}
                ref={gridRef}
                animateRows={true}
                rowSelection={{
                    mode: 'multiRow',
                  }}
            />
        </div>
    );
};


export default List;