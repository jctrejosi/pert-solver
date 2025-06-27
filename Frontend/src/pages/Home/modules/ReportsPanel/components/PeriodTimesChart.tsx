import { AcitvityTimes } from "@customTypes/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { useAppSelector } from "@store/hooks";
import { GetStateHome } from "@pages/Home/slice";
import { useEffect, useState } from "react";

export type ActivityTimelineProps = {
  activityTimes: AcitvityTimes[];
};

export function PeriodTimesChart({ activityTimes }: ActivityTimelineProps) {
  const { actual_time, time_progression } = useAppSelector(GetStateHome);
  const theme = useTheme();
  const [chartData, setChartData] = useState<
    { time: number; early: number; late: number; progression?: number }[]
  >([]);

  useEffect(() => {
    const timeMap: Record<
      number,
      { early: number; late: number; progression?: number }
    > = {};

    // Construir el histograma de concurrencia
    activityTimes.forEach(
      ({ earliest_start, earliest_finish, latest_start, latest_finish }) => {
        for (
          let t = Math.floor(earliest_start);
          t < Math.ceil(earliest_finish);
          t++
        ) {
          if (!timeMap[t]) timeMap[t] = { early: 0, late: 0 };
          timeMap[t].early += 1;
        }
        for (
          let t = Math.floor(latest_start);
          t < Math.ceil(latest_finish);
          t++
        ) {
          if (!timeMap[t]) timeMap[t] = { early: 0, late: 0 };
          timeMap[t].late += 1;
        }
      }
    );

    // Agregar la progresión temporal a los datos si existe
    if (time_progression.length > 0) {
      time_progression.forEach(({ time, cumulative_count }) => {
        if (!timeMap[time])
          timeMap[time] = { early: 0, late: 0, progression: 0 };
        timeMap[time].progression = cumulative_count;
      });
    }

    // Ordenamos los tiempos y generamos la sumatoria acumulativa
    const sortedTimes = Object.keys(timeMap)
      .map(Number)
      .sort((a, b) => a - b);
    let earlySum = 0;
    let lateSum = 0;

    const data = sortedTimes.map((time) => {
      earlySum += timeMap[time].early; // Suma acumulativa de actividades tempranas
      lateSum += timeMap[time].late; // Suma acumulativa de actividades tardías

      return {
        time,
        early: earlySum,
        late: lateSum,
        progression: timeMap[time].progression ?? 0,
      };
    });

    setChartData(data);
  }, [activityTimes, time_progression]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 70, left: 0, bottom: 5 }}
      >
        <XAxis type="number" dataKey="time" domain={[0, "dataMax"]} />
        <YAxis />
        <Tooltip />
        <Legend />
        {actual_time !== undefined && (
          <ReferenceLine
            x={actual_time}
            stroke="red"
            strokeDasharray="3 3"
            isFront={true}
            label={{
              value: `Tiempo: ${actual_time}`,
              position: "top",
              fill: "red",
              fontSize: 12,
            }}
          />
        )}
        {/* Línea de actividades tempranas */}
        <Line
          type="monotone"
          dataKey="early"
          stroke={theme.palette.primary.main}
          name="Tempranas"
          strokeWidth={3}
        />
        {/* Línea de actividades tardías */}
        <Line
          type="monotone"
          dataKey="late"
          stroke={theme.palette.secondary.main}
          name="Tardías"
          strokeWidth={3}
        />
        {/* Línea de progresión temporal en rojo, solo si hay datos */}
        {time_progression.length > 0 && (
          <Line
            type="monotone"
            dataKey="progression"
            stroke="red"
            name="Actual"
            strokeWidth={3}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
