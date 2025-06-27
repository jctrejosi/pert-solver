import {
  ActivityInform,
  CostAnalysis,
  Activity as Task,
  TimeProgression,
} from "@customTypes/core";
import axios from "axios";
import { Dispatch } from "redux";
import { ActionsHome } from "../slice";

// ..............................................................

type paramsRequest = {
  current_time: number;
  activities: Task[];
  progress: ActivityInform[];
};

export type RequestCalculatePert = {
  cost_analysis: CostAnalysis; // Análisis de costos del proyecto
  time_progression: TimeProgression[];
};

export const ApiProjectProgress = (
  params: paramsRequest,
  dispatch: Dispatch
) => {
  axios
    .post<RequestCalculatePert>("/api/v1.0/projectProgress", params)
    .then((response) => {
      dispatch(ActionsHome.SetCostAnalysis(response.data.cost_analysis));
      dispatch(
        ActionsHome.SetTimeProgression(response.data.time_progression || [])
      );
    })
    .catch((error) => {
      console.error(error);
    });
};
