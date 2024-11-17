import { Dialog, DialogPanel, Button } from "@tremor/react";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { RiFileCloseFill } from "@remixicon/react";

export default function PreviewDoc(open: boolean, setOpen: (bool: boolean) => void) {
    return (
        <Dialog open={open} onClose={() => setOpen(false)} static={true}>
            <DialogPanel>
            <div className="flex justify-start items-center mb-4">
            <Button onClick={() => setOpen(false)} icon={RiFileCloseFill} className="mr-6"></Button>
                <a href="https://api.printnode.com/static/test/pdf/multipage.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Open PDF in new tab
                </a>
               
            </div>
            <div className="flex justify-center items-center ml-10">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl="https://api.printnode.com/static/test/pdf/multipage.pdf" />
            </Worker>
            </div>
            </DialogPanel>
        </Dialog>
    );
};