import { Dialog, DialogPanel, Button } from "@tremor/react";

export default function DeleteDialog(open: boolean, setOpen: (bool: boolean) => void, deleteFn: () => void, title: string) {

    return (
        <Dialog open={open} onClose={() => setOpen(false)} static={true}>
            <DialogPanel>
                <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Delete Resources</h3>
                <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    Are you sure you want to delete the original resource with title:
                </p>
                <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content font-bold">
                    {title}
                </p>
                <div className="mt-8 flex flex-col-reverse sm:flex-row sm:space-x-4 sm:justify-end">
                    <Button
                        color="neutral"
                        style={{ color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : 'light' }}
                        className="w-full sm:w-auto mt-4 sm:mt-0 secondary"
                        variant="light"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        className="w-full sm:w-auto primary"
                        onClick={() => {
                            deleteFn();
                            setOpen(false);
                        }}
                        style={{ backgroundColor: 'red' }}
                    >
                        Delete
                    </Button>
                </div>
            </DialogPanel>
        </Dialog>
    );
};