import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  useGetRouteEquipmentClientReportQuery,
  useGetRouteComponentClientReportQuery,
} from "@/store/api";
import React, { useMemo } from "react";

import PdfDownload from "../../report/PDF";
import { selectedJob } from "@/schema";
import GraphData from "../../report/functions/Graphdata";
import RecommendationTableData from "../../report/functions/RecommendationTableData";
import AnalysisTableData from "../../report/functions/AnalysisTableData";

const ExportClient = ({
  onClose,
  data,
}: {
  onClose: () => void;
  data: selectedJob;
}) => {
  const routeMachineId = data?.routeList?.machines?.[0]?.id;

  const { data: routeEquipment, isLoading } =
    useGetRouteEquipmentClientReportQuery(routeMachineId ?? "", {
      skip: !routeMachineId,
    });


  const routeEquipmentId =
    routeEquipment?.routeEquipment.map((eqId) => eqId.id) || [];
  const { data: routeComponent, isFetching: isComponentLoading } =
    useGetRouteComponentClientReportQuery(routeEquipmentId ?? [], {
      skip: !routeEquipmentId,
    });

  const { graphData, yAxisValues } = useMemo(() => {
    return GraphData(routeComponent);
  }, [routeComponent]);

  const transformedRecommendationData = useMemo(() => {
    return RecommendationTableData(
      routeEquipment?.routeEquipment ?? [],
      routeComponent?.routeComponent ?? []
    );
  }, [routeEquipment, routeComponent]);

  const transformedAnalysisData = useMemo(() => {
    return AnalysisTableData(
      routeEquipment?.routeEquipment ?? [],
      routeComponent?.routeComponent ?? []
    );
  }, [routeEquipment, routeComponent]);

  return (
    <DialogContent>
      <DialogTitle>Export Report</DialogTitle>
      <div className="flex flex-col gap-3 justify-center my-10">
        <h1 className="text-center text-sm">
          Please select your preferred file format to download the report.
        </h1>
        <div className="flex gap-5 justify-center" onClick={onClose}>
          <PdfDownload
            data={data}
            graphData={graphData}
            yAxisValues={yAxisValues}
            transformedRecommendationData={transformedRecommendationData}
            transformedAnalysisData={transformedAnalysisData}
            loading={isLoading || isComponentLoading}
          />
        </div>
      </div>
    </DialogContent>
  );
};

export default ExportClient;
