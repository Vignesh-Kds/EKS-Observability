import {
  Box,
  CircularProgress,
  Typography
} from "@mui/material";


function Loading({
  message = "Loading data..."
}) {

  return (

    <Box

      sx={{

        display:"flex",

        flexDirection:"column",

        justifyContent:"center",

        alignItems:"center",

        minHeight:"250px",

        gap:2

      }}

    >

      <CircularProgress

        size={45}

        thickness={4}

      />


      <Typography

        variant="body2"

        color="text.secondary"

      >

        {message}

      </Typography>


    </Box>

  );

}


export default Loading;
