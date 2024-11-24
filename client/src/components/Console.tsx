import {
  Card,
  Title,
  Text,
  Grid,
  Col,
  Metric,
  TabGroup,
  TabList,
  Tab,
} from "@tremor/react";
import "../css/dashboard.css"
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
import { RiHome2Fill, RiArrowRightSLine, RiArrowLeftSLine } from "@remixicon/react";
export default function Console() {
  const [documents, setDocuments] = useState<KxDocument[]>([]);
  const [selectedView, setSelectedView] = useState(0);
  const [refreshNeeded, setRefreshNeeded] = useState(true);
  const [entireMunicipalityDocuments, setEntireMunicipalityDocuments] =
    useState<KxDocument[]>([]);
  const [pointOrAreaDocuments, setPointOrAreaDocuments] = useState<
    KxDocument[]
  >([]);

  function getIconForType(type: string): string {
    switch (type) {
      case 'Informative Document':
        return 'icon-InformativeDocument';
      case 'Prescriptive Document':
        return 'icon-PrescriptiveDocument';
      case 'Design Document':
        return 'icon-DesignDocument';
      case 'Technical Document':
        return 'icon-TechnicalDocument';
      case 'Strategy':
        return 'icon-Strategy';
      case 'Agreement':
        return 'icon-Agreement';
      case 'Conflict Resolution':
        return 'icon-ConflictResolution';
      case 'Consultation':
        return 'icon-Consultation';
      default:
        return 'default-icon';
    }
  }
  const drawing: FeatureCollection = {
    type: "FeatureCollection",
    features: pointOrAreaDocuments.map((doc) => ({
      type: "Feature",
      geometry: doc.doc_coordinates as Area | Point,
      properties: {
        title: doc.title,
        description: doc.description,
        id: doc._id,
        type: doc.type,
        icon: getIconForType(doc.type)
      },
    })),
  };

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

  const [showSideBar, setShowSideBar] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main>
      <Title className="flex items-center">
        <Link to="/">
          {" "}
          <span title="Return to Home">
            <RiHome2Fill
              className="text-black dark:text-white animate-pulse hover:scale-110 hover:shadow-lg transition-transform duration-300 pr-3"
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
        <Col numColSpanLg={showSideBar ? 5 : 6}>
          <div className="h-full" style={{ display: 'flex', flexDirection: 'row' }}>
            <Col className="h-full w-full">
              <Card className="h-full p-0 m-0" style={{ margin: 0, padding: 0, minHeight: "500px" }}>
                {renderCurrentSelection(selectedView)}
              </Card>
            </Col>
            {!showSideBar &&
              <Col className="hider ml-2 hide-on-small">
                <i className="h-full" onClick={() => setShowSideBar(true)}><RiArrowLeftSLine className="h-full"></RiArrowLeftSLine></i>
              </Col>
            }
          </div>

        </Col>
        <Col numColSpanLg={1}>
          <div className="flex flex-row ">
            {showSideBar &&
              <Col className="hider mr-1 hide-on-small">
                <i className="h-full" onClick={() => setShowSideBar(false)}><RiArrowRightSLine className="h-full"></RiArrowRightSLine></i>
              </Col>
            }
            {(showSideBar || windowWidth <= 1024) &&
              <Col className="w-full">
                <div className="space-y-6">
                  <FormDialog
                    documents={documents}
                    refresh={() => setRefreshNeeded(true)}
                  />

                  <Card>
                    <Metric>KIRUNA</Metric>
                    <Title>Quick facts</Title>
                    <Text>
                      <ul className="list-disc list-inside">
                        <li>20,000 inhabitants</li>
                        <li>Located 140 km north of the Arctic Circle</li>
                        <li>Lowest recorded temperature -42 °C</li>
                        <li>45 days of Midnight Sun each year</li>
                        <li>21 days of Polar Night</li>
                        <li>Covered in snow for 8 months each year</li>
                      </ul>
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
            }

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

