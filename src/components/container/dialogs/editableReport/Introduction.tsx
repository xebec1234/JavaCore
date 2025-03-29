import React from "react";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { selectedJob } from "@/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useCreateReportIntroductionMutation } from "@/store/api";

const Introduction = ({
  onClose,
  data,
}: {
  onClose: () => void;
  data: selectedJob;
}) => {
  const [introduction, setIntroduction] = React.useState<string>(
    data?.reportIntroduction || ""
  );
  console.log("intro: ", data?.reportIntroduction);
  const [createReportIntroduction, { isLoading }] =
    useCreateReportIntroductionMutation();

  const handleSubmit = async () => {
    if (!data?.jobNumber) {
      toast({
        title: "Error",
        description: "No job selected.",
      });
      return;
    }

    try {
      const payload = {
        jobNumber: data.jobNumber, 
        introduction,
      };

      const response = await createReportIntroduction(payload).unwrap();

      if (response.success) {
        toast({
          title: "Success",
          description: "Report introduction added successfully.",
        });
        onClose(); 
      } else {
        throw new Error(response.message || "Failed to add introduction.");
      }
    } catch (error) {
      console.error("Error adding introduction:", error);
      toast({
        title: "Error",
        description: "Something went wrong.",
      });
    }
  };

  return (
    <DialogContent className="min-h-[300px] md:min-h-[350px] flex flex-col justify-between py-6">
      <DialogTitle>Edit Report Introduction</DialogTitle>

      <div className="flex flex-col flex-grow justify-center items-center text-center px-4">
        <Textarea
          placeholder="Enter your introduction..."
          className="resize-none text-sm h-32"
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
        >
          {data?.reportIntroduction}
        </Textarea>
      </div>

      <Button
        className="bg-main text-white hover:bg-follow"
        onClick={handleSubmit}
        disabled={isLoading} 
      >
        {isLoading ? "Saving..." : "Add"}
      </Button>

      <div className="flex gap-5 justify-center pb-4" onClick={onClose}></div>
    </DialogContent>
  );
};

export default Introduction;
