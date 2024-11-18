import { Dialog, DialogPanel, Button } from "@tremor/react";
import { Viewer, Worker, ViewMode } from '@react-pdf-viewer/core';
import { RiFileCloseFill } from "@remixicon/react";
import { KxDocument } from "../../model";
import { useEffect, useState } from "react";
import API from "../../API";
import { toast } from "../../utils/toaster";
import { mongoose } from "@typegoose/typegoose";
import '@react-pdf-viewer/core/lib/styles/index.css';

export default function PreviewDoc(open: boolean, setOpen: (bool: boolean) => void, doc: KxDocument) {

    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                if (doc && doc._id) {
                    const url = await API.getKxFileByID(new mongoose.Types.ObjectId("6730daada436c299749f589e"), "doc_63_info.pdf");
                    setFileUrl(url.presignedUrl);
                }
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Failed to retrieve file",
                    variant: "error",
                    duration: 3000,
                })
            }
        };
        fetchDocuments();
    }, [doc]);

    return (
        <Dialog open={open} onClose={() => setOpen(false)} static={true}>
            <DialogPanel>
                <div className="flex justify-start items-center mb-4">
                    <Button onClick={() => setOpen(false)} icon={RiFileCloseFill} className="mr-6"></Button>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        Open PDF in new tab
                    </a>

                </div>
                <div className="flex justify-center items-center ml-10">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        {fileUrl && <Viewer fileUrl={fileUrl} viewMode={ViewMode.SinglePage}/>}
                    </Worker>
                </div>
            </DialogPanel>
        </Dialog>
    );
};