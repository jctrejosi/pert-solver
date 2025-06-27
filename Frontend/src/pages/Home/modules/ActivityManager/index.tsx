import { Activity } from "@customTypes/core";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { ActionsHome, GetStateHome } from "../../slice";
import { ActivityFormModal } from "./components/ActivityFormModal";
import { ActivityList } from "./components/ActivityList";
import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ApiCalculatePert } from "../../services/calculatePert";

export function ActivityManager() {
  const disptach = useAppDispatch();
  const STATE = useAppSelector(GetStateHome);

  const [activitySelected, setActivitySelected] = useState<Activity>({
    acceleration: undefined,
    acceleration_cost: undefined,
    name: "",
    optimist: undefined,
    probable: 0,
    pessimist: undefined,
    cost: 0,
    precedents: [],
  });

  const handleAddActivity = (newActivity: Activity) => {
    disptach(ActionsHome.SetActivities([...STATE.activities, newActivity]));
  };

  const handleDeleteActivity = (nameActivity: string) => {
    disptach(
      ActionsHome.SetActivities(
        STATE.activities.filter((activity) => activity.name !== nameActivity)
      )
    );
  };

  const handleSendCalculatePert = () => {
    ApiCalculatePert(
      {
        activities: STATE.activities,
        expected_time: STATE.expected_time,
      },
      disptach
    );
  };

  const handleGenerateInform = () => {
    disptach(ActionsHome.SetShowInform(true));
  };

  const handleChangeExpectedTime = (e: React.ChangeEvent<HTMLInputElement>) =>
    disptach(ActionsHome.SetExpectedTime(Number(e.target.value)));

  return (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={handleSendCalculatePert}
        endIcon={<SendIcon />}
        fullWidth
        style={{ marginBottom: "1rem" }}
      >
        CALCULAR PERT
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={handleGenerateInform}
        endIcon={<SendIcon />}
        fullWidth
        style={{ marginBottom: "1rem" }}
      >
        GENERAR INFORME
      </Button>
      <TextField
        label="Tiempo esperado"
        variant="filled"
        type="number"
        size="small"
        fullWidth
        value={STATE.expected_time}
        style={{ marginBottom: "1rem" }}
        onChange={handleChangeExpectedTime}
      />
      <ActivityFormModal
        predecessorActivities={
          STATE.activities.map((activity) => activity.name) || []
        }
        activitySelected={activitySelected}
        onAddActivity={handleAddActivity}
      />
      <Typography variant="body1">Lista de actividades</Typography>
      <ActivityList
        activities={STATE.activities}
        onEditActivity={(activity) => {
          setActivitySelected(activity);
        }}
        onDeleteActivity={handleDeleteActivity}
      />
    </>
  );
}
