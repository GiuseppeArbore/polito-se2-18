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
    TextInput,
} from "@tremor/react";
import { RiFileFill, RiFileInfoFill, RiFileTransferFill, RiFileSettingsFill, RiDraftFill, RiShakeHandsFill, RiFileSearchFill, RiFileCheckFill, RiFileChartFill, RiHome2Fill, RiArrowRightSLine, RiArrowLeftSLine } from "@remixicon/react";
import "../css/dashboard.css"
import API from "../API";
import { useState, useEffect, useMemo } from "react";
import { FormDialog } from "./form/Form";
import { DashboardMap } from "./map/Map";
import { Area, KxDocument, Point } from "../model";
import List from "./list/List";
import { Toaster } from "./toast/Toaster";
import { toast } from "../utils/toaster";
import { FeatureCollection } from "geojson";
import { Link } from "react-router-dom";
import { AdvancedFilterModel } from "ag-grid-enterprise";
import { Stakeholders } from "../enum";
import Flow from "./diagram/Diagram"
interface ConsoleProps {
    user: React.RefObject<{ email: string; role: Stakeholders } | null>;
}

const Console: React.FC<ConsoleProps> = ({ user }) => {
    const [quickFilterText, setQuickFilterText] = useState('');
    const [documents, setDocuments] = useState<KxDocument[]>([]);
    const [tmpDocuments, setTmpDocuments] = useState<KxDocument[]>([]);
    const [selectedView, setSelectedView] = useState(0);
    const [refreshNeeded, setRefreshNeeded] = useState(true);
    const [filterModel, setFilterModel] = useState<AdvancedFilterModel | undefined>(undefined);
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
                setDocuments(docs);
                setTmpDocuments(docs);
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
    }, [refreshNeeded]);


    useMemo(() => {
        const entireMunicipalityDocs = tmpDocuments.filter(
            (doc) => doc.doc_coordinates?.type === "EntireMunicipality"
        );
        const otherDocs = tmpDocuments.filter(
            (doc) => doc.doc_coordinates?.type !== "EntireMunicipality"
        );
        setEntireMunicipalityDocuments(entireMunicipalityDocs);
        setPointOrAreaDocuments(otherDocs);

    }, [tmpDocuments]);




    const [showSideBar, setShowSideBar] = useState(false);

    useEffect(() => {
        if (selectedView === 2) {
            setShowSideBar(true);
        } else {
            setShowSideBar(false);
        }
    }, [selectedView]);


    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);



    return (
        <main>
            <div className="flex items-stretch mt-7">
                <TabGroup
                    className="flex-1"
                    onIndexChange={(index) => {
                        setSelectedView(index);
                    }}
                >

                    <div style={{ position: 'relative' }}>
                        <div style={{ gridColumn: '11 / span 2', position: 'absolute', right: '0', marginTop: '-2.5rem' }}>
                            <FormDialog
                                documents={documents}
                                refresh={() => setRefreshNeeded(true)}
                                user={user}
                            />
                        </div>
                    </div>

                    <TabList style={{ marginTop: '-2.8rem' }}>
                        <Tab>Map</Tab>
                        <Tab>List</Tab>
                        <Tab>Timeline</Tab>
                    </TabList>
                </TabGroup>
            </div>

            <Grid numItemsLg={6} className="gap-6 mt-6">
                <Col numColSpanLg={showSideBar ? 5: 6}>
                    <div className="h-full" style={{ display: 'flex', flexDirection: 'row' }}>
                        <Col className="h-full w-full">
                            <Card className="h-full p-0 m-0" style={{
                                marginTop: '-1.5rem',
                                padding: 0,
                                minHeight: "300px",
                                width: "100%",
                                height: "83vh",
                            }}>
                                {renderCurrentSelection(selectedView)}
                            </Card>
                        </Col>
                        {!showSideBar &&
                            selectedView === 2 &&
                            <Col className="hider ml-2 hide-on-small ring-1 dark:ring-dark-tremor-ring ring-tremor-ring w-6 bg-[#D1DDE6] dark:bg-[#2D3748]" role="Button" style={{ height: '83vh', marginTop: '-1.5rem' }} >
                                <i className="h-full text-tremor-content dark:text-dark-tremor-content" onClick={() => setShowSideBar(true)}><RiArrowLeftSLine className="h-full" /></i>
                            </Col>
                        }
                    </div>
                </Col>
                <Col numColSpanLg={1}>
                    <div className="flex flex-row justify-center items-center" style={{
                        marginTop: '-1.5rem',
                        padding: 0,
                        minHeight: "300px",
                        width: "100%",
                        height: "83vh",
                    }}>
                        {showSideBar &&
                            selectedView === 2 &&
                            <Col className="hider mr-1 hide-on-small ring-1 dark:ring-dark-tremor-ring ring-tremor-ring w-6 bg-[#D1DDE6] dark:bg-[#2D3748]" role="Button" style={{ height: '83vh',marginLeft: '-1.2rem' }}>
                                <i className="h-full text-tremor-content dark:text-dark-tremor-content" onClick={() => setShowSideBar(false)}><RiArrowRightSLine className="h-full" /></i>
                            </Col>
                        }
                        {((showSideBar && selectedView === 2)) &&
                            <Col className="w-full h-full flex justify-center items-center">
                                <div className="flex flex-col items-center">
                                    <div className="flex justify-center items-center mb-2">
                                        <span className="font-semibold dark:text-white">Legend</span>
                                    </div>
                                    <Card className="mb-4 p-4 flex-1" style={{ width: '13rem', height: '48vh' }}>
                                        <div className="flex flex-col h-full">
                                            <div className="flex justify-center items-center mb-2">
                                                <span className="font-semibold dark:text-white text-sm">Document Types</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <RiFileInfoFill className="mr-2" style={{ color: '#163C89', fontSize: '1rem' }} />
                                                <span className="dark:text-white">Informative Document</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <RiFileTransferFill className="mr-2" style={{ color: '#163C89', fontSize: '1rem' }} />
                                                <span className="dark:text-white">Prescriptive Document</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <RiFileSettingsFill className="mr-2" style={{ color: '#163C89', fontSize: '1rem' }} />
                                                <span className="dark:text-white">Technical Document</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <RiDraftFill className="mr-2" style={{ color: '#163C89', fontSize: '1rem' }} />
                                                <span className="dark:text-white">Design Document</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <RiShakeHandsFill className="mr-2" style={{ color: '#163C89', fontSize: '1rem' }} />
                                                <span className="dark:text-white">Agreement</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <RiFileSearchFill className="mr-2" style={{ color: '#163C89', fontSize: '1rem' }} />
                                                <span className="dark:text-white">Consultation</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <RiFileCheckFill className="mr-2" style={{ color: '#163C89', fontSize: '1rem' }} />
                                                <span className="dark:text-white">Conflict Resolution</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <RiFileChartFill className="mr-2" style={{ color: '#163C89', fontSize: '1rem' }} />
                                                <span className="dark:text-white">Strategy</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <RiFileFill className="mr-2" style={{ color: '#163C89', fontSize: '1rem' }} />
                                                <span className="dark:text-white">Custom Document</span>
                                            </div>
                                        </div>
                                    </Card>
                                    <Card className="p-4 flex-1" style={{ width: '13rem', height: '25vh' }}>
                                        <div className="flex flex-col h-full">
                                            <div className="flex justify-center items-center mb-2">
                                                <span className="font-semibold dark:text-white text-sm">Connection Types</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <div className="w-5 h-0.5 bg-black dark:bg-white mr-2"></div>
                                                <span className="dark:text-white">Direct consequence</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <div className="w-5 h-0.5 border-t-2 border-dashed border-black dark:border-white mr-2"></div>
                                                <span className="dark:text-white">Collateral consequence</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <div className="w-5 h-0.5 mr-2 linea-punti"></div>
                                                <span className="dark:text-white">Projection</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-sm">
                                                <div className="w-5 h-0.5 mr-2 linea-alternata"></div>
                                                <span className="dark:text-white">Update</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </Col>
                        }
                    </div>
                </Col>

            </Grid>
            <Toaster />
        </main >
    );
    function renderCurrentSelection(selectedView: number = 0) {
        return (
            <>
                <DashboardMap
                    style={{
                        margin: 0,
                        minHeight: "300px",
                        width: "100%",
                        height: "100%",
                        borderRadius: 4,
                        display: selectedView === 0 ? 'block' : 'none',
                    }}
                    user={user}
                    drawing={drawing}
                    entireMunicipalityDocuments={entireMunicipalityDocuments}
                    isVisible={selectedView === 0 ? true : false}
                    setQuickFilterText={setQuickFilterText}
                />
                <div
                    className="ring-0 shadow-none"
                    style={{
                        display: selectedView === 1 ? 'flex' : 'none',
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <List user={user} documents={documents} updateDocuments={setTmpDocuments} updateFilterModel={setFilterModel} filterModel={filterModel} quickFilter={quickFilterText} />
                </div>
                <div
                    style={{
                        display: selectedView === 2 ? 'flex' : 'none',
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: 'auto'
                    }}
                >
                    <Flow documents={tmpDocuments} />
                </div>
            </>
        );
    }
}

export default Console;
