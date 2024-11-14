import { RiShareLine, RiFileCopyLine, RiCheckDoubleLine, RiHome3Line } from '@remixicon/react';
import { Button, Card, Dialog, DialogPanel } from '@tremor/react';
import {
    Accordion,
    AccordionBody,
    AccordionHeader
} from '@tremor/react';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { KxDocumentType, Stakeholders } from "../enum";
import { PreviewMap } from './map/Map';
import API from '../API';
import { KxDocument, PageRange } from '../model';
import { mongoose } from '@typegoose/typegoose';



export default function Document() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [doc, setDoc] = useState<KxDocument | null>(null);
    const [share, setShare] = useState(false);

    const [title, setTitle] = useState("");
    const [stakeholders, setStakeholders] = useState<Stakeholders[]>([]);
    const [scale, setScale] = useState("");
    const [issuanceDate, setIssuanceDate] = useState<Date | undefined | string>("");
    const [type, setType] = useState<KxDocumentType | undefined>(undefined);
    const [language, setLanguage] = useState<string | undefined>("");
    const [pages, setPages] = useState<PageRange[] | "">("");
    const [description, setDescription] = useState<string | undefined>("");

    useEffect(() => {
        const fetchDocument = async () => {
            try {
            const document = await API.getKxDocumentById(new mongoose.Types.ObjectId(id!));
            setDoc(document);
            setTitle(document.title);
            setStakeholders(document.stakeholders);
            setScale(document.scale.toString());
            setIssuanceDate(document.issuance_date);
            setType(document.type);
            setLanguage(document.language || "");
            setPages(document.pages || "");
            setDescription(document.description || "");
            } catch (error) {
            console.error("Failed to fetch document:", error);
            navigate("/404");
            }
        };

        fetchDocument();
    });


    const [showCheck, setShowCheck] = useState(false);

    return (
        <div>
            <div className='flex flex-row mb-2'>
                <i onClick={() => navigate("/")}><RiHome3Line className="mt-1 text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong" /></i>
                <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Document Page</h1>


            </div>
            <Card>
                <div className='flex flex-row '>

                    <div className="flex flex-col items-start justify-between lg:w-1/2 lg:border-r lg:border-gray-300 me-6">
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
                            <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>{language != "" ? language : "Unknown"}</i>
                        </div>

                        <div className="flex items-center justify-between mb-2 space-x-2">
                            <i className="text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Pages:</i>
                            <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'> {pages != "" ? pages : "Unknown"} </i>
                        </div>

                    </div>
                    <div className='hidden lg:flex flex-col items-start col space-y-2 w-1/2'>
                        <i className="text-md font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Description:</i>
                        <i className='text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong'> {description}  </i>
                    </div>
                    <i onClick={() => setShare(true)}><RiShareLine className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong" /></i>
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
                <Accordion className='lg:hidden'>
                    <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Description</AccordionHeader>
                    <AccordionBody className="leading-6">
                        {description}
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