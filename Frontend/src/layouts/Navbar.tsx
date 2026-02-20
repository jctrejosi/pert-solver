import { AppBar, Typography, Box, Link } from "@mui/material";
import github from "../assets/github.svg";

export const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        px: 3,
        height: "4rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1e1e1e",
        color: "#fff",
      }}
    >
      <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
        PERT-Solver
      </Typography>

      <Link
        href="https://github.com/jctrejosi/pert-solver"
        target="_blank"
        rel="noopener"
        underline="always"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#fff",
          fontSize: "0.8rem",
          textDecorationColor: "#fff",
          "&:hover": {
            color: "#fff",
            textDecorationColor: "#fff",
            opacity: 0.9,
          },
        }}
      >
        <Box
          component="img"
          src={github}
          alt="GitHub"
          sx={{ width: 20, height: 20 }}
        />
        Ver repositorio
      </Link>
    </AppBar>
  );
};
