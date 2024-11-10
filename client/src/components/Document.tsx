import { RiShareLine, RiEditBoxLine } from '@remixicon/react';
import { Button, Card, Dialog, DialogPanel } from '@tremor/react';
import { FormDialog, FormDocumentDescription, FormDocumentInformation } from "./form/Form";
import API from '../API';
//import { FileUpload } from './DragDrop';

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionList,
} from '@tremor/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AreaType, DocCoords, KxDocumentType, Scale, Stakeholders } from "./../enum";
import { KxDocument } from "./../model";
import {
  parseLocalizedNumber,
  PageRange,
  validatePageRangeString,
} from "./../utils";

import { PreviewMap } from './map/Map';
import { toast } from "./../utils/toaster";
import { Toaster } from "./toast/Toaster";


export default function Document() {
  const { id } = useParams<string>();
  if (!id) {
    return <div>Document not found</div>;
  }
  const [share, setShare] = useState(false);
  const [showEditDocument, setShowEditDocument] = useState(false);
  const [showEditDescription, setShowEditDescription] = useState(false);

  const [title, setTitle] = useState("Adjusted development plan for Kiruna");
  const [stakeholders, setStakeholders] = useState<Stakeholders[]>([Stakeholders.RESIDENT, Stakeholders.URBAN_DEVELOPER]);
  const [scale, setScale] = useState(7500);
  const [issuanceDate, setIssuanceDate] = useState<Date | undefined>(
    new Date(2021, 5, 1)
  );
  const [type, setType] = useState<KxDocumentType | undefined>(KxDocumentType.DESIGN);
  const [language, setLanguage] = useState<string | undefined>("Swedish");
  const [pages, setPages] = useState("1");
  const [pageRanges, setPageRanges] = useState<PageRange[] | undefined>([]);


  const [description, setDescription] = useState<string | undefined>(`This document is the update of the Development Plan, one year after its creation, modifications are made to the general master plan, which is published under the name 'Adjusted Development Plan91,' and still represents the version used today after 10 years.
Certainly, there are no drastic differences compared to the previous plan, but upon careful comparison, several modified elements stand out. 
For example, the central square now takes its final shape, as well as the large school complex just north of it, which appears for the first time`);



  const [documents, setDocuments] = useState<KxDocument[]>([]);
  const [documentsForDirect, setDocumentsForDirect] = useState<string[]>([]);
  const [documentsForCollateral, setDocumentsForCollateral] = useState<string[]>([]);
  const [documentsForProjection, setDocumentsForProjection] = useState<string[]>([]);
  const [documentsForUpdate, setDocumentsForUpdate] = useState<string[]>([]);
  const [showConnectionsInfo, setShowConnectionsInfo] = useState(false);


  const [drawing, setDrawing] = useState<any>(undefined);


  return (
    <div>
      <Card>
        <div className='flex flex-row '>

          <div className="flex flex-col items-start justify-between lg:w-1/2 lg:border-r lg:border-gray-300 w-full max-w-full lg:max-w-none">
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
              <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>1: {scale}</i>
            </div>

            <div className="flex items-center justify-between mb-2 space-x-2">
              <i className="text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Issuance Date:</i>
              <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'> {issuanceDate?.toString()}</i>
            </div>

            <div className="flex items-center justify-between mb-2 space-x-2">
              <i className="text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Type:</i>
              <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>{type} </i>
            </div>

            <div className="flex items-center justify-between mb-2 space-x-2">
              <i className="text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Language:</i>
              <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>{language}</i>
            </div>

            <div className="flex items-center justify-between mb-2 space-x-2">
              <i className="text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Pages:</i>
              <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'> {pages} </i>
            </div>
            <FormInfoDialog
              title={title}
              setTitle={setTitle}
              stakeholders={stakeholders}
              setStakeholders={setStakeholders}
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
              description={description}
              setDescription={setDescription}
              documents={documents}
              setDocuments={setDocuments}
              draw={undefined}
              setDrawing={setDrawing}
              documentsForDirect={documentsForDirect}
              documentsForCollateral={documentsForCollateral}
              documentsForProjection={documentsForProjection}
              documentsForUpdate={documentsForUpdate} />


          </div>
          <div className='hidden lg:flex flex-col items-start col space-y-2 w-1/2 h-300 ms-6'>
            <i className="text-md font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Description:</i>
            <i className='text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong'> {description}  </i>
          </div>
          <div className='hidden lg:flex flex-col space-y-2 h-300 justify-between'>
            <i onClick={() => setShare(true)} className="self-start"><RiShareLine className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong" /></i>
            <FormDescriptionDialog
              description={description}
              setDescription={setDescription}
              id={id}
            />
          </div>
          <Dialog open={share} onClose={() => setShare(false)} static={true}>
            <DialogPanel>
              <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Share "{title}"</h3>
              <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Share the link of the document with your friends and colleagues.
              </p>
              <div className="flex flex-row justify-between">
                <div className="mt-4 w-full  me-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-tremor-border rounded-md"
                    value={`http://localhost:1420/documents/${id}`}
                    readOnly
                  />
                </div>

                <Button
                  className="mt-4 w-1/6 flex flex-col items-center justify-between"
                  onClick={() => {
                    navigator.clipboard.writeText(`http://localhost:1420/documents/${id}`);
                    alert("Link copied to clipboard!");
                    setShare(false);
                  }}
                >

                  <RiShareLine className="mr-2" />
                </Button>
              </div>
              <Button className="mt-8 w-full secondary" onClick={() => setShare(false)}>
                Close
              </Button>
            </DialogPanel>
          </Dialog>

        </div>
        <Accordion className='lg:hidden'>
          <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Description</AccordionHeader>
          <AccordionBody className="leading-6 flex flex-col">
            {description}
            <FormDescriptionDialog
              description={description}
              setDescription={setDescription}
              id={id}
            />
          </AccordionBody>
        </Accordion>

        <Card
          className={`my-4 p-0 overflow-hidden cursor-pointer ${"ring-tremor-ring"}`}
        >
          <PreviewMap
            drawing={undefined}
            style={{ minHeight: "300px", width: "100%" }}
          />
        </Card>

      </Card>

      

    </div>
  );
}




export function FormInfoDialog(
  {
    title,
    setTitle,
    stakeholders,
    setStakeholders,
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
    description,
    setDescription,
    documents,
    setDocuments,
    draw,
    setDrawing,
    documentsForDirect,
    documentsForCollateral,
    documentsForProjection,
    documentsForUpdate
  }: {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    stakeholders: Stakeholders[];
    setStakeholders: React.Dispatch<React.SetStateAction<Stakeholders[]>>;
    issuanceDate: Date | undefined;
    setIssuanceDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    type: KxDocumentType | undefined;
    setType: React.Dispatch<React.SetStateAction<KxDocumentType | undefined>>;
    scale: number;
    setScale: React.Dispatch<React.SetStateAction<number>>;
    language: string | undefined;
    setLanguage: React.Dispatch<React.SetStateAction<string | undefined>>;
    pages: string;
    setPages: React.Dispatch<React.SetStateAction<string>>;
    pageRanges: PageRange[] | undefined;
    setPageRanges: React.Dispatch<React.SetStateAction<PageRange[] | undefined>>;
    description: string | undefined;
    setDescription: React.Dispatch<React.SetStateAction<string | undefined>>;
    documents: KxDocument[];
    setDocuments: React.Dispatch<React.SetStateAction<KxDocument[]>>;
    draw: DocCoords | undefined;
    setDrawing: React.Dispatch<React.SetStateAction<DocCoords | undefined>>;
    documentsForDirect: string[];
    documentsForCollateral: string[];
    documentsForProjection: string[];
    documentsForUpdate: string[];
  }
) {
  const [titleError, setTitleError] = useState(false);
  const [shError, setShError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tmpTitleError = title.length === 0;
    const tmpShError = stakeholders.length === 0;
    if (tmpTitleError || tmpShError || !type) {
      setTitleError(tmpTitleError);
      setShError(tmpShError);
      setTypeError(!type);
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
    } catch (error: any) {
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

    setError("");

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

  function infoform() {
    return (
      <form action="" method="patch" className="mt-8">

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
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto primary"
            onClick={e => handleInfoSubmit(e)}
          >
            Submit
          </Button>
        </div>

      </form>
    )
  }

  return (
    <>
      <i className="ml-auto self-end" onClick={() => setIsOpen(true)}><RiEditBoxLine className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong lg:me-6" /></i>
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
            {infoform()}


          </div>
        </DialogPanel>
      </Dialog>
      <Toaster />
    </>
  );
}

export function FormDescriptionDialog(
  {
    description,
    setDescription,
    id
  }: {
    description: string | undefined;
    setDescription: React.Dispatch<React.SetStateAction<string | undefined>>;
    id: string;
  }
) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const handleDescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description === undefined || description.length === 0) {
      setError("Please fill the description field");
      return;
    }
    //API call to update description
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

  return (
    <>
      <i className="self-start" onClick={() => setIsOpen(true)}><RiEditBoxLine className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong" /></i>
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
                } }              />
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