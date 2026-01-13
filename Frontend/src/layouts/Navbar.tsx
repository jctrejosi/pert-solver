import { AppBar, Typography } from "@mui/material";

export const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        padding: "1.5rem ",
        height: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e1e1e",
        color: "#fff",
      }}
    >
      <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
        PERT-Solver
      </Typography>
    </AppBar>
  );
};
