import React from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { useCreateOilAnalysisMutation } from "@/store/api";
import { toast } from "@/hooks/use-toast";
import { symbols, routeComponentOilAnalysisSchema } from "@/schema";
import { z } from "zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
//  

interface OilAnalysisProps {
  defaultOilAnalysis: string;
  routeComponentId: string | undefined;
  onClose: () => void;
}

const OilAnalysis: React.FC<OilAnalysisProps> = ({
  defaultOilAnalysis,
  routeComponentId,
  onClose,
}) => {
  const [createOilAnalysis, { isLoading }] = useCreateOilAnalysisMutation();
  const [analysis, setAnalysis] = React.useState(defaultOilAnalysis);

  const handleSubmit = async () => {
    if (!routeComponentId) {
      toast({ title: "Error", description: "No component selected." });
      return;
    }

    if (analysis === "") {
      toast({ title: "Error", description: "No oil state selected." });
      return;
    }

    const payload = { routeComponentId, analysis };
    console.log("Data being passed:", payload);

    try {
      routeComponentOilAnalysisSchema.parse(payload);
      await createOilAnalysis(payload).unwrap();
      toast({
        title: "Success",
        description: "Oil analysis added successfully.",
      });
      setAnalysis("Normal");
      onClose();
    } catch (error) {
      const description =
        error instanceof z.ZodError
          ? error.errors.map((e) => e.message).join(", ")
          : "An unexpected error occurred.";
      toast({ title: "Error", description });
    }
  };

  return (
    <DialogContent>
      <DialogTitle>Add Oil Analysis</DialogTitle>
      <Select onValueChange={setAnalysis} defaultValue={defaultOilAnalysis}>
        <SelectTrigger>
          <SelectValue>{analysis || defaultOilAnalysis}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {symbols.map(({ image, label }) => (
            <SelectItem key={image} value={label}>
              <div className="flex gap-3 items-center">
                <Image
                  src={`/severity/${image}.png`}
                  width={20}
                  height={20}
                  alt={label}
                  className="w-5 object-cover"
                />
                {label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-3 w-full justify-end mt-4">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          className="bg-main text-white hover:bg-follow"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add"}
        </Button>
      </div>
    </DialogContent>
  );
};

export default OilAnalysis;
