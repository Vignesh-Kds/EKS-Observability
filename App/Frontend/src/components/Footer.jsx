import {
  Box,
  Typography,
  Link
} from "@mui/material";


function Footer() {

  return (

    <Box

      component="footer"

      sx={{

        width:"100%",

        padding:"16px 24px",

        backgroundColor:"#ffffff",

        borderTop:
          "1px solid #e5e7eb",

        display:"flex",

        justifyContent:"space-between",

        alignItems:"center",

        flexWrap:"wrap",

        gap:2

      }}

    >


      {/* Copyright */}

      <Typography

        variant="body2"

        color="text.secondary"

      >

        © {new Date().getFullYear()} EKS Observability Dashboard

      </Typography>



      {/* Footer Links */}

      <Box

        sx={{

          display:"flex",

          gap:3

        }}

      >

        <Link

          href="#"

          underline="hover"

          color="text.secondary"

        >

          Documentation

        </Link>


        <Link

          href="#"

          underline="hover"

          color="text.secondary"

        >

          Support

        </Link>


        <Link

          href="#"

          underline="hover"

          color="text.secondary"

        >

          Version 1.0.0

        </Link>


      </Box>


    </Box>

  );

}


export default Footer;
