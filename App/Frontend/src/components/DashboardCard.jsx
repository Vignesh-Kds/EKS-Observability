import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";


function DashboardCard({
  title,
  value,
  icon,
  status,
  color = "primary"
}) {

  return (

    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.08)",
        transition:
          "transform 0.2s ease",

        "&:hover": {
          transform: "translateY(-5px)"
        }
      }}
    >

      <CardContent>


        <Box
          sx={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center"
          }}
        >


          {/* Title */}

          <Box>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>


            <Typography
              variant="h4"
              sx={{
                mt:1,
                fontWeight:700
              }}
            >
              {value}
            </Typography>


          </Box>



          {/* Icon */}

          <Box
            sx={{
              width:50,
              height:50,
              borderRadius:"50%",
              display:"flex",
              justifyContent:"center",
              alignItems:"center",

              backgroundColor:
                `${color}.light`
            }}
          >

            {icon}

          </Box>


        </Box>



        {/* Status */}

        {
          status && (

            <Typography
              variant="body2"
              sx={{
                mt:2,
                color:
                  status === "Healthy"
                  ? "success.main"
                  : status === "Warning"
                  ? "warning.main"
                  : "error.main",

                fontWeight:600
              }}
            >

              {status}

            </Typography>

          )
        }


      </CardContent>


    </Card>

  );

}


export default DashboardCard;
