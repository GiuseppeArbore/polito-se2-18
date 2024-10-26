import { Button, Dialog, DialogPanel, Divider, TextInput } from '@tremor/react';
import { useState } from 'react';

export function FormDialog() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button className="mx-auto block" onClick={() => setIsOpen(true)}>Open Dialog</Button>
            <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true} >
                    <DialogPanel style={{ width: "100%", maxWidth: "80vw" }}>
                        <div className="sm:mx-auto sm:max-w-2xl">
                            <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Add new document description
                            </h3>
                            <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                                Add the description of the document 
                            </p>
                            <form action="#" method="post" className="mt-8">
                                <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                                    <div className="col-span-full sm:col-span-3">
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
                                    <div className="col-span-full sm:col-span-3">
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
                                            name="stakeholderse"
                                            autoComplete="stakeholders"
                                            placeholder="Stakeholders"
                                            className="mt-2"
                                            required
                                        />
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
                                            type="text"
                                            id="scale"
                                            name="scale"
                                            autoComplete="scale"
                                            placeholder="Scale"
                                            className="mt-2"
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
                                        <TextInput
                                            type="text"
                                            id="issuance-date"
                                            name="issuance-date"
                                            autoComplete="off"
                                            placeholder="Issuance date"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
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
                                    <div className="col-span-full sm:col-span-2">
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
                                    <div className="col-span-full sm:col-span-2">
                                        <label
                                            htmlFor="language"
                                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                        >
                                            Language
                                        </label>
                                        <TextInput
                                            id="language"
                                            name="language"
                                            autoComplete="language"
                                            placeholder="Language"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
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
                                    <div className="col-span-full sm:col-span-2">
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
                                        <TextInput
                                            type="text"
                                            id="description"
                                            name="description"
                                            autoComplete="off"
                                            placeholder="Description"
                                            className="mt-2"
                                        />
                                    </div>
                                <Divider />
                                <div className="flex items-center justify-end space-x-4">
                                    <button
                                        type="button"
                                        className="whitespace-nowrap rounded-tremor-small px-4 py-2.5 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="whitespace-nowrap rounded-tremor-default bg-tremor-brand px-4 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>


                        <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 sm:justify-end">
                            <Button className="w-full sm:w-auto mt-4 sm:mt-0" variant="secondary" onClick={() => setIsOpen(false)}>
                                Go back
                            </Button>
                            <Button className="w-full sm:w-auto" onClick={() => setIsOpen(false)}>
                                Save
                            </Button>
                        </div>
                    </DialogPanel>


            </Dialog>
        </>
    );
}