import { Button, DatePicker, Dialog, DialogPanel, Divider, SearchSelect, SearchSelectItem, TextInput, Textarea  } from '@tremor/react';
import { useState } from 'react';
import locales from './../../locales.json'
import { parseLocalizedNumber } from '../../utils';

export function FormDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [scale, setScale] = useState(10000);
    return (
        <>
            <Button className="mx-auto block" onClick={() => setIsOpen(true)}>Open Dialog</Button>
            <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true} >
                <DialogPanel className="w-80vm sm:w-4/5 md:w-4/5 lg:w-3/3 xl:w-1/2" style={{ maxWidth: "80vw" }}>
                    <div className="sm:mx-auto sm:max-w-2xl">
                        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Add new document description
                        </h3>
                        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                            Add the description of the document
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
                                <div className="col-span-full">
                                    <label
                                        htmlFor="stakeholders"
                                        className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                    >
                                        Stakeholders
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <TextInput
                                        type="text"
                                        id="stakeholders"
                                        name="stakeholders"
                                        autoComplete="stakeholders"
                                        placeholder="Stakeholders"
                                        className="mt-2"
                                        required
                                    />
                                </div>
                                <div className="col-span-full">
                                    <label
                                        htmlFor="scale"
                                        className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                    >
                                        Scale
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <TextInput
                                        id="scale"
                                        defaultValue="10000"
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
                                <div className="col-span-full">
                                    <label
                                        htmlFor="type"
                                        className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                    >
                                        Type
                                    </label>
                                    <TextInput
                                        type="text"
                                        id="type"
                                        name="type"
                                        autoComplete="off"
                                        placeholder="Type"
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-full">
                                    <label
                                        htmlFor="connections"
                                        className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                    >
                                        Connections
                                    </label>
                                    <TextInput
                                        type="text"
                                        id="connections"
                                        name="connections"
                                        autoComplete="off"
                                        placeholder="Connections"
                                        className="mt-2"
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
                                                return <SearchSelectItem value={l.code}>{l.name}</SearchSelectItem>
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
                                        autoComplete="pages"
                                        placeholder="Pages"
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-full">
                                    <label
                                        htmlFor="coordinates"
                                        className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                    >
                                        Coordinates
                                    </label>
                                    <TextInput
                                        id="coordinates"
                                        name="coordinates"
                                        autoComplete="coordinates"
                                        placeholder="Coordinates"
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <Divider />
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