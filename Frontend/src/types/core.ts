export type Activity = {
  name: string;
  precedents?: string[];
  cost: number;
  acceleration?: number;
  acceleration_cost?: number;
  optimist?: number;
  probable: number;
  pessimist?: number;
};

export type Route = {
  completion_time: number;
  critical: boolean;
  route: string[];
};

export type TableVariance = {
  average_time: number;
  name: string;
  precedents: [];
  variance: number;
  cost: number;
};

export type AcitvityTimes = {
  earliest_finish: number;
  earliest_start: number;
  latest_finish: number;
  latest_start: number;
  slack: number;
  name: string;
};

export type TimeProgression = {
  cumulative_count: number;
  time: number;
};

export type ActivityInform = {
  name: string;
  cost_spent: number;
  progress: number;
};

export type ActivityCost = {
  activity: string; // Nombre de la actividad
  planned_cost: number; // Costo planeado de la actividad
  actual_cost: number; // Costo real gastado en la actividad
  earned_value: number; // Valor ganado (EV)
  cost_variance: number; // Variación de costos para la actividad (EV - AC)
  CPI: number; // Índice de desempeño de costos (EV / AC)
};

export type CostAnalysis = {
  total_planned_cost: number; // Costo total planeado del proyecto
  total_actual_cost: number; // Costo real gastado hasta la fecha
  total_earned_value: number; // Valor ganado (EV)
  total_cost_variance: number; // Variación de costos (EV - Costo real)
  overall_CPI: number; // Índice de desempeño de costos (CPI = EV / AC)
  budgeted_cost_at_time: number;
  activities: ActivityCost[]; // Lista de costos por actividad
};
