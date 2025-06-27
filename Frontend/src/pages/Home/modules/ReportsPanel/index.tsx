import { Typography, Box, Card, CardContent } from "@mui/material";
import { RoutesGraph } from "./components/RoutesGraph";
import { ReactFlowProvider } from "@xyflow/react";
import { useAppSelector } from "@store/hooks";
import { GetStateHome } from "../../slice";
import { ActivitiesTable } from "./components/ActivitiesTable";
import { useState } from "react";
import Expand from "@mui/icons-material/Expand";
import RoutesList from "./components/RoutesList";
import { ActivityTimesChart } from "./components/ActivityTimesChart";
import { OptimizedActivitiesTable } from "./components/OptimizedActivitiesTable";
import { ActivityTimelineChart } from "./components/ActivityTimelineChart";
import { PeriodTimesChart } from "./components/PeriodTimesChart";
import { CostAnalysisSection } from "./components/CostAnalysisSection";
import { CostAnalysisTable } from "./components/CostAnalysisTable";

export function ReportsPanel() {
  const STATE = useAppSelector(GetStateHome);
  const [graphHeight, setGraphHeight] = useState(320);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = graphHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = Math.max(50, startHeight + (e.clientY - startY));
      setGraphHeight(newHeight);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
        gap: 2,
        scrollbarWidth: "thin",
        padding: "0 1rem",
      }}
    >
      <Typography variant="h6">Grafo de rutas</Typography>

      <Box sx={{ height: graphHeight, flexShrink: 0, position: "relative" }}>
        <ReactFlowProvider>
          <RoutesGraph
            activities={STATE.activities}
            highlightedRoute={STATE.critical_path}
          />
        </ReactFlowProvider>
      </Box>

      <Box
        sx={(theme) => ({
          minHeight: "20px",
          width: "100%",
          backgroundColor: theme.palette.grey[300],
          cursor: "ns-resize",
          "&:hover": { backgroundColor: theme.palette.grey[500] },
          top: "-1rem",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottomLeftRadius: "4px",
          borderBottomRightRadius: "4px",
        })}
        onMouseDown={handleMouseDown}
      >
        <Expand
          sx={(theme) => ({
            fontSize: "1rem",
            color: theme.palette.grey[800],
          })}
        />
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        {STATE.probability && (
          <Typography variant="subtitle1">
            La probabilidad de completar el proyecto en {STATE.expected_time}{" "}
            unidades de tiempo es de {STATE.probability}%
          </Typography>
        )}
        {STATE.routes.length > 0 && (
          <Box>
            <Typography variant="h6">Lista de rutas</Typography>
            <RoutesList />
          </Box>
        )}
        {STATE.optimized_activities?.length > 0 && (
          <Box>
            <Typography variant="h6">Optimización de actividades</Typography>
            <OptimizedActivitiesTable />
          </Box>
        )}
        {STATE.table.length > 0 && (
          <Box>
            <Typography variant="h6">Tabla de actividades</Typography>
            <ActivitiesTable />
          </Box>
        )}
        {STATE.activity_times.length > 0 && (
          <Box>
            <Typography variant="h6">Tiempos tempranos y tardíos</Typography>
            <ActivityTimesChart activityTimes={STATE.activity_times} />
          </Box>
        )}
        {STATE.activity_times.length > 0 && (
          <Box>
            <Typography variant="h6">Gasto de tiempo por período</Typography>
            <ActivityTimelineChart activityTimes={STATE.activity_times} />
          </Box>
        )}
        {STATE.activity_times.length > 0 && (
          <Box>
            <Typography variant="h6">
              Rendimiento acumulado de tiempos
            </Typography>
            <PeriodTimesChart activityTimes={STATE.activity_times} />
          </Box>
        )}
        {STATE.table.length > 0 && (
          <Box>
            <Card sx={{ margin: "auto", mt: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Análisis de optimización
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-line", fontSize: 16, lineHeight: 1.5 }}
                >
                  {STATE.ai_analysis_pert}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
        {STATE.cost_analysis.activities?.length > 0 && (
          <Box>
            <CostAnalysisTable activities={STATE.cost_analysis.activities} />
          </Box>
        )}
        {STATE.cost_analysis?.budgeted_cost_at_time && (
          <Box>
            <Typography variant="h6">Análisis de costos</Typography>
            <CostAnalysisSection {...STATE.cost_analysis} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
