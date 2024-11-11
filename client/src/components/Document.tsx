import { RiShareLine, RiFileCopyLine, RiCheckDoubleLine } from '@remixicon/react';
import { Button, Card, Dialog, DialogPanel } from '@tremor/react';
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionList,
} from '@tremor/react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { KxDocumentType, Stakeholders } from "../enum";
import { PreviewMap } from './map/Map';



export default function Document() {
    const { id } = useParams();
    const [share, setShare] = useState(false);

    const [title, setTitle] = useState("Adjusted development plan for Kiruna");
    const [stakeholders, setStakeholders] = useState<Stakeholders[]>([Stakeholders.RESIDENT, Stakeholders.URBAN_DEVELOPER]);
    const [scale, setScale] = useState(7500);
    const [issuanceDate, setIssuanceDate] = useState<Date | undefined | string>(
        "2015"
    );
    const [type, setType] = useState<KxDocumentType | undefined>(KxDocumentType.DESIGN);
    const [language, setLanguage] = useState<string | undefined>("Swedish");
    const [pages, setPages] = useState("1");
    const [description, setDescription] = useState<string | undefined>(` This document is the update of the Development 
                                                                        Plan, one year after its creation, modifications are 
                                                                        made to the general master plan, which is publi
                                                                        shed under the name 'Adjusted Development 
                                                                        Plan91,' and still represents the version used today 
                                                                        after 10 years. Certainly, there are no drastic differen
                                                                        ces compared to the previous plan, but upon careful 
                                                                        comparison, several modified elements stand out. 
                                                                        For example, the central square now takes its final 
                                                                        shape, as well as the large school complex just north 
                                                                        of it, which appears for the first time`);


    const [showCheck, setShowCheck] = useState(false);

    return (
        <div>
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
                            <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>{language}</i>
                        </div>

                        <div className="flex items-center justify-between mb-2 space-x-2">
                            <i className="text-sm font-light text-tremor-content-strong dark:text-dark-tremor-content-strong">Pages:</i>
                            <i className='text-md font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'> {pages} </i>
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