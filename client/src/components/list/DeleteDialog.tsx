import { RiShareLine } from "@remixicon/react";
import { Dialog, DialogPanel, Button } from "@tremor/react";

export default function DeleteDialog(open: boolean, setOpen: (bool: boolean) => void, deleteFn: () => void, title: string) {

    return (
        <Dialog open={open} onClose={() => setOpen(false)} static={true}>
            <DialogPanel>
                <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Delete</h3>
                <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    Are you sure you want to delete the document with title:
                </p>
                <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content font-bold">
                    {title}
                </p>
                <div className="mt-8 flex flex-col-reverse sm:flex-row sm:space-x-4 sm:justify-end">
                <Button
                    className="w-full sm:w-auto mt-4 sm:mt-0 secondary"
                    variant="light"
                    onClick={() => setOpen(false)}
                >
                    Cancel
                </Button>
                <Button
                    className="w-full sm:w-auto primary"
                    onClick={() => {
                        deleteFn();
                        setOpen(false);
                    }}
                >
                    Submit
                </Button>
                </div>
            </DialogPanel>
        </Dialog>
    );
};