import { Card, Title, Text, Grid, Col, DateRangePicker, Metric, Subtitle, Bold, Italic, Select, SelectItem, TabGroup, TabList, Tab, DateRangePickerItem, DateRangePickerValue } from "@tremor/react";
import { useState, useMemo, useEffect } from "react";
import { FormDialog } from "./form/Form";
import { MultiSelect, MultiSelectItem } from '@tremor/react';
import { PreviewMap } from "./map/Map";
import List from "./list/List";
import { KxDocument } from "../model";
import API from "../API";
import { Toaster } from "./toast/Toaster";
import { toast } from "../utils/toaster";


export default function Console() {
    const [documents, setDocuments] = useState<KxDocument[]>([]);
    const [selectedView, setSelectedView] = useState(0);
    useEffect(() => {
          const fetchDocuments = async () => {
            try {
              const docs = await API.getAllKxDocuments();
              setDocuments(docs);
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to retrieve documents",
                variant: "error",
                duration: 3000,
              })
            }
          };
          fetchDocuments();
      }, [selectedView]);

    return (
        <main>
            <Title>Dashboard</Title>
            <Text>Explore Kiruna</Text>
            <div className="flex items-stretch mt-6">
                <TabGroup className="flex-1" onIndexChange={(index) => { setSelectedView(index) }}>
                    <TabList>
                        <Tab>
                            Map
                        </Tab>
                        <Tab>
                            List
                        </Tab>
                        <Tab>
                            Timeline
                        </Tab>
                    </TabList>
                </TabGroup>
            </div>
            <Grid numItemsLg={6} className="gap-6 mt-6">
                <Col numColSpanLg={5}>
                    <Card className="h-full p-0 m-0" style={{ margin: 0, padding: 0 }}>
                        {renderCurrentSelection(selectedView)}
                    </Card>
                </Col>

                <Col numColSpanLg={1}>
                    <div className="space-y-6">
                        <FormDialog documents={documents} />

                        {/* <Card>
                            <Text>Select</Text>
                            <Select
                                className="mt-2" value={groupKey} onValueChange={setGroupKey}
                            >
                                <SelectItem value="1">
                                    1
                                </SelectItem>
                                <SelectItem value="2">
                                    2
                                </SelectItem>
                                <SelectItem value="3">
                                    3
                                </SelectItem>
                                <SelectItem value="4">
                                    4
                                </SelectItem>
                                <SelectItem value="5">
                                    5
                                </SelectItem>
                            </Select>
                        </Card> */}
                        <Card>
                            <Metric>KIRUNA</Metric>
                            <Title>How to move a city</Title>
                            <Subtitle>Mapping the process of Kiruna relocation.</Subtitle>
                            <Text>
                                Kiruna, a Swedish city, is being relocated in phases since 2010 to prevent damage from mining activities.
                            </Text>
                        </Card>
                        <Card className="hidden lg:block w-full h-40">
                            <img src="/kiruna.png" alt="Kiruna" className="w-full h-full object-contain" />
                        </Card>
                    </div>
                </Col>

            </Grid>
            <Card className="mt-6">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div>Diagram Coming soon...</div>
                </div>
            </Card>
            <Toaster/>
        </main >
    );
    function renderCurrentSelection(selectedView: number = 0) {
        switch (selectedView) {
            case 0:
                return (
                    <>
                        <PreviewMap
                            style={{ margin: 0, minHeight: "300px", width: "100%", height: "100%", borderRadius: 8 }}
                            drawing={undefined}
                        ></PreviewMap>
                    </>
                );
            case 1:
                return (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                           <List documents={documents} />
                        </div>
                    </>
                );
            case 2:
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div>Coming soon...</div>
                    </div>
                );
        }

    }
}