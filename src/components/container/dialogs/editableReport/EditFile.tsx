import React from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { selectedJob } from "@/schema";
import { Button } from "@/components/ui/button";
import Introduction from "./Introduction";
import ReportImages from "./ReportImages";

const EditFile = ({
  onClose,
  data,
}: {
  onClose: () => void;
  data: selectedJob;
}) => {
  const [openEditIntroduction, setOpenEditIntroduction] = React.useState(false);
  const [openAddImages, setOpenAddImages] = React.useState(false);

  return (
    <DialogContent className="min-h-[300px] md:min-h-[350px] flex flex-col justify-between py-6 w-full">
      <DialogTitle className="text-center">
        Edit Report Introduction or Add images
      </DialogTitle>
      <div className="w-full flex flex-col items-center gap-4 px-4">
        <span className="text-sm text-gray-600">
          Report Number: {data?.reportNumber}
        </span>

        <div className="flex flex-col w-full max-w-md gap-3">
          <Button
            onClick={() => setOpenEditIntroduction(!openEditIntroduction)}
            type="button"
            className="bg-main hover:bg-follow text-white w-full"
          >
            Edit Introduction
          </Button>
          <Dialog
            aria-describedby={undefined}
            open={openEditIntroduction}
            onOpenChange={setOpenEditIntroduction}
          >
            <Introduction
              onClose={() => setOpenEditIntroduction(false)}
              data={data}
            />
          </Dialog>

          <Button
            onClick={() => setOpenAddImages(!openAddImages)}
            type="button"
            className="bg-main hover:bg-follow text-white w-full"
          >
            Add Images in Report
          </Button>
          <Dialog
            aria-describedby={undefined}
            open={openAddImages}
            onOpenChange={setOpenAddImages}
          >
            <ReportImages onClose={() => setOpenAddImages(false)} data={data} />
          </Dialog>
        </div>
      </div>

      <div className="flex justify-center pb-4">
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>
    </DialogContent>
  );
};

export default EditFile;
