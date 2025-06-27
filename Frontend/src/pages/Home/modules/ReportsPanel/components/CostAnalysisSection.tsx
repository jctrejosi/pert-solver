import { Card, CardContent, Typography, Grid } from "@mui/material";

export type CostAnalysisProps = {
  total_planned_cost: number;
  total_actual_cost: number;
  total_earned_value: number;
  total_cost_variance: number;
  overall_CPI: number;
  budgeted_cost_at_time: number;
};

export function CostAnalysisSection({
  total_planned_cost = 0,
  total_actual_cost = 0,
  total_earned_value = 0,
  total_cost_variance = 0,
  overall_CPI = 0,
  budgeted_cost_at_time = 0,
}: Partial<CostAnalysisProps>) {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Costo real acumulado:</strong> $
              {total_actual_cost.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Costo presupuestado actual: </strong> $
              {budgeted_cost_at_time.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Valor de desempeño acumulado (VDA):</strong> $
              {total_earned_value.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Variación de costos:</strong> $
              {total_cost_variance.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Índice del costo:</strong> {overall_CPI.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Costo planeado total:</strong> $
              {total_planned_cost.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
