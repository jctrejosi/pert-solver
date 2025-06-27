import { AcitvityTimes } from "@customTypes/core";
import {
  BarChart,
  Bar,
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

export type ActivityTimelineProps = {
  activityTimes: AcitvityTimes[];
};

export function ActivityTimelineChart({
  activityTimes,
}: ActivityTimelineProps) {
  const { actual_time } = useAppSelector(GetStateHome);
  const theme = useTheme();

  const timeMap: Record<number, { early: number; late: number }> = {};

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

  const data = Object.entries(timeMap).map(([time, counts]) => ({
    time: Number(time),
    early: counts.early,
    late: counts.late,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 70, left: 0, bottom: 5 }}>
        <XAxis
          type="number"
          dataKey="time"
          domain={[1, "dataMax"]}
          tickCount={data.length}
          allowDecimals={false}
          interval={0}
        />
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
        {/* Barras de actividades tempranas */}
        <Bar
          dataKey="early"
          fill={theme.palette.primary.main}
          name="Tempranas"
        />
        {/* Barras de actividades tardías */}
        <Bar
          dataKey="late"
          fill={theme.palette.secondary.main}
          name="Tardías"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
