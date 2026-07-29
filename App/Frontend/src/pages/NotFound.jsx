import {
  Box,
  Typography,
  Button
} from "@mui/material";

import {
  Home,
  ErrorOutline
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";



function NotFound() {


  const navigate = useNavigate();



  return (

    <Box

      sx={{

        minHeight:"70vh",

        display:"flex",

        flexDirection:"column",

        justifyContent:"center",

        alignItems:"center",

        textAlign:"center",

        gap:2

      }}

    >


      <ErrorOutline

        sx={{

          fontSize:80,

          color:"error.main"

        }}

      />



      <Typography

        variant="h2"

        sx={{

          fontWeight:700

        }}

      >

        404

      </Typography>



      <Typography

        variant="h5"

        sx={{

          fontWeight:600

        }}

      >

        Page Not Found

      </Typography>



      <Typography

        color="text.secondary"

      >

        The page you are looking for does not exist
        in the EKS Observability Dashboard.

      </Typography>




      <Button

        variant="contained"

        startIcon={<Home />}

        onClick={() => navigate("/")}

        sx={{

          mt:2

        }}

      >

        Back to Dashboard

      </Button>


    </Box>

  );

}


export default NotFound;
