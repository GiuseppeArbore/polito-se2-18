import {
  Card,
  Title,
  Text,
  Grid,
  Col,
  Metric,
  Subtitle,
  TabGroup,
  TabList,
  Tab,
} from "@tremor/react";
import API from "../API";
import { useState, useEffect } from "react";
import { FormDialog } from "./form/Form";
import { DashboardMap } from "./map/Map";
import { Area, KxDocument, Point } from "../model";
import List from "./list/List";
import { Toaster } from "./toast/Toaster";
import { toast } from "../utils/toaster";
import { FeatureCollection } from "geojson";
import { Link } from "react-router-dom";
import { RiHome2Fill } from "@remixicon/react";
export default function Console() {
  const [documents, setDocuments] = useState<KxDocument[]>([]);
  const [selectedView, setSelectedView] = useState(0);
  const [refreshNeeded, setRefreshNeeded] = useState(true);
  const [entireMunicipalityDocuments, setEntireMunicipalityDocuments] =
    useState<KxDocument[]>([]);
  const [pointOrAreaDocuments, setPointOrAreaDocuments] = useState<
    KxDocument[]
  >([]);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await API.getAllKxDocuments();
        const entireMunicipalityDocs = docs.filter(
          (doc) => doc.doc_coordinates?.type === "EntireMunicipality"
        );
        const otherDocs = docs.filter(
          (doc) => doc.doc_coordinates?.type !== "EntireMunicipality"
        );

        setEntireMunicipalityDocuments(entireMunicipalityDocs);
        setPointOrAreaDocuments(otherDocs);
        setDocuments(docs);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to retrieve documents",
          variant: "error",
          duration: 3000,
        });
      }
    };
    if (refreshNeeded) {
      fetchDocuments();
      setRefreshNeeded(false);
    }
  }, [selectedView, refreshNeeded]);

  const drawing: FeatureCollection = {
    type: "FeatureCollection",
    features: pointOrAreaDocuments.map((doc) => ({
      type: "Feature",
      geometry: doc.doc_coordinates as Area | Point,
      properties: {
        title: doc.title,
        description: doc.description,
        id: doc._id,
      },
    })),
  };

  return (
    <main>
      <Title>
        <Link to="/" className="flex items-center">
          {" "}
          <span title="Return to Home">
            <RiHome2Fill
              className="text-white animate-pulse hover:scale-110 hover:shadow-lg transition-transform duration-300 pr-3 "
              size="32"
            />
          </span>
        </Link>
        Dashboard
      </Title>
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
            <FormDialog
              documents={documents}
              refresh={() => setRefreshNeeded(true)}
            />

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
      <Toaster />
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
              entireMunicipalityDocuments={entireMunicipalityDocuments}
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
              <List documents={documents} />
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
