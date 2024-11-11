import React from 'react';
import { RiDeleteBinLine, RiFileLine, RiInformation2Line } from '@remixicon/react';
import { Callout, Divider, Select, SelectItem, TextInput } from '@tremor/react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface File {
    path: string;
    size: number;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export function FileUpload() {
    const [showAttachmentInfo, setShowAttachmentInfo] = useState(false);
    const [files, setFiles] = React.useState<File[]>([]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) =>
            setFiles(acceptedFiles.map(file => ({ path: file.name, size: file.size }))),
    });

    const filesList = files.map((file) => (
        <li
            key={file.path}
            className="relative rounded-tremor-default border border-tremor-border bg-tremor-background p-4 shadow-tremor-input dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:shadow-dark-tremor-input"
        >
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button
                    type="button"
                    className="rounded-tremor-small p-2 text-tremor-content-subtle hover:text-tremor-content dark:text-dark-tremor-content-subtle hover:dark:text-tremor-content"
                    aria-label="Remove file"
                    onClick={() =>
                        setFiles((prevFiles) =>
                            prevFiles.filter((prevFile) => prevFile.path !== file.path),
                        )
                    }
                >
                    <RiDeleteBinLine className="size-5 shrink-0" aria-hidden={true} />
                </button>
            </div>
            <div className="flex items-center space-x-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tremor-small bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle">
                    <RiFileLine
                        className="size-5 text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis"
                        aria-hidden={true}
                    />
                </span>
                <div>
                    <p className="text-tremor-label font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        {file.path}
                    </p>
                    <p className="mt-0.5 text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                        {file.size} bytes
                    </p>
                </div>
            </div>
        </li>
    ));

    return (
        <>
            <div className="sm:mx-auto sm:max-w-3xl">
            <div className="col-span-full sm:col-span-3 flex flex-row">
                <label
                  htmlFor="Attachments"
                  className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                >
                    Add original resources
                </label>
                <a
                className="ml-2"
                onClick={() => setShowAttachmentInfo(!showAttachmentInfo)}
                >
                <RiInformation2Line className="text-2xl" style={{ color: "#003d8e" }} />
                </a>
                </div>

                {showAttachmentInfo &&
                <Callout
                  className="mb-6"
                  style={{ border: "none" }}
                  title="Attachment guide"
                  color="gray"
                >
                    Add original resources about the document you are uploading.
                    You can Drag&Drop or click to upload files.
                </Callout>
              }
                <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-6">
                    <div className="col-span-full">
                        <label
                            htmlFor="file-upload-2"
                            className="text-tremor-default font-medium dark:text-dark-tremor-content-strong"
                        >
                            File(s) upload
                        </label>
                        <div
                            {...getRootProps()}
                            className={classNames(
                                isDragActive
                                    ? 'border-tremor-brand bg-tremor-brand-faint dark:border-dark-tremor-brand dark:bg-dark-tremor-brand-faint'
                                    : '',
                                'mt-2 flex justify-center rounded-tremor-default border border-dashed border-gray-300 px-6 py-20 dark:border-dark-tremor-border',
                            )}
                        >
                            <div>
                                <RiFileLine
                                    className="mx-auto h-12 w-12 text-tremor-content-subtle dark:text-dark-tremor-content"
                                    aria-hidden={true}
                                />
                                <div className="mt-4 flex text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                                    <p>Drag and drop or</p>
                                    <label
                                        htmlFor="file"
                                        className="relative cursor-pointer rounded-tremor-small pl-1 font-medium text-tremor-brand hover:underline hover:underline-offset-4 dark:text-dark-tremor-brand"
                                    >
                                        <span>choose file(s)</span>
                                        <input
                                            {...getInputProps()}
                                            id="file-upload-2"
                                            name="file-upload-2"
                                            type="file"
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="pl-1">to upload</p>
                                </div>
                            </div>
                        </div>
                        <p className="mt-2 text-tremor-label leading-5 text-tremor-content dark:text-dark-tremor-content sm:flex sm:items-center sm:justify-between">
                            <span>All file types are allowed to upload.</span>
                            <span className="pl-1 sm:pl-0">Max. size per file: 50MB</span>
                        </p>
                        {filesList.length > 0 && (
                            <>
                                <h4 className="mt-6 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    File(s) to upload
                                </h4>
                                <ul role="list" className="mt-4 space-y-4">
                                    {filesList}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
