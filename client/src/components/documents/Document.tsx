
import { RiShareLine, RiFileCopyLine, RiCheckDoubleLine, RiHome3Line, RiEditBoxLine, RiCamera2Fill, RiFilePdf2Fill, RiDeleteBinLine, RiAddBoxLine, RiInfoI } from '@remixicon/react';
import { Button, Card, Dialog, DialogPanel } from '@tremor/react';
import { FormDialog, FormDocumentDescription, FormDocumentInformation, FormDocumentConnections } from "../form/Form";
import { FileUpload } from "../form/DragAndDrop";
import DeleteResourceDialog from './DeleteResourcesDialog';
import API from '../../API';
import mime from 'mime';
import { FormDocumentGeolocalization } from '../form/Form';
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionList
} from '@tremor/react';
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentPageMap, PreviewMap } from '../map/Map';
import { KxDocument, DocCoords, Scale, ScaleOneToN } from "../../model";
import { mongoose } from '@typegoose/typegoose';
import "../../css/document.css";
import PreviewDoc from './Preview';
import { Toast } from '@radix-ui/react-toast';
import { Toaster } from '../toast/Toaster';
import { AreaType, KxDocumentType, ScaleType, Stakeholders } from "../../enum";
import {
    parseLocalizedNumber,
    PageRange,
    validatePageRangeString,
} from "../../utils";
import { toast } from "../../utils/toaster";
import locales from "../../locales.json"
import exp from 'constants';
import { DateRange } from '../form/DatePicker';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { set } from 'date-fns';
import Kiruna from "../map/KirunaMunicipality.json";

interface DocumentProps {
    user: { email: string; role: Stakeholders } | null;
}

interface FormDialogProps {
    documents: KxDocument[];
    refresh: () => void;
}


export default function Document({ user }: DocumentProps) {
    const formatLocalDate = (date: Date) => {
        return date.toLocaleDateString('sv-SE'); // 'sv-SE' è un formato ISO-like
    };

    const canEdit = user && user.role === Stakeholders.URBAN_PLANNER;

    const navigate = useNavigate();
    const { id } = useParams<string>();
    const [fileTitle, setFileTitle] = useState<string | undefined>(undefined);
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [doc, setDoc] = useState<KxDocument | null>(null);
    const [share, setShare] = useState(false);
    const [drawings, setDrawings] = useState<any>();
    const [title, setTitle] = useState("");
    const [stakeholders, setStakeholders] = useState<string[]>([]);
    const [scale, setScale] = useState<Scale>({ type: ScaleType.TEXT });
    const [issuanceDate, setIssuanceDate] = useState<DateRange | undefined>(undefined);
    const [type, setType] = useState<string | undefined>(undefined);
    const [language, setLanguage] = useState<string | undefined>(undefined);
    const [pages, setPages] = useState<PageRange[] | undefined>(undefined);
    const [pageRanges, setPageRanges] = useState<PageRange[] | undefined>(undefined);
    const [description, setDescription] = useState<string | undefined>(undefined);
    const [entireMunicipality, setEntireMunicipality] = useState(false);
    const [docCoordinates, setDocCoordinates] = useState<DocCoords | undefined>(undefined);
    const [documents, setDocuments] = useState<KxDocument[]>([]);
    const [documentsForDirect, setDocumentsForDirect] = useState<string[]>([]);
    const [documentsForCollateral, setDocumentsForCollateral] = useState<string[]>([]);
    const [documentsForProjection, setDocumentsForProjection] = useState<string[]>([]);
    const [documentsForUpdate, setDocumentsForUpdate] = useState<string[]>([]);
    const [saveDrawing, setSaveDrawing] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [updateHideMap, setUpdateHideMap] = useState(false);



    const handleSubmitDragAndDrop = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (files.length > 0) {
                const FileUpload = await API.addAttachmentToDocument(new mongoose.Types.ObjectId(id), files);
                if (!FileUpload) {
                    toast({
                        title: "Error",
                        description: "Failed to upload files",
                        variant: "error",
                        duration: 3000,
                    })
                }
            }

        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to upload files",
                variant: "error",
                duration: 3000,
            })
        }

        files.forEach((f) => doc?.attachments?.push(f.name));
        toast({
            title: "Upload files",
            description: "Original resources updated succesfully",
            variant: "success",
            duration: 3000
        })

        setIsDragAndDropOpen(false);

    };


    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const document = await API.getKxDocumentById(new mongoose.Types.ObjectId(id!));
                const docs = await API.getAllKxDocuments();
                setDoc(document);
                setDocuments(docs);
                setTitle(document.title);
                setStakeholders(document.stakeholders);
                setScale(document.scale as ScaleOneToN);
                setIssuanceDate({ from: document.issuance_date.from, to: document.issuance_date.to });
                setType(document.type);
                setLanguage(document.language || undefined);
                setPages(document.pages || undefined);
                setDescription(document.description || undefined);
                setDocCoordinates(document.doc_coordinates as DocCoords);
                setDocumentsForDirect(document.connections.direct.map((doc) => doc.toString()));
                setDocumentsForCollateral(document.connections.collateral.map((doc) => doc.toString()));
                setDocumentsForProjection(document.connections.projection.map((doc) => doc.toString()));
                setDocumentsForUpdate(document.connections.update.map((doc) => doc.toString()));
                setPageRanges([]);


                if (document.doc_coordinates.type !== "EntireMunicipality") {
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

                    const geoJSON = {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                geometry: document.doc_coordinates,
                                properties: {
                                    title: document.title,
                                    description: document.description,
                                    id: document._id,
                                    type: document.type,
                                    icon: getIconForType(document.type)
                                }
                            }
                        ]
                    };
                    setDrawings(geoJSON);
                } else {
                    setUpdateHideMap(true);
                    setEntireMunicipality(true);
                }


            } catch (error) {
                console.error("Failed to fetch document:", error);
                navigate("/404");
            }
        };

        fetchDocument();
    }, [id]);

    const handleSaveDrawing = async () => {
        if (drawings || updateHideMap) {
            let draw: DocCoords;
            if (
                !updateHideMap &&
                drawings &&
                drawings.features.length === 1 &&
                drawings.features[0].geometry.type === "Point"
            ) {
                draw = {
                    type: AreaType.POINT,
                    coordinates: drawings.features[0].geometry.coordinates,
                };
            } else if (!updateHideMap && (drawings && drawings.features.length >= 1) && drawings.features[0].geometry.type === "Polygon") {
                let cord =
                    drawings.features.map((f: any) => f.geometry.coordinates).length === 1
                        ? drawings.features[0].geometry.coordinates
                        : [];

                draw = {
                    type: AreaType.AREA,
                    coordinates: cord as number[][][],
                };
            } else {
                draw = {
                    type: AreaType.ENTIRE_MUNICIPALITY,
                };
            }
            try {
                const res = await API.updateKxDocumentInformation(id!, undefined, undefined, undefined, undefined, undefined, undefined, draw);
                if (res) {
                    console.log("Success toast should appear");
                    toast({
                        title: "Success",
                        description:
                            "The document has been updated successfully",
                        variant: "success",
                        duration: 3000,
                    });
                } else {
                    console.log("Error toast should appear");
                    toast({
                        title: "Error",
                        description: "Failed to update document",
                        variant: "error",
                        duration: 3000,
                    });
                }
            } catch (error) {
                console.log("Error toast should appear in catch");
                toast({
                    title: "Error",
                    description: "Failed to update document",
                    variant: "error",
                    duration: 3000,
                });
            };
        }
    };
    const [showCheck, setShowCheck] = useState(false);
    const [deleteOriginalResourceConfirm, setDeleteOriginalResourceConfirm] = useState(false);
    const [selectedResource, setSelectedResource] = useState<string>("");
    const [isDragAndDropOpen, setIsDragAndDropOpen] = useState(false);
    const [isUpdateConnectionsOpen, setIsUpdateConnectionsOpen] = useState(false);

    return (
        <div>
            <div className='flex flex-row mb-2'>
                <i onClick={() => navigate("/")}><RiHome3Line className="mt-1 text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong" /></i>
                <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Document Page</h1>


            </div>
            <Card>
                <div className='flex flex-row '>

                    <div className="flex flex-col items-start justify-between w-full lg:w-1/2 lg:border-r lg:border-gray-300 lg:me-6">
                        <div className="flex items-center justify-between mb-2 space-x-2">
                            <i className="text-md font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Title:</i>
                            <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'> {title} ({id}) </i>
                        </div>

                        <div className="flex items-center justify-between mb-2 space-x-2">
                            <i className="text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Stakeholders:</i>
                            <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>{stakeholders.join("/ ")}</i>
                        </div>

                        <div className="flex items-center justify-between mb-2 space-x-2">
                            <i className="text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Scale:</i>
                            <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>
                            {scale.type === ScaleType.ONE_TO_N ? `1: ${scale.scale}` : scale.type}
                            </i>
                        </div>

                        <div className="flex items-center justify-between mb-2 space-x-2">
                            <i className="text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Issuance Date:</i>
                            <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'> {issuanceDate?.from ? formatLocalDate(new Date(issuanceDate.from)) : ""}{issuanceDate?.to ? ` - ${formatLocalDate(new Date(issuanceDate.to))}` : ""}
                            </i>
                        </div>

                        <div className="flex items-center justify-between mb-2 space-x-2">
                            <i className="text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Type:</i>
                            <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>{type} </i>
                        </div>

                        <div className="flex items-center justify-between mb-2 space-x-2">
                            <i className="text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Language:</i>
                            <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>{locales.find((l) => l.code === language)?.name || "Unknown"}</i>
                        </div>

                        <div className="flex items-center justify-between mb-2 space-x-2">
                            <i className="text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Pages:</i>
                            <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'> {pages != undefined && pages.toString() != "" ? pages : "Unknown"} </i>
                        </div>



                        <FormInfoDialog
                            document={doc!}
                            title={title}
                            setTitle={setTitle}
                            titleError={false}
                            setTitleError={() => { }}
                            stakeholders={stakeholders}
                            setStakeholders={setStakeholders}
                            shError={false}
                            setShError={() => { }}
                            issuanceDate={issuanceDate}
                            setIssuanceDate={setIssuanceDate}
                            type={type}
                            setType={setType}
                            scale={scale}
                            setScale={setScale}
                            language={language}
                            setLanguage={setLanguage}
                            pages={pages}
                            setPages={setPages}
                            pageRanges={pageRanges}
                            setPageRanges={setPageRanges}
                            id={id!}
                            user={user}
                        />


                    </div>

                    <div className='hidden lg:flex flex-col items-start col space-y-2 w-1/2'>
                        <i className="text-md font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Description:</i>
                        <i className='text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong'> {description}  </i>

                        <div className='hidden lg:flex space-y-2 h-full w-full'>
                            <FormDescriptionDialog
                                document={doc!}
                                description={description}
                                setDescription={setDescription}
                                id={id!}
                                user={user}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end w-full absolute right-3">
                        <i onClick={() => setShare(true)}><RiShareLine className="self-end text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong" /></i>
                        <Dialog open={share} onClose={() => setShare(false)} static={true}>
                            <DialogPanel>
                                <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Share "{title}"</h3>
                                <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                    Share the link of the document.
                                </p>
                                <div className="flex flex-row justify-between">
                                    <div className="mt-4 w-full  me-2">
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-tremor-border rounded-md"
                                            value={window.location.href}
                                            readOnly
                                        />
                                    </div>

                                    <Button
                                        className="mt-4 w-1/6 flex flex-col items-center justify-between"
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            setShowCheck(true);
                                            setTimeout(() => setShowCheck(false), 1500);
                                        }}
                                    >
                                        {showCheck ? <RiCheckDoubleLine className="mr-2" /> : <RiFileCopyLine className="mr-2" />}
                                    </Button>
                                </div>
                                <Button className="mt-8 w-full secondary" onClick={() => setShare(false)}>
                                    Close
                                </Button>
                            </DialogPanel>
                        </Dialog>
                    </div>

                </div>

                <div className="flex flex-col lg:flex-row ">

                    <div className="flex w-full h-full items-center justify-between mb-2">
                        <Accordion className="w-full mr-6 mb-6">
                            <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Original Resources</AccordionHeader>
                            <AccordionBody className="leading-6 flex flex-col">
                                <AccordionList style={{ boxShadow: 'none' }}>
                                    {doc !== undefined && doc?.attachments && doc?.attachments.length >= 1 ? doc?.attachments?.map((title) => (
                                        <div key={title + doc._id} className="flex items-center justify-between m-2">
                                            <i className='font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>{mime.getType(title)?.split("/")[1] === "pdf" ? "PDF file" : mime.getType(title)?.split("/")[0] === "image" ? "Image file" : "File  ".concat("(." + title.split(".")[1] + ")")}</i>
                                            <div className="flex space-x-2">
                                                <Button
                                                    className="ml-2"
                                                    onClick={() => {
                                                        setFileTitle(title)
                                                        setShowPdfPreview(true)
                                                    }}
                                                >
                                                    Preview File
                                                </Button>
                                                <Button
                                                    className="ml-2"
                                                    color="red"
                                                    onClick={async () => {
                                                        setDeleteOriginalResourceConfirm(true);
                                                        setFileTitle(title);
                                                    }}
                                                ><RiDeleteBinLine /></Button>
                                            </div>
                                        </div>
                                    )) : <>
                                        <div className="flex items-center justify-between m-2">
                                            <i className='font-medium text-tremor-content dark:text-dark-tremor-content'>No original resources added</i>
                                        </div>
                                    </>}

                                </AccordionList>
                            </AccordionBody>
                        </Accordion>
                        {canEdit && <i className="h-full lg:mr-9 mb-5" onClick={() => setIsDragAndDropOpen(true)}><RiAddBoxLine className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong" /></i>}

                    </div>

                    <div className="hide lg:flex w-full h-full items-center justify-between mb-2 ">

                        <Accordion className="w-full mr-6 mb-6">
                            <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">More documents [Cooming soon] </AccordionHeader>
                            <AccordionBody className="leading-6 flex flex-col">
                                <AccordionList style={{ boxShadow: 'none' }}>
                                    <div className="flex items-center justify-between m-2">
                                        <i className='font-medium text-tremor-content dark:text-dark-tremor-content'>No more documents added</i>
                                    </div>

                                </AccordionList>
                            </AccordionBody>
                        </Accordion>

                        <div className="hidden lg:flex">
                            <Button disabled className="h-full lg:ml-3 mb-5">
                                <RiAddBoxLine className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong" />
                            </Button>
                        </div>


                    </div>

                    {DeleteResourceDialog(
                        deleteOriginalResourceConfirm,
                        setDeleteOriginalResourceConfirm,
                        async () => {
                            try {
                                await API.deleteAttachmentFromDocument(new mongoose.Types.ObjectId(id!), fileTitle!);

                            } catch (error) {
                                toast({
                                    title: "Error",
                                    description: "Failed to delete documents",
                                    variant: "error",
                                    duration: 3000,
                                });
                                return;
                            }

                            toast({
                                title: "Success",
                                description: "The document has been deleted successfully",
                                variant: "success",
                                duration: 3000,
                            });


                            doc!.attachments = doc?.attachments?.filter((f) => f !== fileTitle);
                            setDoc({ ...doc! });
                        }
                        , fileTitle!

                    )}

                    <Dialog open={isDragAndDropOpen} onClose={() => setIsDragAndDropOpen(false)} static={true}>
                        <DialogPanel>
                            <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Add Original Resources</h3>
                            <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                Add original resources about the document you are uploading.
                            </p>
                            <FileUpload
                                saveFile={(list) => setFiles(list)}
                            />
                            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:space-x-4 sm:justify-end">
                                <Button
                                    className="w-full sm:w-auto mt-4 sm:mt-0 secondary"
                                    variant="light"
                                    onClick={() => setIsDragAndDropOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="w-full sm:w-auto primary"
                                    onClick={e => handleSubmitDragAndDrop(e)}
                                >
                                    Submit
                                </Button>
                            </div>
                        </DialogPanel>
                    </Dialog>

                </div>

                <div className="flex flex-col space-y-2 ">
                    <div className="flex flex-row">
                        <h3 className="text-l font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Connections</h3>
                        <FormConnectionsDialog
                            documents={documents}
                            documentsForDirect={documentsForDirect}
                            documentsForCollateral={documentsForCollateral}
                            documentsForProjection={documentsForProjection}
                            documentsForUpdate={documentsForUpdate}
                            setDocumentsForDirect={setDocumentsForDirect}
                            setDocumentsForCollateral={setDocumentsForCollateral}
                            setDocumentsForProjection={setDocumentsForProjection}
                            setDocumentsForUpdate={setDocumentsForUpdate}
                            id={id!}
                            user={user}
                        ></FormConnectionsDialog>
                    </div>

                    <div className="flex flex-col lg:flex-row ">

                        <div className="flex w-full h-full items-center justify-between mb-2">
                            <Accordion className="w-full mr-6 mb-6">
                                <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Direct connections</AccordionHeader>
                                <AccordionBody className="leading-6 flex flex-col">
                                    <AccordionList style={{ boxShadow: 'none' }}>
                                        {documentsForDirect.length > 0 ? documents.filter((d) => documentsForDirect.includes(d._id!.toString())).map((doc) => (
                                            <div key={doc._id?.toString()} className="flex items-center justify-between m-2">
                                                <i className='font-medium text-tremor-content dark:text-dark-tremor-content'>{doc.title} </i>
                                                <Button
                                                    size="xs"
                                                    icon={RiInfoI}
                                                    onClick={() => window.open("/documents/" + doc._id)}
                                                />
                                            </div>
                                        )) : <div className="flex items-center justify-around m-2">
                                            <i className='font-medium text-tremor-content dark:text-dark-tremor-content'>No direct connections added</i>
                                        </div>}
                                    </AccordionList>
                                </AccordionBody>
                            </Accordion>
                        </div>
                        <div className="flex w-full h-full items-center justify-between mb-2">
                            <Accordion className="w-full mr-6 mb-6">
                                <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Collateral connections</AccordionHeader>
                                <AccordionBody className="leading-6 flex flex-col">
                                    <AccordionList style={{ boxShadow: 'none' }}>
                                        {documentsForCollateral.length > 0 ? documents.filter((d) => documentsForCollateral.includes(d._id!.toString())).map((doc) => (
                                            <div key={doc._id?.toString()} className="flex items-center justify-between m-2">
                                                <i className='font-medium text-tremor-content dark:text-dark-tremor-content'>{doc.title} </i>
                                                <Button
                                                    size="xs"
                                                    icon={RiInfoI}
                                                    onClick={() => window.open("/documents/" + doc._id)}
                                                />
                                            </div>
                                        )) : <>
                                            <div className="flex items-center justify-around m-2">
                                                <i className='font-medium text-tremor-content dark:text-dark-tremor-content'>No collateral connections added</i>
                                            </div>
                                        </>}
                                    </AccordionList>
                                </AccordionBody>
                            </Accordion>
                        </div>
                        <div className="flex w-full h-full items-center justify-between mb-2">
                            <Accordion className="w-full mr-6 mb-6">
                                <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Projection connections</AccordionHeader>
                                <AccordionBody className="leading-6 flex flex-col">
                                    <AccordionList style={{ boxShadow: 'none' }}>
                                        {documentsForProjection.length > 0 ? documents.filter((d) => documentsForProjection.includes(d._id!.toString())).map((doc) => (
                                            <div key={doc._id?.toString()} className="flex items-center justify-between m-2">
                                                <i className='font-medium text-tremor-content dark:text-dark-tremor-content'>{doc.title} </i>
                                                <Button
                                                    size="xs"
                                                    icon={RiInfoI}
                                                    onClick={() => window.open("/documents/" + doc._id)}
                                                />
                                            </div>
                                        )) : <>
                                            <div className="flex items-center justify-around m-2">
                                                <i className='font-medium text-tremor-content dark:text-dark-tremor-content'>No projection connections added</i>
                                            </div>
                                        </>}
                                    </AccordionList>
                                </AccordionBody>
                            </Accordion>
                        </div>
                        <div className="flex w-full h-full items-center justify-between mb-2">
                            <Accordion className="w-full mr-6 mb-6">
                                <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Update connections</AccordionHeader>
                                <AccordionBody className="leading-6 flex flex-col">
                                    <AccordionList style={{ boxShadow: 'none' }}>
                                        {documentsForUpdate.length > 0 ? documents.filter((d) => documentsForUpdate.includes(d._id!.toString())).map((doc) => (
                                            <div key={doc._id?.toString()} className="flex items-center justify-between m-2">
                                                <i className='font-medium text-tremor-content dark:text-dark-tremor-content'>{doc.title} </i>

                                                <Button
                                                    size="xs"
                                                    icon={RiInfoI}
                                                    onClick={() => window.open("/documents/" + doc._id)}
                                                />
                                            </div>
                                        )) : <>
                                            <div className="flex items-center justify-around m-2">
                                                <i className='font-medium text-tremor-content dark:text-dark-tremor-content'>No update connections added</i>
                                            </div>
                                        </>}
                                    </AccordionList>
                                </AccordionBody>
                            </Accordion>
                        </div>
                    </div>
                </div>





                <Accordion className='lg:hidden'>
                    <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Description</AccordionHeader>
                    <AccordionBody className="leading-6 flex flex-col">
                        {description}
                        <FormDescriptionDialog
                            document={doc!}
                            description={description}
                            setDescription={setDescription}
                            id={id!}
                            user={user}
                        />
                    </AccordionBody>
                </Accordion>


                <>
                    <FormCoordinatesDialog
                        setDocCoordinates={setDocCoordinates}
                        id={id}
                        user={user}
                        handleSaveDrawing={handleSaveDrawing}
                        setDrawing={(d) => { setDrawings(d); setSaveDrawing(true); }}
                        drawing={drawings}
                        setUpdateHideMap={setUpdateHideMap}
                        updateHideMap={updateHideMap}
                    />
                    {!entireMunicipality ? (
                        <Card className={`my-4 p-0 overflow-hidden cursor-pointer ${"ring-tremor-ring"}`}>
                            <DocumentPageMap
                                drawing={drawings}
                                style={{ minHeight: "300px", width: "100%" }}
                                user={user}
                            />
                        </Card>

                    ) : (

                        <div className="flex justify-center items-start pt-2">
                            <div className='document-whole-municipality-style w-full sm:w-2/3 md:w-1/2 lg:w-1/3'>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <span>
                                        The document covers the entire municipality
                                    </span>
                                </div>
                            </div>
                        </div>

                    )}
                </>



                {
                    PreviewDoc(showPdfPreview, () => setShowPdfPreview(false), doc?._id, fileTitle)

                }
                <Toaster />

            </Card >

        </div >
    );
}

export function FormInfoDialog({
    document,
    title,
    setTitle,
    titleError,
    setTitleError,
    stakeholders,
    setStakeholders,
    shError,
    setShError,
    issuanceDate,
    setIssuanceDate,
    type,
    setType,
    scale,
    setScale,
    language,
    setLanguage,
    pages,
    setPages,
    pageRanges,
    setPageRanges,
    id,
    user
}: {
    document: KxDocument;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    titleError: boolean;
    setTitleError: React.Dispatch<React.SetStateAction<boolean>>;
    stakeholders: string[];
    setStakeholders: React.Dispatch<React.SetStateAction<string[]>>;
    shError: boolean;
    setShError: React.Dispatch<React.SetStateAction<boolean>>;
    issuanceDate: DateRange | undefined;
    setIssuanceDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
    type: string | undefined;
    setType: React.Dispatch<React.SetStateAction<string | undefined>>;
    scale: Scale;
    setScale: React.Dispatch<React.SetStateAction<Scale>>;
    language: string | undefined;
    setLanguage: React.Dispatch<React.SetStateAction<string | undefined>>;
    pages: PageRange[] | undefined;
    setPages: React.Dispatch<React.SetStateAction<PageRange[] | undefined>>;
    pageRanges: PageRange[] | undefined;
    setPageRanges: React.Dispatch<React.SetStateAction<PageRange[] | undefined>>;
    id: string;
    user: { email: string; role: Stakeholders } | null;
}) {

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
    const [typeError, setTypeError] = useState(false);

    const canEdit = user && user.role === Stakeholders.URBAN_PLANNER;


    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title === "" || stakeholders.length === 0 || type === undefined || scale === undefined) {
            setError("Please fill all the fields");
            return;
        }
        try {
            const updatedDocument = await API.updateKxDocumentInformation(id, title, stakeholders, type, scale, language, pages);
            if (updatedDocument) {
                toast({
                    title: "Success",
                    description:
                        "The document has been updated successfully",
                    variant: "success",
                    duration: 3000,
                })
            } else {
                toast({
                    title: "Error",
                    description: "Failed to update document",
                    variant: "error",
                    duration: 3000,
                })
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to update document",
                variant: "error",
                duration: 3000,
            })
        }
        setIsOpen(false);

    };

    const handleCancelSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setTitle(document.title);
        setStakeholders(document.stakeholders);
        setScale(document.scale as Scale);
        setType(document.type);
        setLanguage(document.language || undefined);
        setPages(document.pages || undefined);
        setIsOpen(false);
    }



    return (
        <>
            {canEdit && (
                <i className="ml-auto self-end mb-2 mt-4 lg:mb-0 lg:ml-4 lg:self-center lg:mt-0" onClick={() => setIsOpen(true)}>
                    <RiEditBoxLine className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong lg:me-6" />
                </i>
            )}

            <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
                <DialogPanel
                    className="w-80vm sm:w-4/5 md:w-4/5 lg:w-3/3 xl:w-1/2"
                    style={{ maxWidth: "80vw" }}
                >
                    <div className="sm:mx-auto sm:max-w-2xl">
                        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Update document
                        </h3>
                        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                            Update the informations about the document
                        </p>
                        <FormDocumentInformation
                            title={title}
                            setTitle={setTitle}
                            titleError={titleError}
                            setTitleError={setTitleError}
                            stakeholders={stakeholders}
                            setStakeholders={setStakeholders}
                            shError={shError}
                            setShError={setShError}
                            issuanceDate={issuanceDate}
                            setIssuanceDate={setIssuanceDate}
                            type={type}
                            setType={setType}
                            typeError={typeError}
                            setTypeError={setTypeError}
                            scale={scale}
                            setScale={setScale}
                            language={language}
                            setLanguage={setLanguage}
                            pages={pages}
                            setPages={setPages}
                            pageRanges={pageRanges}
                            setPageRanges={setPageRanges}

                        />
                        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:space-x-4 sm:justify-end">
                            <Button
                                className="w-full sm:w-auto mt-4 sm:mt-0 secondary"
                                variant="light"
                                onClick={(e) => handleCancelSubmit(e)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="w-full sm:w-auto primary"
                                onClick={(e) => handleInfoSubmit(e)}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </>
    )


}


export function FormDescriptionDialog(
    {
        document,
        description,
        setDescription,
        id,
        user
    }: {
        document: KxDocument;
        description: string | undefined;
        setDescription: React.Dispatch<React.SetStateAction<string | undefined>>;
        id: string;
        user: { email: string; role: Stakeholders } | null;
    }
) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
    const canEdit = user && user.role === Stakeholders.URBAN_PLANNER;

    const handleDescriptionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (description === undefined || description.length === 0) {
            setError("Please fill the description field");
            return;
        }
        try {
            const updatedDocument = await API.updateKxDocumentDescription(id, description);
            if (updatedDocument) {
                toast({
                    title: "Success",
                    description:
                        "The description has been updated successfully",
                    variant: "success",
                    duration: 3000,
                })
            } else {
                toast({
                    title: "Error",
                    description: "Failed to update description",
                    variant: "error",
                    duration: 3000,
                })
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to update description",
                variant: "error",
                duration: 3000,
            })
        }
        setIsOpen(false);
    };

    const handleDescriptionCancel = async (e: React.FormEvent) => {
        e.preventDefault();
        setDescription(document.description);
        setIsOpen(false);
    }

    return (
        <>

            {canEdit && <i className="mb-2 w-full flex justify-end" onClick={() => setIsOpen(true)}><RiEditBoxLine className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong" /></i>}

            <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
                <DialogPanel
                    className="w-80vm sm:w-4/5 md:w-4/5 lg:w-3/3 xl:w-1/2"
                    style={{ maxWidth: "80vw" }}
                >
                    <div className="sm:mx-auto sm:max-w-2xl">
                        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Update description
                        </h3>
                        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                            Update the description of the document
                        </p>
                        <form action="" method="patch" className="mt-8">
                            <FormDocumentDescription
                                description={description}
                                setDescription={setDescription} descriptionError={false} setDescriptionError={function (value: React.SetStateAction<boolean>): void {
                                    throw new Error('Function not implemented.');
                                }} />
                            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:space-x-4 sm:justify-end">
                                <Button
                                    className="w-full sm:w-auto mt-4 sm:mt-0 secondary"
                                    variant="light"
                                    onClick={(e) => handleDescriptionCancel(e)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="w-full sm:w-auto primary"
                                    onClick={e => handleDescriptionSubmit(e)}
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogPanel>
            </Dialog>
            <Toaster />
        </>
    );
}

export function FormConnectionsDialog({
    documents,
    documentsForDirect,
    documentsForCollateral,
    documentsForProjection,
    documentsForUpdate,
    setDocumentsForDirect,
    setDocumentsForCollateral,
    setDocumentsForProjection,
    setDocumentsForUpdate,
    id,
    user
}: {
    documents: KxDocument[];
    documentsForDirect: string[];
    documentsForCollateral: string[];
    documentsForProjection: string[];
    documentsForUpdate: string[];
    setDocumentsForDirect: React.Dispatch<React.SetStateAction<string[]>>;
    setDocumentsForCollateral: React.Dispatch<React.SetStateAction<string[]>>;
    setDocumentsForProjection: React.Dispatch<React.SetStateAction<string[]>>;
    setDocumentsForUpdate: React.Dispatch<React.SetStateAction<string[]>>;
    id: string;
    user: { email: string; role: Stakeholders } | null;
}) {

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
    const canEdit = user && user.role === Stakeholders.URBAN_PLANNER;
    const [showConnectionsInfo, setShowConnectionsInfo] = useState(false);

    const handleConnectionsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedDocument = await API.updateKxDocumentConnections(id, documentsForDirect, documentsForCollateral, documentsForProjection, documentsForUpdate);
            if (updatedDocument) {
                toast({
                    title: "Success",
                    description:
                        "The connections have been updated successfully",
                    variant: "success",
                    duration: 3000,
                })
            } else {
                throw new Error("Failed to update connections");
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to update connections",
                variant: "error",
                duration: 3000,
            })
        }
        setIsOpen(false);
    };

    const handleConnectionsCancel = async (e: React.FormEvent) => {
        e.preventDefault();


        setIsOpen(false);
    }

    return (
        <>
            {canEdit && <i className="ml-2 mb-2 w-full flex justify-start" onClick={() => setIsOpen(true)}><RiEditBoxLine className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong" /></i>}
            <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
                <DialogPanel
                    className="w-80vm sm:w-4/5 md:w-4/5 lg:w-3/3 xl:w-1/2"
                    style={{ maxWidth: "80vw" }}
                >
                    <div className="sm:mx-auto sm:max-w-2xl">
                        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Update connections
                        </h3>
                        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                            Update the connections of the document
                        </p>
                        <form action="" method="patch" className="mt-8">
                            <FormDocumentConnections
                                documents={documents}
                                documentsForDirect={documentsForDirect}
                                setDocumentsForDirect={setDocumentsForDirect}
                                documentsForCollateral={documentsForCollateral}
                                setDocumentsForCollateral={setDocumentsForCollateral}
                                documentsForProjection={documentsForProjection}
                                setDocumentsForProjection={setDocumentsForProjection}
                                documentsForUpdate={documentsForUpdate}
                                setDocumentsForUpdate={setDocumentsForUpdate}
                                showConnectionsInfo={showConnectionsInfo}
                                setShowConnectionsInfo={setShowConnectionsInfo}
                            />
                            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:space-x-4 sm:justify-end">
                                <Button
                                    className="w-full sm:w-auto mt-4 sm:mt-0 secondary"
                                    variant="light"
                                    onClick={(e) => handleConnectionsCancel(e)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="w-full sm:w-auto primary"
                                    onClick={e => handleConnectionsSubmit(e)}
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogPanel>
            </Dialog>
            <Toaster />
        </>
    );



}







export function FormCoordinatesDialog(
    {
        drawing,
        setDrawing,
        handleSaveDrawing,
        setDocCoordinates,
        id,
        user,
        setUpdateHideMap,
        updateHideMap
    }: {
        setDrawing: React.Dispatch<React.SetStateAction<any>>;
        handleSaveDrawing: () => void;
        setDocCoordinates: React.Dispatch<React.SetStateAction<any>>;
        id: string | undefined;
        user: { email: string; role: Stakeholders } | null;
        drawing: any;
        setUpdateHideMap: React.Dispatch<React.SetStateAction<boolean>>;
        updateHideMap: boolean;
    }
) {

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
    const canEdit = user && user.role === Stakeholders.URBAN_PLANNER;
    const [docCoordinatesError, setDocCoordinatesError] = useState(false);
    const [hideMap, setHideMap] = useState<boolean>(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [entireMunicipality, setEntireMunicipality] = useState(false);

    const [showGeoInfo, setShowGeoInfo] = useState(false);

    useEffect(() => {

        if (updateHideMap) {
            setEntireMunicipality(true);

        }
    }, [isOpen])


    const handleCoordinatesCancel = async (val: boolean) => {
        setIsOpen(val);
        if (entireMunicipality) {
            setUpdateHideMap(true);
        }
    };

    return (
        <>
            
                <div className="flex items-center pt-3">
                    <h3 className="text-l font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Geolocalization</h3>
                    {canEdit && (
                    <i className="ml-2 flex justify-end" onClick={() => setIsOpen(true)}>
                        <RiEditBoxLine className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong" />
                    </i>
                    )}
                </div>
            

            <Dialog open={isOpen} onClose={() => handleCoordinatesCancel(false)} static={true}>
                <DialogPanel
                    className="w-80vm sm:w-4/5 md:w-4/5 lg:w-3/3 xl:w-1/2"
                    style={{ maxWidth: "80vw" }}
                >
                    <div className="sm:mx-auto sm:max-w-2xl">
                        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Update Coordinates
                        </h3>
                        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                            Update the coordinates of the document
                        </p>
                        <form action="" method="patch" className="mt-8">
                            <FormDocumentGeolocalization
                                isMapOpen={isMapOpen}
                                setIsMapOpen={setIsMapOpen}
                                showGeoInfo={showGeoInfo}
                                setShowGeoInfo={setShowGeoInfo}
                                docCoordinatesError={docCoordinatesError}
                                setDocCoordinatesError={setDocCoordinatesError}
                                drawing={drawing}
                                setDrawing={setDrawing}
                                hideMap={hideMap}
                                setHideMap={setHideMap}
                                user={user}
                                setUpdateHideMap={setUpdateHideMap}
                                updateHideMap={updateHideMap}
                            />
                            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:space-x-4 sm:justify-end">
                                <Button
                                    className="w-full sm:w-auto mt-4 sm:mt-0 secondary"
                                    variant="light"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleCoordinatesCancel(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="w-full sm:w-auto primary"
                                    onClick={handleSaveDrawing}
                                    disabled={!drawing || !drawing.features[0] && !updateHideMap}
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogPanel>
            </Dialog>
            <Toaster />
        </>
    );
}
