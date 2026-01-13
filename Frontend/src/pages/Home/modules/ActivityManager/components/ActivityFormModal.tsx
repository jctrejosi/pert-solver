import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Divider,
  Modal,
  Box,
  SelectChangeEvent,
  MenuItem,
  ListItemText,
  OutlinedInput,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Activity } from "@customTypes/core";

export type ActivityFormProps = {
  predecessorActivities?: string[];
  activitySelected?: Activity;
  onAddActivity?: (activity: Activity) => void;
};

export const ActivityFormModal = ({
  predecessorActivities = [],
  activitySelected = {
    acceleration: undefined,
    acceleration_cost: undefined,
    name: "",
    optimist: undefined,
    probable: 0,
    pessimist: undefined,
    cost: 0,
    precedents: [],
  },
  onAddActivity = () => {},
}: ActivityFormProps) => {
  const [activity, setActivity] = useState<Activity>(activitySelected);

  const [errors, setErrors] = useState({
    name: false,
    cost: false,
    optimist: false,
    probable: false,
    pessimist: false,
    acceleration: false,
    acceleration_cost: false,
  });

  const [open, setOpen] = useState(false);
  const [valueSelect, setValueSelect] = useState<string[]>(
    activitySelected.precedents || []
  );

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<{ name?: string; value: number | string }>
  ) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | { name: string; value: number | string };
    let parsedValue: number | string | undefined;
    let parsedError: boolean = false;

    switch (name) {
      case "name":
        parsedValue = value;
        parsedError = value === "";
        break;
      case "cost":
        parsedValue = value === "" ? undefined : Number(value);
        parsedError = value === "";
        break;
      case "optimist":
        parsedValue = value === "" ? undefined : Number(value);
        parsedError = activity.pessimist !== undefined && value === "";
        break;
      case "probable":
        parsedValue = value === "" ? undefined : Number(value);
        parsedError = value === "";
        break;
      case "pessimist":
        parsedValue = value === "" ? undefined : Number(value);
        parsedError = activity.optimist !== undefined && value === "";
        break;
      case "acceleration":
        parsedValue = value === "" ? undefined : Number(value);
        parsedError = activity.acceleration_cost !== undefined && value === "";
        break;
      case "acceleration_cost":
        parsedValue = value === "" ? undefined : Number(value);
        parsedError = activity.acceleration !== undefined && value === "";
        break;
      default:
        parsedValue = value;
        parsedError = false;
    }

    setActivity({ ...activity, [name]: parsedValue });
    setErrors({ ...errors, [name]: parsedError });
  };

  const handleChangeDependencie = (
    event: SelectChangeEvent<typeof valueSelect>
  ) => {
    if (event.target.value.length === 0) return;
    const {
      target: { value },
    } = event;
    const newValue = typeof value === "string" ? value.split(",") : value;
    setValueSelect(newValue);

    setActivity({ ...activity, precedents: newValue });
  };

  const handleSubmit = () => {
    const newErrors = {
      name: activity.name === undefined || activity.name === "",
      cost: activity.cost === undefined || typeof activity.cost == "object",
      optimist:
        (activity.optimist == undefined ||
          typeof activity.optimist == "object") &&
        activity.pessimist != undefined &&
        typeof activity.pessimist != "object",
      probable:
        activity.probable === undefined || typeof activity.probable == "object",
      pessimist:
        (activity.pessimist == undefined ||
          typeof activity.pessimist == "object") &&
        activity.optimist != undefined &&
        typeof activity.optimist != "object",
      acceleration:
        (activity.acceleration == undefined ||
          typeof activity.acceleration == "object") &&
        activity.acceleration_cost != undefined &&
        typeof activity.acceleration_cost != "object",
      acceleration_cost:
        (activity.acceleration_cost == undefined ||
          typeof activity.acceleration_cost == "object") &&
        activity.acceleration != undefined &&
        typeof activity.acceleration != "object",
    };

    setErrors(newErrors);

    if (
      newErrors.name ||
      newErrors.cost ||
      newErrors.optimist ||
      newErrors.probable ||
      newErrors.pessimist ||
      newErrors.acceleration ||
      newErrors.acceleration_cost
    ) {
      return;
    }

    onAddActivity(activity);
    setOpen(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (activitySelected.name && activitySelected.name !== "") setOpen(true);
    setActivity(activitySelected);
  }, [activitySelected]);

  return (
    <div style={{ width: "100%" }}>
      <Button
        variant="outlined"
        color="info"
        onClick={handleOpen}
        endIcon={<AddCircleOutlineIcon />}
        fullWidth
        style={{ marginBottom: "1rem" }}
      >
        Agregar Actividad
      </Button>
      {open && (
        <Modal open={true} onClose={handleClose} style={{ height: "100%" }}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 3,
              maxHeight: "90vh",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "2px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={3}
            >
              <Typography variant="h5" gutterBottom>
                Edite los datos de la actividad
              </Typography>
              <Button
                onClick={handleClose}
                type="button"
                style={{ minWidth: "auto" }}
              >
                X
              </Button>
            </Box>
            <Divider />
            <form>
              <Grid container spacing={1}>
                <TextField
                  label="Nombre de la actividad"
                  name="name"
                  size="small"
                  value={activity.name || ""}
                  onChange={handleChange}
                  fullWidth
                  error={errors.name}
                  helperText={
                    errors.name ? "Este campo es obligatorio e irrepetible" : ""
                  }
                />
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Dependencias
                  </InputLabel>
                  <Select<string[]>
                    multiple
                    value={valueSelect || []}
                    onChange={handleChangeDependencie}
                    input={<OutlinedInput label="Dependencias" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {predecessorActivities.map((name) => (
                      <MenuItem key={name} value={name}>
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <p style={{ width: "100%", margin: 0, fontSize: "1rem" }}>
                  Tiempos
                </p>
                <Grid container>
                  <Grid size="grow">
                    <TextField
                      variant="filled"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      size="small"
                      label="Optimista"
                      name="optimist"
                      type="number"
                      value={activity.optimist || ""}
                      onChange={handleChange}
                      error={errors.optimist}
                      helperText={
                        errors.optimist ? "Este campo es obligatorio" : ""
                      }
                    />
                  </Grid>
                  <Grid size="grow">
                    <TextField
                      variant="filled"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      size="small"
                      label="Probable"
                      type="number"
                      name="probable"
                      value={activity.probable || ""}
                      onChange={handleChange}
                      error={errors.probable}
                      helperText={
                        errors.probable ? "Este campo es obligatorio" : ""
                      }
                    />
                  </Grid>
                  <Grid size="grow">
                    <TextField
                      variant="filled"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      size="small"
                      label="Pesimista"
                      type="number"
                      name="pessimist"
                      value={activity.pessimist || ""}
                      onChange={handleChange}
                      error={errors.pessimist}
                      helperText={
                        errors.pessimist ? "Este campo es obligatorio" : ""
                      }
                    />
                  </Grid>
                </Grid>
                <Grid width="100%">
                  <TextField
                    label="Costo de la actividad"
                    type="number"
                    name="cost"
                    size="small"
                    value={activity.cost || ""}
                    onChange={handleChange}
                    fullWidth
                    error={errors.cost}
                    helperText={errors.cost ? "Este campo es obligatorio" : ""}
                  />
                </Grid>
                <Grid width="100%">
                  <TextField
                    label="Unidades de aceleración aplicable"
                    type="number"
                    name="acceleration"
                    size="small"
                    value={activity.acceleration || ""}
                    onChange={handleChange}
                    fullWidth
                    error={errors.acceleration}
                    helperText={
                      errors.acceleration ? "Este campo es obligatorio" : ""
                    }
                  />
                </Grid>
                <Grid width="100%">
                  <TextField
                    label="Costo de aceleración por unidad de tiempo"
                    type="number"
                    name="acceleration_cost"
                    size="small"
                    value={activity.acceleration_cost || ""}
                    onChange={handleChange}
                    fullWidth
                    error={errors.acceleration_cost}
                    helperText={
                      errors.acceleration_cost
                        ? "Este campo es obligatorio"
                        : ""
                    }
                  />
                </Grid>
                <Grid width="100%">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                  >
                    Agregar Actividad
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Modal>
      )}
    </div>
  );
};
