import { ChangeEvent, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { GetStateHome, ActionsHome } from "@pages/Home/slice";
import { ActivityInform } from "@customTypes/core";
import { ApiProjectProgress } from "../../services/projectProgress";

export function GenerateInformModal() {
  const dispatch = useAppDispatch();
  const { activities, showInform } = useAppSelector(GetStateHome);
  const [time, setTime] = useState(0);

  const [reportData, setReportData] = useState<ActivityInform[]>(
    activities.map((activity) => ({
      name: activity.name,
      cost_spent: 0,
      progress: 0,
    }))
  );

  const handleChange = (
    index: number,
    field: "cost_spent" | "progress",
    value: number
  ) => {
    const updatedData = [...reportData];
    updatedData[index][field] = value;
    setReportData(updatedData);
  };

  const handleSubmit = () => {
    dispatch(ActionsHome.SetShowInform(false));
    dispatch(ActionsHome.SetActualTime(time));
    dispatch(ActionsHome.SetActivityInform(reportData));
    ApiProjectProgress(
      {
        activities,
        progress: reportData,
        current_time: time,
      },
      dispatch
    );
  };

  const handleClose = () => {
    dispatch(ActionsHome.SetShowInform(false));
  };

  const handleChangeTime = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value > 0) {
      setTime(value);
    }
  };

  return (
    <Modal open={showInform} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Generar informe de actividades
        </Typography>

        <TextField
          type="number"
          size="small"
          label="Tiempo transcurrido"
          variant="filled"
          value={time}
          onChange={handleChangeTime}
          style={{ marginBottom: "1rem" }}
        />

        <TableContainer
          component={Paper}
          sx={{ maxHeight: 400, overflowY: "auto" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Actividad</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Gasto hasta el momento</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Porcentaje de avance (%)</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((row, index) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={row.cost_spent}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "cost_spent",
                          Number(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={row.progress}
                      onChange={(e) =>
                        handleChange(index, "progress", Number(e.target.value))
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
        >
          <Button variant="outlined" color="success" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Generar informe
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
