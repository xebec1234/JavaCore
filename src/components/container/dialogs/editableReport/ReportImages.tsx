import React from "react";

import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { selectedJob } from "@/schema";
import { Button } from "@/components/ui/button";
import { Plus, Trash, View } from "lucide-react";
import { FigureUpload } from "../../analysis/FigureUpload";
import { FigureView } from "../../analysis/FigureView";
import { toast } from "@/hooks/use-toast";

const ReportImages = ({
  onClose,
  data,
}: {
  onClose: () => void;
  data: selectedJob;
}) => {
  const [activeFigure, setActiveFigure] = React.useState("add");

  const handleSubmit = async () => {
    if (!data?.jobNumber) {
      toast({
        title: "Error",
        description: "No component selected.",
      });
      return;
    }

    const jobId = data.jobNumber;

    const payload = {
      jobId,
      activeFigure,
    };

    console.log(payload);
  };

  return (
    <DialogContent className="min-h-[300px] md:min-h-[350px] flex flex-col justify-between py-6">
      <DialogTitle>Add Report Image (Not Yet Functional)</DialogTitle>

      <div className="flex flex-col flex-grow justify-center items-center text-center px-4">
        <div className="flex flex-col gap-3 w-full">
          <div className="border rounded-lg p-3">
            <div className="flex gap-3">
              <button
                onClick={() => setActiveFigure("add")}
                type="button"
                className={`flex gap-1 items-center px-2 py-1 rounded-md ${
                  activeFigure === "add" && "bg-zinc-200"
                }`}
              >
                <Plus className="text-zinc-600" size={15} />
                <h1 className="text-sm text-zinc-600">Add</h1>
              </button>
              <button
                onClick={() => setActiveFigure("delete")}
                type="button"
                className={`flex gap-1 items-center px-2 py-1 rounded-md ${
                  activeFigure === "delete" && "bg-zinc-200"
                }`}
              >
                <Trash className="text-zinc-600" size={15} />
                <h1 className="text-sm text-zinc-600">Delete</h1>
              </button>
              <button
                onClick={() => setActiveFigure("view")}
                type="button"
                className={`flex gap-1 items-center px-2 py-1 rounded-md ${
                  activeFigure === "view" && "bg-zinc-200"
                }`}
              >
                <View className="text-zinc-600" size={15} />
                <h1 className="text-sm text-zinc-600">View</h1>
              </button>
            </div>
            <div className="w-full h-[1px] bg-zinc-200 mt-3" />
            {activeFigure === "add" && <FigureUpload />}
            {(activeFigure === "view" || activeFigure === "delete") && (
              <FigureView isDelete={activeFigure === "delete"} />
            )}
          </div>
        </div>
      </div>

      <Button
        className="bg-main text-white hover:bg-follow"
        onClick={handleSubmit}
      >
        Add
      </Button>

      <div className="flex gap-5 justify-center pb-4" onClick={onClose}></div>
    </DialogContent>
  );
};

export default ReportImages;
