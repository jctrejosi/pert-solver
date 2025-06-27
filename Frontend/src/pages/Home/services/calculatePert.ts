import {
  AcitvityTimes,
  Route,
  TableVariance,
  Activity as Task,
} from "@customTypes/core";
import axios from "axios";
import { ActionsHome } from "../slice";
import { Dispatch } from "redux";

// ..............................................................

export type ParamsSetCalculatePert = {
  activities: Task[];
  expected_time: number;
};

export type ProbablyT = {
  Z_score: number;
  completion_probability: number;
};

export type OptimizedActivitiesT = {
  acceleration_cost_per_unit: number;
  activity: string;
  time_reduced: number;
  total_acceleration_cost: number;
};

export type RequestCalculatePert = {
  routes: Route[];
  table: TableVariance[];
  activity_times: AcitvityTimes[];
  ai_analysis: string;
  probability: ProbablyT;
  optimized_activities: {
    activities: OptimizedActivitiesT[];
    total_acceleration_cost: number;
  };
  critical_path: string[];
  total_project_cost: number;
};

export const ApiCalculatePert = (
  params: ParamsSetCalculatePert,
  dispatch: Dispatch
) => {
  axios
    .post<RequestCalculatePert>("/api/v1.0/calculatePert", params)
    .then((response) => {
      dispatch(ActionsHome.SetTable(response.data.table));
      dispatch(ActionsHome.SetRoutes(response.data.routes));
      dispatch(ActionsHome.SetCriticalPath(response.data.critical_path));
      dispatch(ActionsHome.SetTotalCost(response.data.total_project_cost));
      dispatch(ActionsHome.SetAiAnalysisPert(response.data.ai_analysis));
      dispatch(ActionsHome.SetActivityTimes(response.data.activity_times));
      dispatch(
        ActionsHome.SetProbability(
          response.data.probability.completion_probability
        )
      );
      dispatch(
        ActionsHome.SetOptimizedActivities(
          response.data.optimized_activities.activities
        )
      );
      dispatch(
        ActionsHome.SetTotalAccelerationCost(
          response.data.optimized_activities.total_acceleration_cost
        )
      );
    })
    .catch((error) => {
      console.error(error);
    });
};
