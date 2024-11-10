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
import API from '../../API';
import { toast } from '../../utils/toaster';
import { ObjectId } from 'mongodb';
interface ListProps {
    documents: KxDocument[];
}

function List(props: ListProps) {
    const navigator = useNavigate();
    const gridRef = useRef<AgGridReact<KxDocument>>(null);
    const onFirstDataRendered = useCallback(() => {
        onGridReady();
    }, []);
    const infoButton = (rowNode: any) => {
        console.log(rowNode)
        return (
            <Flex justifyContent="evenly" className='mt-1'>
                <Button size="xs" icon={RiInfoI} onClick={() => navigator('/documents/' + rowNode.value)} />
                <Button size="xs" icon={RiDeleteBinLine} onClick={async () => {
                    try {
                        await API.deleteKxDocument(rowNode.value);
                        gridRef.current?.api?.applyTransaction({ remove: [rowNode.data] });
                        toast({
                            title: "Success",
                            description:
                              "The document has been delete successfully",
                            variant: "success",
                            duration: 3000,
                          })
                    } catch (error) {
                        toast({
                            title: "Error",
                            description: "Failed to delete documents",
                            variant: "error",
                            duration: 3000,
                          })
                    }
                }} />
            </Flex>
        );
    }
    const [colDefs, _] = useState<ColDef<KxDocument>[]>([
        { headerName: "Title", field: "title", enableRowGroup: false, filter: true, sortable: true },
        { headerName: "Stakeholders", field: "stakeholders", enableRowGroup: false, filter: true, },
        {
            headerName: "Scale", field: "scale", enableRowGroup: true, filter: true, valueFormatter: (params: { value: string | number; }) => {
                return params.value !== undefined ? "1:" + params.value.toLocaleString() : ""
            }
        },
        {
            headerName: "Issuance Date", field: "issuance_date", valueFormatter: (params: { value: string | number; }) => {
                return params.value !== undefined ? new Date(params.value).toLocaleDateString() : ""
            }
        },
        { headerName: "Type", field: "type", enableRowGroup: true, filter: true },
        {
            headerName: "Language", field: "language", enableRowGroup: true, filter: true, valueFormatter: (params: { value: string | number; }) => {
                return locales.find((l) => l.code === params.value)?.name || ""
            }
        },
        { headerName: "Pages", field: "pages", enableRowGroup: false, filter: true },
        { headerName: "Controls", field: '_id', minWidth: 30, enableRowGroup: false, cellRenderer: (params: any) => infoButton(params)},

    ]);
    const autoGroupColumnDef = {
        sortable: false,
        headerName: 'Group',
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
        const allColumnIds: string[] = [];
        gridRef.current!.api!.getColumns()!.forEach((column) => {
            allColumnIds.push(column.getId());
        });
        gridRef.current!.api!.autoSizeColumns(allColumnIds, false);
    }

    const rowData = useMemo(() => {
        return props.documents;
    }, [props.documents]);



    const defaultColDef: ColDef = {

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
                onGridReady={onGridReady}
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