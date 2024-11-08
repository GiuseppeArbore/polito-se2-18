import { RiInformation2Line } from '@remixicon/react';
import { Card, DatePicker, Divider, MultiSelect, SearchSelect, SearchSelectItem, TextInput } from '@tremor/react';
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionList,
} from '@tremor/react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { KxDocument } from "../model";
import { KxDocumentType, Stakeholders } from "../enum";
import { PreviewMap } from './map/Map';



export default function Document() {
    const { id } = useParams();

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
    const [hideMap, setHideMap] = useState<boolean>(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [showConnectionsInfo, setShowConnectionsInfo] = useState(false);



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
                </div>
                <Accordion className='lg:hidden'>
                    <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Description</AccordionHeader>
                    <AccordionBody className="leading-6">
                        {description}
                    </AccordionBody>
                </Accordion>

                <Card
                    className={`my-4 p-0 overflow-hidden cursor-pointer ${ "ring-tremor-ring"}`}
                    onClick={() => setIsMapOpen(true)}
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