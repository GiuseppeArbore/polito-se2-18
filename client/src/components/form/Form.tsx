import React from "react";
import {
    Card,
    Button,
    DatePicker,
    Dialog,
    DialogPanel,
    Divider,
    MultiSelect,
    MultiSelectItem,
    SearchSelect,
    SearchSelectItem,
    TextInput,
    Textarea,
    Badge,
    Callout,
    Switch,
    Icon,
    Select,
    SelectItem,
} from "@tremor/react";
import { DateRangePicker } from "./DatePicker"
import { useState, useEffect } from "react";
import locales from "./../../locales.json";
import { PreviewMap, SatMap } from "../map/Map";
import { FeatureCollection } from "geojson"
import API from "../../API";
import { AreaType, KxDocumentType, ScaleType, Stakeholders } from "../../enum";
import { DocCoords, KxDocument, ScaleOneToN, Scale } from "../../model";
import { mongoose } from "@typegoose/typegoose";
import {
    RiArrowDownCircleLine,
    RiLinksLine,
    RiLoopLeftLine,
    RiProjector2Line,
    RiInformation2Line,
    RiAddLine,
    RiStarFill,
} from "@remixicon/react";

import {
    parseLocalizedNumber,
    PageRange,
    validatePageRangeString,
} from "../../utils";
import "../../index.css";
import { toast } from "../../utils/toaster";
import { Toaster } from "../toast/Toaster";
import { FileUpload } from "./DragAndDrop";
import { DateRange } from "./DatePicker";
import { se } from "date-fns/locale";
import { set } from "date-fns";



interface FormDialogProps {
    documents: KxDocument[];
    refresh: () => void;
    user: React.RefObject<{ email: string; role: Stakeholders } | null>;
}



export function FormDialog(props: FormDialogProps) {
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [stakeholders, setStakeholders] = useState<string[]>([]);
    const [shError, setShError] = useState(false);
    const [issuanceDate, setIssuanceDate] = useState<DateRange | undefined>(
        { from: new Date() }
    );
    const [files, setFiles] = useState<File[]>([]);
    const [issuanceDateError, setIssuanceDateError] = useState(false);
    const [type, setType] = useState<string | undefined>(undefined);

    const [typeError, setTypeError] = useState(false);

    const [scale, setScale] = useState<Scale>({ type: ScaleType.TEXT });
    const [language, setLanguage] = useState<string | undefined>(undefined);
    const [pagesText, setPagesText] = useState<string>("");
    const [pageRanges, setPageRanges] = useState<PageRange[] | undefined>([]);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [showGeoInfo, setShowGeoInfo] = useState(false);
    const [docCoordinatesError, setDocCoordinatesError] = useState(false);
    const [drawing, setDrawing] = useState<any>(undefined);
    const [hideMap, setHideMap] = useState<boolean>(false);
    const [description, setDescription] = useState<string | undefined>(undefined);
    const [descriptionError, setDescriptionError] = useState(false);
    const [documentsForDirect, setDocumentsForDirect] = useState<string[]>([]);
    const [documentsForCollateral, setDocumentsForCollateral] = useState<
        string[]
    >([]);
    const [documentsForProjection, setDocumentsForProjection] = useState<
        string[]
    >([]);
    const [documentsForUpdate, setDocumentsForUpdate] = useState<string[]>([]);
    const [showConnectionsInfo, setShowConnectionsInfo] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [docCoordinates,] = useState<DocCoords | undefined>(undefined);
    // Example usage
    //const [docCoordinates, setDocCoordinates] = useState<DocCoords | undefined>({type: AreaType.ENTIRE_MUNICIPALITY});


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tmpTitleError = title.length === 0;
        const tmpShError = stakeholders.length === 0;
        let draw: DocCoords | undefined;
        if (
            !hideMap &&
            drawing &&
            drawing.features.length === 1 &&
            drawing.features[0].geometry.type === "Point"
        ) {
            draw = {
                type: AreaType.POINT,
                coordinates: drawing.features[0].geometry.coordinates,
            };
        } else if (!hideMap && (drawing && drawing.features.length >= 1) && drawing.features[0].geometry.type === "Polygon") {
            //TODO: add support for multiple polygons
            let cord =
                drawing.features.map((f: any) => f.geometry.coordinates).length === 1
                    ? drawing.features[0].geometry.coordinates
                    : setDocCoordinatesError(true);
            draw = {
                type: AreaType.AREA,
                coordinates: cord as number[][][],
            };
        } else if (hideMap) {
            draw = {
                type: AreaType.ENTIRE_MUNICIPALITY,
            };
        }

        if (tmpTitleError || tmpShError || !type || !description || !draw || !issuanceDate || (drawing === undefined && !hideMap)) {
            setTitleError(tmpTitleError);
            setShError(tmpShError);
            setTypeError(!type);
            setDescriptionError(!description);
            setIssuanceDateError(!issuanceDate);
            hideMap ? setDocCoordinatesError(false) : setDocCoordinatesError(!docCoordinates);
            setError("Please fill all the required fields");
            toast({
                title: "Error",
                description: "Please fill all the required fields",
                variant: "error",
                duration: 3000,
            })
            return;
        }

        const newDocument: KxDocument = {
            title,
            stakeholders,
            scale,
            doc_coordinates: draw,
            issuance_date: {
                from: issuanceDate?.from!,
                to: issuanceDate?.to!
            },
            type: type,
            language,
            description,
            pages: validatePageRangeString(pagesText),
            connections: {
                direct: documentsForDirect.map(d => new mongoose.Types.ObjectId(d)),
                collateral: documentsForCollateral.map(d => new mongoose.Types.ObjectId(d)),
                projection: documentsForProjection.map(d => new mongoose.Types.ObjectId(d)),
                update: documentsForUpdate.map(d => new mongoose.Types.ObjectId(d)),
            },
        };
        let createdDocument: KxDocument | null = null;
        try {
            createdDocument = await API.createKxDocument(newDocument);
            if (createdDocument) {
                props.refresh();
                toast({
                    title: "Success",
                    description: "The document has been created successfully",
                    variant: "success",
                    duration: 3000,
                });

                setTitle("");
                setScale({ type: ScaleType.TEXT });
                setIssuanceDate({ from: new Date() });
                setType(undefined);
                setLanguage(undefined);
                setDescription(undefined);
                setPagesText("");
                setDrawing(undefined);
                setPageRanges([]);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to create document",
                    variant: "error",
                    duration: 3000,
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to create document",
                variant: "error",
                duration: 3000,
            });
        }
        try {
            if (createdDocument && createdDocument._id) {
                if (files.length > 0) {
                    const FileUpload = await API.addAttachmentToDocument(createdDocument._id, files);
                    if (!FileUpload) {
                        toast({
                            title: "Error",
                            description: "Failed to upload files",
                            variant: "error",
                            duration: 3000,
                        })
                    }
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
        setIsOpen(false);
        clearForm();
    };

    function clearForm() {
        setTitle("");
        setTitleError(false);
        setStakeholders([]);
        setShError(false);
        setIssuanceDate({ from: new Date() });
        setIssuanceDateError(false);
        setType(undefined);
        setTypeError(false);
        setScale({ type: ScaleType.TEXT });
        setLanguage(undefined);
        setPagesText("");
        setPageRanges([]);
        setHideMap(false);
        setDescription(undefined);
        setDescriptionError(false);
        setError("");
        setIsMapOpen(false);
        setShowConnectionsInfo(false);
        setShowGeoInfo(false);
        setDocCoordinatesError(false);
        setDocumentsForDirect([]);
        setDocumentsForCollateral([]);
        setDocumentsForProjection([]);
        setDocumentsForUpdate([]);
        setDrawing(undefined);
    }



    function myform() {
        return (
            <div className="mt-8">

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
                    pagesText={pagesText}
                    setPagesText={setPagesText}
                    pageRanges={pageRanges}
                    setPageRanges={setPageRanges}
                />


                <DateRangePickerPresets
                    issuanceDate={issuanceDate}
                    setIssuanceDate={setIssuanceDate}
                    hasError={issuanceDateError}
                />



                <Divider />

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
                    user={props.user}
                />

                <Divider />

                <FormDocumentDescription
                    description={description}
                    setDescription={setDescription}
                    descriptionError={descriptionError}
                    setDescriptionError={setDescriptionError}
                />

                <Divider />

                <FormDocumentConnections
                    documents={props.documents}
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

                <Divider />

                <FileUpload saveFile={(list) => setFiles(list)} />

                <Divider />

                <div className="mt-8 flex flex-col-reverse sm:flex-row sm:space-x-4 sm:justify-end">
                    <Button
                        className="w-full sm:w-auto mt-4 sm:mt-0 secondary"
                        variant="light"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="w-full sm:w-auto primary"
                        onClick={e => handleSubmit(e)}
                    >
                        Submit
                    </Button>
                </div>

            </div>
        )
    }

    return (
        <>
            { props.user.current && props.user.current.role === Stakeholders.URBAN_PLANNER && (
                <Button className="w-full primary flex items-center" style={{ borderRadius: '0.3rem', height: '2rem', width: '11rem', marginTop: '-0.2rem' }} onClick={() => { setIsOpen(true); clearForm() }}>
                    <span className="flex items-center">
                        <RiAddLine className="mr-2" /> Add new document
                    </span>
                </Button>
            )}
            <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
                <DialogPanel
                    className="w-80vm sm:w-4/5 md:w-4/5 lg:w-3/3 xl:w-1/2"
                    style={{ maxWidth: "80vw" }}
                >
                    <div className="sm:mx-auto sm:max-w-2xl">
                        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Add new document
                        </h3>
                        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                            Add all the information about the document
                        </p>
                        {myform()}
                    </div>
                </DialogPanel>
            </Dialog>
            <Toaster />
        </>
    );
}


export function FormDocumentInformation({
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
    typeError,
    setTypeError,
    scale,
    setScale,
    language,
    setLanguage,
    pagesText,
    setPagesText,
    pageRanges,
    setPageRanges
}: {
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
    typeError: boolean;
    setTypeError: React.Dispatch<React.SetStateAction<boolean>>;
    scale: Scale;
    setScale: React.Dispatch<React.SetStateAction<Scale>>;
    language: string | undefined;
    setLanguage: React.Dispatch<React.SetStateAction<string | undefined>>;
    pagesText: string;
    setPagesText: React.Dispatch<React.SetStateAction<string>>;
    pageRanges: PageRange[] | undefined;
    setPageRanges: React.Dispatch<React.SetStateAction<PageRange[] | undefined>>;
}) {

    const [aggregatedStakeholders, setAggregatedStakeholders] = useState<string[]>([]);
    const [aggregatedScales, setAggregatedScales] = useState<string[]>([]);
    const [aggregatedTypes, setAggregatedTypes] = useState<string[]>([]);
    const [newStakeholder, setNewStakeholder] = useState('');
    const [newType, setNewType] = useState('');
    const [newScale, setNewScale] = useState('');

    useEffect(() => {
        const fetchAggregateData = async () => {
            try {
                const aggregateData = await API.getKxDocumentsAggregateData();
                if (aggregateData) {
                    setAggregatedStakeholders(aggregateData.stakeholders);
                    setAggregatedScales(aggregateData.scales.map(scale => scale.toLocaleString()));
                    setAggregatedTypes(aggregateData.types);
                }

            } catch (error: any) {
                console.error(error);
            }
        };
        fetchAggregateData();
    }, []);

    const handleAddNewStakeholder = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStakeholder && !aggregatedStakeholders.includes(newStakeholder)) {
            const updatedStakeholders = [...aggregatedStakeholders, newStakeholder];
            setAggregatedStakeholders(updatedStakeholders);
            setStakeholders([...stakeholders, newStakeholder]);
        }
        setNewStakeholder('');
    };

    const handleAddNewType = (e: React.FormEvent) => {
        e.preventDefault();
        if (newType && !aggregatedTypes.includes(newType)) {
            const updatedTypes = [...aggregatedTypes, newType];
            setAggregatedTypes(updatedTypes);
            setType(newType);
        }
        setNewType('');
    };

    const handleAddNewScale = (e: React.FormEvent) => {
        e.preventDefault();
        const newScaleNum = parseLocalizedNumber(newScale);
        if (
            newScale &&
            !aggregatedScales.includes(newScaleNum.toLocaleString()) &&
            !Number.isNaN(newScaleNum) &&
            Number.isInteger(newScaleNum) &&
            newScaleNum >= 0 &&
            newScaleNum <= 10_000_000_000_000
        ) {
            const updatedScales = [...aggregatedScales, newScaleNum];
            setAggregatedScales(updatedScales.map(scale => scale.toLocaleString()));
            setScale({ type: ScaleType.ONE_TO_N, scale: newScaleNum });
        }
        setNewScale('');
    };

    return (
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full">
                <label
                    htmlFor="title"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                >
                    Title
                    <span className="text-red-500">*</span>
                </label>
                <TextInput
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onValueChange={t => setTitle(t)}
                    autoComplete="title"
                    placeholder="Title"
                    className="mt-2"
                    error={titleError}
                    errorMessage="The title is mandatory"
                    required
                />
            </div>
            <div className="col-span-full">
                <label
                    htmlFor="stakeholders"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                >
                    Stakeholders
                    <span className="text-red-500">*</span>
                </label>
                <MultiSelect
                    id="stakeholders"
                    name="stakeholders"
                    className="mt-2"
                    value={stakeholders}
                    onValueChange={s => setStakeholders(s)}
                    error={shError}
                    errorMessage="You must select at least one stakeholder."
                    required
                >
                    <div className="sticky top-0 bg-white dark:bg-[#121826] z-10 p-0">
                        <form className="flex items-center p-2">
                            <TextInput
                                type="text"
                                name="newStakeholder"
                                className="border p-0 mr-2 w-80"
                                placeholder="Add new Stakeholder..."
                                value={newStakeholder}
                                onChange={(e) => setNewStakeholder(e.target.value)}
                            />
                            <Button
                                type="submit"
                                className="bg-[#163C89] dark:bg-blue-500 text-white p-1 rounded"
                                onClick={(e) => {
                                    handleAddNewStakeholder(e);
                                }}
                            >
                                Add new
                            </Button>
                        </form>
                    </div>
                    {
                        aggregatedStakeholders.map((stakeholder) => (
                            <MultiSelectItem key={`sh-${stakeholder}`} value={stakeholder}>
                                {stakeholder}
                            </MultiSelectItem>
                        ))
                    }
                </MultiSelect>
            </div>

            <div className="col-span-full sm:col-span-3">
                <label
                    htmlFor="type"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                >
                    Type
                    <span className="text-red-500">*</span>
                </label>
                <SearchSelect
                    id="doc_type"
                    name="doc_type"
                    className="mt-2"
                    value={type}
                    onValueChange={t => setType(t)}
                    error={typeError}
                    errorMessage="The type is mandatory"
                    required
                >
                    <div className="sticky top-0 bg-white dark:bg-[#121826] z-10 p-0">
                        <form className="flex items-center p-2">
                            <TextInput
                                type="text"
                                name="newType"
                                className="border p-0 mr-2 w-80"
                                placeholder="Add new Type..."
                                value={newType}
                                onChange={(e) => setNewType(e.target.value)}
                            />
                            <Button
                                type="submit"
                                className="bg-[#163C89] dark:bg-blue-500 text-white p-1 rounded"
                                onClick={(e) => {
                                    handleAddNewType(e);
                                }}
                            >
                                Add new
                            </Button>
                        </form>
                    </div>
                    {
                        aggregatedTypes.map((dt) => {
                            return (
                                <SearchSelectItem key={`type-${dt}`} value={dt}>
                                    {dt}
                                </SearchSelectItem>
                            );
                        })
                    }
                </SearchSelect>
            </div>

            <div className="col-span-full sm:col-span-3">
                <label
                    htmlFor="scale"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                >
                    Scale
                    <span className="text-red-500">*</span>
                </label>
                <Select
                    value={scale.type}
                    onValueChange={(value) => {
                        const v = value as ScaleType;
                        if (v === ScaleType.ONE_TO_N) {
                            setScale({ type: ScaleType.ONE_TO_N, scale: 10000 });
                        } else {
                            setScale({ type: v });
                        }
                    }}
                    className="mt-2"
                >

                    {Object.values(ScaleType).map((t) => {
                        return (
                            <SelectItem value={t} key={t}>
                                {t}
                            </SelectItem>
                        );
                    })}
                </Select>
                {scale.type === ScaleType.ONE_TO_N &&
                    <SearchSelect
                        id="scale"
                        name="scale"
                        className="mt-2"
                        value={scale.scale.toLocaleString()}
                        onValueChange={(v) => {
                            if (v === "") {
                                setScale({ type: ScaleType.ONE_TO_N, scale: 10000 });
                                return;
                            }
                            const num = parseLocalizedNumber(v);
                            if (
                                !Number.isNaN(num) &&
                                Number.isInteger(num) &&
                                num >= 0 &&
                                num <= 10_000_000_000_000
                            ) {
                                setScale({ type: ScaleType.ONE_TO_N, scale: num });
                            }
                        }}
                        icon={() => (
                            <p className="dark:border-dark-tremor-border border-r h-full text-tremor-default text-end text-right tremor-TextInput-icon shrink-0 h-5 w-5 mx-2.5 absolute left-0 flex items-center text-tremor-content-subtle dark:text-dark-tremor-content-subtle">
                                1:
                            </p>
                        )}

                        placeholder="10.000"
                        required
                    >
                        <div className="sticky top-0 bg-white dark:bg-[#121826] z-10 p-0">
                            <form className="flex items-center p-2">
                                <TextInput
                                    type="text"
                                    name="newScale"
                                    className="border p-0 mr-2 w-80"
                                    placeholder="Add new Scale..."
                                    value={newScale}
                                    onChange={(e) => setNewScale(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    className="bg-[#163C89] dark:bg-blue-500 text-white p-1 rounded"
                                    onClick={(e) => {
                                        handleAddNewScale(e);
                                    }}
                                >
                                    Add new
                                </Button>
                            </form>
                        </div>
                        {aggregatedScales.map((scale) => {
                            const scaleStr = scale.toLocaleString(); 
                            return (
                                <SearchSelectItem key={scaleStr} value={scaleStr}>
                                    {scaleStr}
                                </SearchSelectItem>
                            );
                        })}
                    </SearchSelect>
                }
            </div>

            <div className="col-span-full sm:col-span-3">
                <label
                    htmlFor="language"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                >
                    Language
                </label>
                <SearchSelect
                    id="language"
                    name="language"
                    className="mt-2"
                    value={language}
                    onValueChange={l => setLanguage(l)}
                >
                    {locales.map((l) => {
                        return (
                            <SearchSelectItem value={l.code} key={`lang-${l.code}`}>
                                {l.name === "English" || l.name === "Swedish" ? <><Icon className="py-0" size="xs" icon={RiStarFill} /><strong>{l.name}</strong></> : l.name}
                            </SearchSelectItem>
                        );
                    })}
                </SearchSelect>
            </div>
            <div className="col-span-full sm:col-span-3">
                <label
                    htmlFor="pages"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                >
                    Pages
                </label>
                <TextInput
                    id="pages"
                    name="pages"
                    value={pagesText}
                    onValueChange={setPagesText}
                    error={!pageRanges ? true : false}
                    errorMessage='Invalid page range. Examples of valid ranges: "10" or "1-5" or "1-5,6"'
                    autoComplete="pages"
                    placeholder="Pages"
                    className="mt-2"
                />
            </div>
        </div>
    )
}

export function FormDocumentGeolocalization({
    isMapOpen,
    setIsMapOpen,
    showGeoInfo,
    setShowGeoInfo,
    docCoordinatesError,
    setDocCoordinatesError,
    drawing,
    setDrawing,
    hideMap,
    setHideMap,
    user,
    setUpdateHideMap,
    updateHideMap

}: {
    isMapOpen: boolean,
    setIsMapOpen: React.Dispatch<React.SetStateAction<boolean>>,
    showGeoInfo: boolean,
    setShowGeoInfo: React.Dispatch<React.SetStateAction<boolean>>,
    docCoordinatesError: boolean,
    setDocCoordinatesError: React.Dispatch<React.SetStateAction<boolean>>,
    drawing: any,
    setDrawing: React.Dispatch<React.SetStateAction<any>>,
    hideMap?: boolean,
    setHideMap: React.Dispatch<React.SetStateAction<boolean>>
    user: React.RefObject<{ email: string; role: Stakeholders } | null>;
    setUpdateHideMap?: React.Dispatch<React.SetStateAction<boolean>>
    updateHideMap?: boolean
}) {
    const handleSwitchChange = (checked: boolean) => {
        setHideMap(checked);
        if (setUpdateHideMap) {
            setUpdateHideMap(checked);
        }
    };
    hideMap = hideMap || updateHideMap;
    return (
        <>
            <div className="col-span-full sm:col-span-3 flex flex-row">
                <label
                    htmlFor="Geolocalization"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                >
                    Geolocalization
                </label>
                <a
                    className="ml-2"
                    onClick={() => setShowGeoInfo(!showGeoInfo)}
                >
                    <RiInformation2Line className="text-2xl" style={{ color: "#003d8e" }} />
                </a>
            </div>
            {showGeoInfo &&
                <Callout
                    className="mb-6"
                    style={{ border: "none" }}
                    title="Geolocalization guide"
                    color="gray"
                >
                    To specify the Geolocalization of the document, use the
                    switch to select the entire municipality or click on the map
                    to select a specific area or point.
                </Callout>
            }
            <div className="flex items-center space-x-3">
                <label htmlFor="switch" className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    Select the whole Municipality {' '}
                    <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Kiruna</span>
                </label>
                <Switch
                    id="switch"
                    name="switch"
                    checked={hideMap}
                    onChange={handleSwitchChange}
                />
            </div>

            {!hideMap && (
                <>
                    <Card
                        className={`my-4 p-0 overflow-hidden cursor-pointer ${docCoordinatesError ? "ring-red-400" : "ring-tremor-ring"}`}
                        onClick={() => setIsMapOpen(true)}
                    >
                        <PreviewMap
                            drawing={drawing}
                            style={{ minHeight: "300px", width: "100%" }}
                            user={user}
                        />
                    </Card>
                </>
            )}
            {docCoordinatesError ? <p className="tremor-TextInput-errorMessage text-sm text-red-500 mt-1">Please provide document coordinates</p> : null}
            <Dialog
                open={isMapOpen}
                onClose={(val) => setIsMapOpen(val)}
                static={true}
            >
                <DialogPanel
                    className="p-0 overflow-hidden"
                    style={{ maxWidth: "100%" }}
                >
                    <SatMap
                        drawing={drawing}
                        onCancel={() => setIsMapOpen(false)}
                        onDone={(v) => { setDrawing(v); setIsMapOpen(false); }}
                        style={{ minHeight: "95vh", width: "100%" }}
                        user={user}
                    ></SatMap>
                </DialogPanel>
            </Dialog>
        </>
    )
}

export function FormDocumentDescription({
    description,
    setDescription,
    descriptionError,
    setDescriptionError,
}: {
    description: string | undefined,
    setDescription: React.Dispatch<React.SetStateAction<string | undefined>>,
    descriptionError: boolean,
    setDescriptionError: React.Dispatch<React.SetStateAction<boolean>>,
}
) {

    return (
        <div className="col-span-full">
            <label
                htmlFor="description"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
                Description
                <span className="text-red-500">*</span>
            </label>
            <Textarea
                id="description"
                name="description"
                placeholder="Description"
                className="mt-2"
                value={description}
                error={descriptionError}
                errorMessage="The description is mandatory"
                onValueChange={d => setDescription(d)}
                style={{ minHeight: "200px" }}
            />
        </div>
    )
}

export function FormDocumentConnections(
    {
        documents,
        documentsForDirect,
        setDocumentsForDirect,
        documentsForCollateral,
        setDocumentsForCollateral,
        documentsForProjection,
        setDocumentsForProjection,
        documentsForUpdate,
        setDocumentsForUpdate,
        showConnectionsInfo,
        setShowConnectionsInfo
    }: {
        documents: KxDocument[],
        documentsForDirect: string[],
        setDocumentsForDirect: React.Dispatch<React.SetStateAction<string[]>>,
        documentsForCollateral: string[],
        setDocumentsForCollateral: React.Dispatch<React.SetStateAction<string[]>>,
        documentsForProjection: string[],
        setDocumentsForProjection: React.Dispatch<React.SetStateAction<string[]>>,
        documentsForUpdate: string[],
        setDocumentsForUpdate: React.Dispatch<React.SetStateAction<string[]>>,
        showConnectionsInfo: boolean,
        setShowConnectionsInfo: React.Dispatch<React.SetStateAction<boolean>>
    }
) {


    return (
        <>
            <div className="col-span-full sm:col-span-3 flex flex-row">
                <label
                    htmlFor="Connections"
                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                >
                    Connections
                </label>
                <a
                    className="ml-2"
                    onClick={() => setShowConnectionsInfo(!showConnectionsInfo)}
                >
                    <RiInformation2Line className="text-2xl" style={{ color: "#003d8e" }} />
                </a>
            </div>

            {showConnectionsInfo &&
                <Callout
                    className="mb-6"
                    style={{ border: "none" }}
                    title="Connections guide"
                    color="gray"
                >
                    To specify connections in the graph, use each dropdown to select
                    the nodes you want to connect. The dropdowns correspond to
                    different types of connections. Simply click on a dropdown under
                    the relevant connection type (e.g., Direct, Collateral) and
                    choose one or more nodes to establish that specific connection.
                </Callout>
            }

            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-2">
                {/* Direct Section */}
                <div className="col-span-full sm:col-span-1">
                    <Badge icon={RiLinksLine} className="text-sm flex items-center gap-2"
                        color="gray">
                        <span className="text-sm">Direct</span>
                    </Badge>
                    <MultiSelect
                        value={documentsForDirect}
                        onValueChange={(values) => setDocumentsForDirect(values)}
                        className="mt-2"
                    >
                        {documents.map((doc) => (
                            <MultiSelectItem
                                key={doc._id?.toString()}
                                value={doc._id ? doc._id.toString() : ""}
                                className={

                                    (doc._id && documentsForProjection.includes(doc._id.toString())) ||
                                        (doc._id && documentsForDirect.includes(doc._id.toString())) ||
                                        (doc._id && documentsForCollateral.includes(doc._id.toString())) ||
                                        (doc._id && documentsForUpdate.includes(doc._id.toString()))

                                        ? "opacity-50 cursor-not-allowed no-click"
                                        : ""
                                }
                            >
                                {doc.title}
                            </MultiSelectItem>
                        ))}
                    </MultiSelect>
                </div>

                {/* Collateral Section */}
                <div className="col-span-full sm:col-span-1">
                    <Badge
                        icon={RiArrowDownCircleLine}
                        className="text-sm flex items-center gap-2"
                        color="gray"
                    >
                        <span className="text-sm">Collateral</span>
                    </Badge>
                    <MultiSelect
                        value={documentsForCollateral}
                        onValueChange={(values) => setDocumentsForCollateral(values)}
                        className="mt-2"
                    >
                        {documents.map((doc) => (
                            <MultiSelectItem
                                key={doc._id?.toString()}
                                value={doc._id ? doc._id.toString() : ""}
                                className={
                                    (doc._id && documentsForProjection.includes(doc._id.toString())) ||
                                        (doc._id && documentsForDirect.includes(doc._id.toString())) ||
                                        (doc._id && documentsForCollateral.includes(doc._id.toString())) ||
                                        (doc._id && documentsForUpdate.includes(doc._id.toString()))
                                        ? "opacity-50 cursor-not-allowed no-click"
                                        : ""
                                }
                            >
                                {doc.title}
                            </MultiSelectItem>
                        ))}
                    </MultiSelect>
                </div>

                {/* Projection Section */}
                <div className="col-span-full sm:col-span-1">
                    <Badge icon={RiProjector2Line} className="text-sm flex items-center gap-2"
                        color="gray">
                        <span className="text-sm">Projection</span>
                    </Badge>
                    <MultiSelect
                        value={documentsForProjection}
                        onValueChange={(values) => setDocumentsForProjection(values)}
                        className="mt-2"
                    >
                        {documents.map((doc) => (
                            <MultiSelectItem
                                key={doc._id?.toString()}
                                value={doc._id ? doc._id.toString() : ""}
                                className={
                                    (doc._id && documentsForProjection.includes(doc._id.toString())) ||
                                        (doc._id && documentsForDirect.includes(doc._id.toString())) ||
                                        (doc._id && documentsForCollateral.includes(doc._id.toString())) ||
                                        (doc._id && documentsForUpdate.includes(doc._id.toString()))
                                        ? "opacity-50 cursor-not-allowed no-click"
                                        : ""
                                }
                            >
                                {doc.title}
                            </MultiSelectItem>
                        ))}
                    </MultiSelect>
                </div>

                {/* Update Section */}
                <div className="col-span-full sm:col-span-1">
                    <Badge icon={RiLoopLeftLine} className="text-sm flex items-center gap-2"
                        color="gray">
                        <span className="text-sm icon-text">Update</span>
                    </Badge>
                    <MultiSelect
                        value={documentsForUpdate}
                        onValueChange={(values) => setDocumentsForUpdate(values)}
                        className="mt-2"
                    >
                        {documents.map((doc) => (
                            <MultiSelectItem
                                key={doc._id?.toString()}
                                value={doc._id ? doc._id.toString() : ""}
                                className={
                                    (doc._id && documentsForProjection.includes(doc._id.toString())) ||
                                        (doc._id && documentsForDirect.includes(doc._id.toString())) ||
                                        (doc._id && documentsForCollateral.includes(doc._id.toString())) ||
                                        (doc._id && documentsForUpdate.includes(doc._id.toString()))
                                        ? "opacity-50 cursor-not-allowed no-click"
                                        : ""
                                }
                            >
                                {doc.title}
                            </MultiSelectItem>
                        ))}
                    </MultiSelect>
                </div>
            </div>

        </>
    )
}


export function FormDocumentDatePicker({
    issuanceDate,
    setIssuanceDate
}: {
    issuanceDate: DateRange | undefined,
    setIssuanceDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}) {
    return (

        <div className="col-span-full mt-4">
            <label
                htmlFor="issuance-date"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
                Issuance date
                <span className="text-red-500">*</span>
            </label>
            <DatePicker
                id="issuance-date"
                className="mt-2"
                value={issuanceDate?.from}
                onValueChange={d => setIssuanceDate({ from: d })}
                enableYearNavigation={true}
                weekStartsOn={1}
                enableClear={false}
            />
        </div>
    )


}

interface DateRangePickerPresetsProps {
    issuanceDate: DateRange | undefined;
    setIssuanceDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
    hasError: boolean;
}

export const DateRangePickerPresets: React.FC<DateRangePickerPresetsProps> = ({
    issuanceDate,
    setIssuanceDate,
    hasError
}) => {
    const issuanceYear = issuanceDate?.from ? issuanceDate.from.getFullYear() : new Date().getFullYear();
    const issuanceMonth = issuanceDate?.from ? issuanceDate.from.getMonth() : new Date().getMonth();
    const presets = [
        {
            label: "Today",
            dateRange: {
                from: new Date(),
                to: new Date(),
            },
        },
        {
            label: "Last 7 days",
            dateRange: {
                from: new Date(new Date().setDate(new Date().getDate() - 7)),
                to: new Date(),
            },
        },
        {
            label: "Last 30 days",
            dateRange: {
                from: new Date(new Date().setDate(new Date().getDate() - 30)),
                to: new Date(),
            },
        },
        {
            label: "Last 3 months",
            dateRange: {
                from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
                to: new Date(),
            },
        },
        {
            label: "Last 6 months",
            dateRange: {
                from: new Date(new Date().setMonth(new Date().getMonth() - 6)),
                to: new Date(),
            },
        },
        {
            label: "Month",
            dateRange: {
                from: new Date(issuanceYear, issuanceMonth, 1),
                to: new Date(issuanceYear, issuanceMonth + 1, 0),
            },
        },
        {
            label: "Year",
            dateRange: {
                from: new Date(issuanceYear, 0, 1),
                to: new Date(issuanceYear, 11, 31),
            },
        },
    ];

    return (
        <div className="flex flex-col items-center gap-y-2 pt-4 w-full">
            <label
                htmlFor="issuance-date"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong self-start"
            >
                Issuance date
                <span className="text-red-500">*</span>
            </label>
            <DateRangePicker
                enableYearNavigation
                hasError={hasError}
                presets={presets}
                value={issuanceDate}
                onChange={setIssuanceDate}
                className="w-full bg-white border-[#E5E7EB] dark:bg-[#121826] dark:text-white dark:border-[#212936]  dark:hover:bg-[#141A2A]"
            />
        </div>
    );
};
