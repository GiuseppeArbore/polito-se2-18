import {
  Card,
  Title,
  Text,
  Grid,
  Col,
  DateRangePicker,
  Metric,
  Subtitle,
  Bold,
  Italic,
  Select,
  SelectItem,
  TabGroup,
  TabList,
  Tab,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";
import API from "../API";
import { useState, useMemo, useEffect } from "react";
import { FormDialog } from "./form/Form";
import { MultiSelect, MultiSelectItem } from "@tremor/react";
import { DashboardMap, PreviewMap } from "./map/Map";
import { KxDocument } from "../model";

export default function Console() {
  const today = new Date(Date.now());
  const [groupKey, setGroupKey] = useState("1");
  const [selectedView, setSelectedView] = useState(0);

  const [documents, setDocuments] = useState<KxDocument[]>([]);
  const [entireMunicipalityCount, setEntireMunicipalityCount] = useState(0);
  const [newDocumentCreated, setNewDocumentCreated] = useState(true);
  const [documentsAssignedToAPoint, setDocumentsAssignedToAPoint] = useState<
    any[]
  >([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await API.getAllKxDocuments();
        setDocuments(response);

        let count = 0;
        const filteredDocuments = response.filter((doc) => {
          if (doc.doc_coordinates?.type === "EntireMunicipality") {
            count++;
            return false;
          }
          return true;
        });

        // Find the document which assigned to a point
        const documentsAssignedToPoints = response.filter((doc) => {
          if (doc.doc_coordinates?.type === "Point") return false;

          return true;
        });

        setEntireMunicipalityCount(count);
        setDocuments(filteredDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    if (newDocumentCreated) {
      fetchDocuments();
      setNewDocumentCreated(false);
    }
  }, [newDocumentCreated]);

  const drawing = {
    type: "FeatureCollection",
    features: documents.map((doc) => ({
      type: "Feature",
      geometry: doc.doc_coordinates,
      properties: {
        title: doc.title,
        description: doc.description,
      },
    })),
  };

  return (
    <main>
      <Title>Dashboard</Title>
      <Text>Explore Kiruna</Text>
      <div className="flex items-stretch mt-6">
        <TabGroup
          className="flex-1"
          onIndexChange={(index) => {
            setSelectedView(index);
          }}
        >
          <TabList>
            <Tab>Map</Tab>
            <Tab>List</Tab>
            <Tab>Timeline</Tab>
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
            <FormDialog setNewDocumentCreated={setNewDocumentCreated} />
            <Card>
              <Metric>KIRUNA</Metric>
              <Title>How to move a city</Title>
              <Subtitle>Mapping the process of Kiruna relocation.</Subtitle>
              <Text>
                Kiruna, a Swedish city, is being relocated in phases since 2010
                to prevent damage from mining activities.
              </Text>
            </Card>
            <Card className="hidden lg:block w-full h-40">
              <img
                src="/kiruna.png"
                alt="Kiruna"
                className="w-full h-full object-contain"
              />
            </Card>
          </div>
        </Col>
      </Grid>
      <Card className="mt-6">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div>Diagram Coming soon...</div>
        </div>
      </Card>
    </main>
  );
  function renderCurrentSelection(selectedView: number = 0) {
    switch (selectedView) {
      case 0:
        return (
          <>
            <DashboardMap
              style={{
                margin: 0,
                minHeight: "300px",
                width: "100%",
                height: "100%",
                borderRadius: 8,
              }}
              drawing={drawing}
              entireMunicipalityCount={entireMunicipalityCount}
            ></DashboardMap>
          </>
        );
      case 1:
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <div>Coming soon...</div>
            </div>
          </>
        );
      case 2:
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div>Coming soon...</div>
          </div>
        );
    }
  }
}
