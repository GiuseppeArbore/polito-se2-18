
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
  Switch
} from "@tremor/react";
import { useState, useEffect } from "react";
import locales from "./../../locales.json";
import { PreviewMap, SatMap } from "../map/Map";
import API from "../../API";
import { AreaType, DocCoords, KxDocumentType, Scale, Stakeholders } from "../../enum";
import { KxDocument } from "../../model";
import {
  RiArrowDownCircleLine,
  RiLinksLine,
  RiLoopLeftLine,
  RiProjector2Line,
  RiInformation2Line
} from "@remixicon/react";

import {
  parseLocalizedNumber,
  PageRange,
  validatePageRangeString,
} from "../../utils";
import "../../index.css";
import { toast } from "../../utils/toaster";
import { Toaster } from "../toast/Toaster";

export class Link {
  connectionType: string = "";
  documents: string[] = [];
}

export function FormDialog() {
  const [drawing, setDrawing] = useState<any>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [stakeholders, setStakeholders] = useState<Stakeholders[]>([]);
  const [shError, setShError] = useState(false);
  const [issuanceDate, setIssuanceDate] = useState<Date | undefined>(
    new Date()
  );
  const [type, setType] = useState<KxDocumentType | undefined>(undefined);
  const [typeError, setTypeError] = useState(false);
  const [scale, setScale] = useState(10000);
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [pages, setPages] = useState("");
  const [hideMap, setHideMap] = useState<boolean>(false);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [descriptionError, setDescriptionError] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [showConnectionsInfo, setShowConnectionsInfo] = useState(false);
  const [showGeoInfo, setShowGeoInfo] = useState(false);


  const [docCoordinates, _ ] = useState<DocCoords | undefined>(undefined);
  // Example usage
  //const [docCoordinates, setDocCoordinates] = useState<DocCoords | undefined>({type: AreaType.ENTIRE_MUNICIPALITY});

  

  const [docCoordinatesError, setDocCoordinatesError] = useState(false);

  const [pageRanges, setPageRanges] = useState<PageRange[] | undefined>([]);

  const [documents, setDocuments] = useState<KxDocument[]>([]);
  const [documentsForDirect, setDocumentsForDirect] = useState<string[]>([]);
  const [documentsForCollateral, setDocumentsForCollateral] = useState<string[]>([]);
  const [documentsForProjection, setDocumentsForProjection] = useState<string[]>([]);
  const [documentsForUpdate, setDocumentsForUpdate] = useState<string[]>([]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tmpTitleError = title.length === 0;
    const tmpShError = stakeholders.length === 0;
    let draw: DocCoords | undefined;
    if (!hideMap && (drawing && drawing.features.length === 1 && drawing.features[0].geometry.type === "Point")) {
      draw = {
        type: AreaType.POINT,
        coordinates: drawing.features[0].geometry.coordinates,
      };
    } else if (!hideMap && (drawing && drawing.features.length >= 1)) {
      //TODO: add support for multiple polygons
      let cord = drawing.features.map((f: any) => f.geometry.coordinates).length === 1 ? drawing.features[0].geometry.coordinates : setDocCoordinatesError(true);
      draw = {
        type: AreaType.AREA,
        coordinates: cord,
      };
    } else {
      draw = {
        type: AreaType.ENTIRE_MUNICIPALITY
      };
    }
    if (tmpTitleError || tmpShError || !type || !description || !draw || (drawing === undefined && !hideMap) ) {
      setTitleError(tmpTitleError);
      setShError(tmpShError);
      setTypeError(!type);
      setDescriptionError(!description);
      hideMap ? setDocCoordinatesError(false) : setDocCoordinatesError(!docCoordinates);
      setDocCoordinatesError(true);
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
      scale_info: Scale.TEXT,
      scale,
      doc_coordinates: draw,
      issuance_date: issuanceDate,
      type: type,
      language,
      description,
      pages: validatePageRangeString(pages),
      connections: {
        direct: documentsForDirect,
        collateral: documentsForCollateral,
        projection: documentsForProjection,
        update: documentsForUpdate,
      },
    };

    try {
      const createdDocument = await API.createKxDocument(newDocument);
      if (createdDocument) {
        setDocuments([...documents, createdDocument]);
        toast({
          title: "Success",
          description:
            "The document has been created successfully",
          variant: "success",
          duration: 3000,
        })

        setTitle("");
        setStakeholders([]);
        setScale(0);
        setIssuanceDate(new Date());
        setType(undefined);
        setLanguage(undefined);
        setDescription("");
        setPages("");
        setDrawing(undefined);
        setPageRanges([]);
      } else {
        toast({
          title: "Error",
          description: "Failed to create document",
          variant: "error",
          duration: 3000,
        })
      }
      setIsOpen(false);
    } catch (error:any) {
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "error",
        duration: 3000,
      })
    }
    clearForm();
  };

  function clearForm() {
    setTitle("");
    setTitleError(false);
    setStakeholders([]);
    setShError(false);
    setIssuanceDate(new Date());
    setType(undefined);
    setTypeError(false);
    setScale(10000);
    setLanguage(undefined);
    setPages("");
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
  }

  useEffect(() => {
    if (isOpen) {
      const fetchDocuments = async () => {
        try {
          const docs = await API.getAllKxDocuments();
          setDocuments(docs);
        } catch (error) {
          setError('Failed to fetch documents');
        }
      };

      fetchDocuments();
    }
  }, [isOpen]);


  return (
    <>
      <Button className="w-full primary" onClick={() => {setIsOpen(true); clearForm() }}>
        Add new document
      </Button>
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
            <form action="#" method="post" className="mt-8">
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
                    onValueChange={s => setStakeholders(s.map(sh => Stakeholders[sh as keyof typeof Stakeholders]))}
                    error={shError}
                    errorMessage="You must select at least one stakeholder."
                    required
                  >
                    {
                      Object.entries(Stakeholders).map((dt) => {
                        return (
                          <MultiSelectItem key={`sh-${dt[0]}`} value={dt[0]}>
                            {dt[1]}
                          </MultiSelectItem>
                        );
                      })
                    }
                  </MultiSelect>
                </div>
                <div className="col-span-full">
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
                    value={issuanceDate}
                    onValueChange={d => setIssuanceDate(d)}
                    enableYearNavigation={true}
                    weekStartsOn={1}
                    enableClear={false}
                  />
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
                    onValueChange={t => setType(KxDocumentType[t as keyof typeof KxDocumentType])}
                    error={typeError}
                    errorMessage="The type is mandatory"
                    required
                  >
                    {
                      Object.entries(KxDocumentType).map((dt) => {
                        return (
                          <SearchSelectItem key={`type-${dt[0]}`} value={dt[0]}>
                            {dt[1]}
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
                  <TextInput
                    id="scale"
                    value={scale.toLocaleString()}
                    onValueChange={(v) => {
                      if (v === "") {
                        setScale(0);
                        return;
                      }
                      const num = parseLocalizedNumber(v);
                      if (
                        !Number.isNaN(num) &&
                        Number.isInteger(num) &&
                        num >= 0 &&
                        num <= 10_000_000_000_000
                      ) {
                        setScale(num);
                      }
                    }}
                    name="scale"
                    autoComplete="scale"
                    placeholder="10.000"
                    className="mt-2"
                    icon={() => (
                      <p className="border-r h-full text-tremor-default text-end text-right tremor-TextInput-icon shrink-0 h-5 w-5 mx-2.5 absolute left-0 flex items-center text-tremor-content-subtle dark:text-dark-tremor-content-subtle">
                        1:
                      </p>
                    )}
                    required
                  />
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
                          {l.name}
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
                    onValueChange={(v: string) => {
                      setPages(v);
                    }}
                    error={!pageRanges ? true : false}
                    errorMessage='Invalid page range. Examples of valid ranges: "10" or "1-5" or "1-5,6"'
                    autoComplete="pages"
                    placeholder="Pages"
                    className="mt-2"
                  />
                </div>
              </div>
              <Divider />
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
                  onChange={setHideMap}
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
                  ></SatMap>
                </DialogPanel>
              </Dialog>

              <Divider />

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

              <Divider />


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
            </form>
          </div>
        </DialogPanel>
      </Dialog>
      <Toaster/>
    </>
  );
}
