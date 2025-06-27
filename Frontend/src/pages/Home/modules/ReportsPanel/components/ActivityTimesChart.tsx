import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LabelList,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { AcitvityTimes } from "@customTypes/core";
import { useTheme } from "@mui/material/styles";
import { useAppSelector } from "@store/hooks";
import { GetStateHome } from "@pages/Home/slice";

type props = {
  activityTimes: AcitvityTimes[];
};
export function ActivityTimesChart({ activityTimes }: props) {
  const { actual_time } = useAppSelector(GetStateHome);
  const theme = useTheme();

  const data = activityTimes.map((activity) => {
    return {
      name: activity.name,
      duration: activity.earliest_finish - activity.earliest_start,
      earliest_finish: activity.earliest_finish,
      latest_finish: activity.latest_finish,
      earliest_start: activity.earliest_start,
      latest_start: activity.latest_start,
      slack: activity.slack,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={800}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 70, left: 0, bottom: 5 }}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <CartesianGrid stroke={theme.palette.divider} strokeDasharray="5 5" />
        <XAxis
          type="number"
          domain={[0, "dataMax"]}
          tickCount={data[data.length - 1]?.earliest_finish || 10}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />

        <Tooltip
          content={({ active, payload }) => {
            if (
              active &&
              payload &&
              payload.length &&
              payload[0].payload.slack > 0
            ) {
              const slackValue = payload[0].payload.slack;
              return (
                <div
                  style={{
                    background: "white",
                    padding: "5px",
                    border: "1px solid #ccc",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    <strong>Holgura:</strong> {slackValue}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
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

        {/* Barra invisible para alinear la actividad temprana */}
        <Bar dataKey="earliest_start" stackId="a" fill="transparent" />
        {/* Barra de actividades tempranas (azul) */}
        <Bar
          dataKey="duration"
          stackId="a"
          fill={theme.palette.primary.main}
          name="Temprano"
          stroke={theme.palette.primary.main}
          strokeWidth={3}
        >
          <LabelList
            dataKey="earliest_start"
            position="left"
            fill="black"
            fontSize={10}
            formatter={(value: number) =>
              value === 0 ? "" : Number(value).toFixed(2)
            }
          />
          <LabelList
            dataKey="earliest_finish"
            position="right"
            fill="black"
            fontSize={10}
            formatter={(value: number) => Number(value).toFixed(2)}
          />
          {/* Etiqueta estática para la holgura */}
          <LabelList
            dataKey="duration"
            position="center"
            fill="white"
            fontSize={10}
            formatter={(duration: number) => duration.toFixed(2)}
          />
          {/* Tooltip personalizado que solo muestra la duración */}
        </Bar>

        {/* Barra invisible para alinear la actividad tardía */}
        <Bar dataKey="latest_start" stackId="b" fill="transparent" />
        {/* Barra de actividades tardías (verde) */}
        <Bar
          dataKey="duration"
          stackId="b"
          fill={theme.palette.secondary.main}
          name="Tardío"
          stroke={theme.palette.secondary.main}
          strokeWidth={3}
        >
          <LabelList
            dataKey="latest_start"
            position="left"
            fill="black"
            fontSize={10}
            formatter={(value: number) =>
              value === 0 ? "" : Number(value).toFixed(2)
            }
          />
          <LabelList
            dataKey="latest_finish"
            position="right"
            fill="black"
            fontSize={10}
            formatter={(value: number) => Number(value).toFixed(2)}
          />
          {/* Etiqueta estática para la duración */}
          <LabelList
            dataKey="duration"
            position="center"
            fill="white"
            fontSize={10}
            formatter={(duration: number) => duration.toFixed(2)}
          />
          {/* Tooltip personalizado que solo muestra la duración */}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
