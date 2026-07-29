import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const drawerWidth = 240;

function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      <Box
        sx={{
          width: drawerWidth,
          flexShrink: 0
        }}
      >
        <Sidebar />
      </Box>


      <Box
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`
        }}
      >

        <Navbar />

        <Box sx={{ p: 3 }}>
          {children}
        </Box>

      </Box>

    </Box>
  );
}

export default MainLayout;
