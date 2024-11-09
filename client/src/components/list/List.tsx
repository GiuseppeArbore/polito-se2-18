import 'ag-grid-enterprise';
import { ColDef, GridOptions } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useCallback, useMemo, useRef, useState } from "react";
import { KxDocument } from "../../model";
import locales from "../../locales.json";
import { Button, Flex } from '@tremor/react';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBinLine, RiEditLine, RiInfoI } from '@remixicon/react';
interface ListProps {
    documents: KxDocument[];
}

function List(props: ListProps) {
    const navigator = useNavigate();
    const gridRef = useRef<AgGridReact<KxDocument>>(null);
    const onFirstDataRendered = useCallback(() => {
        onGridReady();
        gridRef.current!.api.sizeColumnsToFit();
    }, []);
    const infoButton =  (str: String, doc: KxDocument) => {
                return (
                    <Flex justifyContent="between" className='mt-1'>
                        <Button size="xs" icon={RiInfoI} onClick={() => navigator('/documents/info')} />
                        <Button size="xs" icon={RiEditLine} onClick={() => {}} />
                        <Button size="xs" icon={RiDeleteBinLine} onClick={() => {}} />
                    </Flex>
                );
    }
    const [colDefs, _ ] = useState<ColDef<KxDocument>[]>([
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
        { headerName: "Controls", minWidth: 30, enableRowGroup: false, valueFormatter: () => { return ""}, cellRenderer: (val: { params: String; }) =>  infoButton(val.params, {} as KxDocument)  },

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