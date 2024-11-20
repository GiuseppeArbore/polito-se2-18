import { Dialog, DialogPanel, Button } from "@tremor/react";
import { Viewer, Worker, ViewMode } from '@react-pdf-viewer/core';
import { RiCloseLargeFill, RiCloseLargeLine, RiExternalLinkLine, RiFileCloseFill } from "@remixicon/react";
import { KxDocument } from "../../model";
import { useEffect, useState } from "react";
import API from "../../API";
import { toast } from "../../utils/toaster";
import { mongoose } from "@typegoose/typegoose";
import '@react-pdf-viewer/core/lib/styles/index.css';

export default function PreviewDoc(open: boolean, setOpen: (bool: boolean) => void, docId: mongoose.Types.ObjectId | undefined, title: string | undefined) {

    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                if (docId && title) {
                    const url = await API.getKxFileByID(docId, title);
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
    }, [docId, title]);

    return (
        <Dialog open={open} onClose={() => setOpen(false)} static={true}>
            <DialogPanel>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Document Preview</h2>
                    <div className="flex justify-end">
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" >
                            <Button icon={RiExternalLinkLine} className="mx-2"></Button>
                        </a>
                        <Button onClick={() => setOpen(false)} icon={RiCloseLargeFill} className="mr-2"></Button>

                    </div>
                </div>
                <div className="flex justify-center items-center ml-8">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        {fileUrl && <Viewer fileUrl={fileUrl} viewMode={ViewMode.SinglePage} />}
                    </Worker>
                </div>
            </DialogPanel>
        </Dialog>
    );
};