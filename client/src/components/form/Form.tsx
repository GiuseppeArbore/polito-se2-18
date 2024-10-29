import { Button, Card, DatePicker, Dialog, DialogPanel, Divider, MultiSelect, MultiSelectItem, SearchSelect, SearchSelectItem, TextInput, Textarea } from '@tremor/react';
import { useState } from 'react';
import locales from './../../locales.json'
import docTypes from './../../docTypes.json'
import { PreviewMap, SatMap } from '../map/Map';
import { parseLocalizedNumber, PageRange, validatePageRangeString } from '../../utils';


export function FormDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [scale, setScale] = useState(10000);
    const [pages, setPages] = useState("");
    const [pageRanges, setPageRanges] = useState<PageRange[] | undefined>([]);


    return (
        <>

            <Button className="mx-auto block mb-2" onClick={() => setIsOpen(true)}>Add new document</Button >
            <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true} >
                <DialogPanel className="w-80vm sm:w-4/5 md:w-4/5 lg:w-3/3 xl:w-1/2" style={{ maxWidth: "80vw" }}>
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
                                        autoComplete="title"
                                        placeholder="Title"
                                        className="mt-2"
                                        required
                                    />
                                </div>
                                <div className="col-span-full" >
                                    <label
                                        htmlFor="stakeholders"
                                        className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                    >
                                        Stakeholders
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <MultiSelect>
                                        <MultiSelectItem key="sh-1" value="1">Urban Developer</MultiSelectItem>
                                        <MultiSelectItem key="sh-2" value="2">Urban Planner</MultiSelectItem>
                                        <MultiSelectItem key="sh-3" value="3">Resident</MultiSelectItem>
                                        <MultiSelectItem key="sh-4" value="4">Visitor</MultiSelectItem>
                                    </MultiSelect>

                                </div>
                                <div className="col-span-full">
                                    <label
                                        htmlFor="issuance-date"
                                        className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                    >
                                        Issuance date
                                    </label>
                                    <DatePicker
                                        id="issuance-date"
                                        className="mt-2"
                                        enableYearNavigation={true}
                                        weekStartsOn={1}
                                    />
                                </div>


                                <div className="col-span-full sm:col-span-3">
                                    <label
                                        htmlFor="type"
                                        className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                    >
                                        Type
                                    </label>
                                    <SearchSelect
                                        id="doc_type"
                                        name="doc_type"
                                        className="mt-2"
                                        required
                                    >
                                        {
                                            docTypes.flatMap((dt, i, arr) => {
                                                // Tremor does not seem to allow to do this
                                                //const prev = arr.at(i - 1);
                                                //const separator = (prev && prev.category !== dt.category) ?
                                                //    <p
                                                //        className="text-tremor-label text-sm font-semibold italic ps-5 text-tremor-content-weak dark:text-dark-tremor-content-weak"
                                                //        key={`separator-${i}`}
                                                //    >
                                                //        {dt.category}
                                                //    </p> : null;
                                                return <SearchSelectItem key={`type-${dt.id}`} value={dt.id}>{dt.name}</SearchSelectItem>;
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
                                            if (!Number.isNaN(num) && Number.isInteger(num) && num >= 0 && num <= 10_000_000_000_000) {
                                                setScale(num);
                                            }
                                        }}
                                        name="scale"
                                        autoComplete="scale"
                                        placeholder="10.000"
                                        className="mt-2"
                                        icon={() =>
                                            <p
                                                className="border-r h-full text-tremor-default text-end text-right tremor-TextInput-icon shrink-0 h-5 w-5 mx-2.5 absolute left-0 flex items-center text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                                            >
                                                1:
                                            </p>
                                        }
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
                                    >
                                        {
                                            locales.map((l) => {
                                                return <SearchSelectItem key={`lang-${l.code}`} value={l.code}>{l.name}</SearchSelectItem>
                                            })
                                        }
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
                                        onBlur={() => {
                                            const range = validatePageRangeString(pages);
                                            setPageRanges(range);
                                        }}
                                        error={!pageRanges ? true : false}
                                        errorMessage='Invalid page range. Examples of valid ranges: "10" or "1-5" or "1-5,6"'
                                        autoComplete="pages"
                                        placeholder="Pages"
                                        className="mt-2"
                                    />
                                </div>

                            </div>
                            <Card className="my-4 p-0 overflow-hidden cursor-pointer" onClick={() => setIsMapOpen(true)}>
                                <PreviewMap style={{ minHeight: "300px", width: "100%" }}></PreviewMap>
                            </Card>
                            <Dialog open={isMapOpen} onClose={(val) => setIsMapOpen(val)} static={true} >
                                <DialogPanel className="p-0 overflow-hidden" style={{ maxWidth: "100%" }}>
                                    <SatMap style={{ minHeight: "95vh", width: "100%" }}></SatMap>
                                </DialogPanel>
                            </Dialog>
                            <div className="col-span-full">
                                <label
                                    htmlFor="description"
                                    className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                >
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Description"
                                    className="mt-2"
                                    style={{ minHeight: '200px' }}
                                />
                            </div>
                            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:space-x-4 sm:justify-end">
                                <Button className="w-full sm:w-auto mt-4 sm:mt-0" variant="light" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="w-full sm:w-auto" onClick={() => setIsOpen(false)}>
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>

                </DialogPanel>

            </Dialog>
        </>
    );
}