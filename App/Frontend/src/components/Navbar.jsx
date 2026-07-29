import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Tooltip
} from "@mui/material";

import {
  Notifications,
  CloudDone
} from "@mui/icons-material";


function Navbar() {

  return (

    <AppBar

      position="static"

      elevation={0}

      sx={{

        backgroundColor:"#ffffff",

        color:"#111827",

        borderBottom:
          "1px solid #e5e7eb"

      }}

    >

      <Toolbar

        sx={{

          display:"flex",

          justifyContent:"space-between"

        }}

      >


        {/* Application Title */}

        <Box

          sx={{

            display:"flex",

            alignItems:"center",

            gap:2

          }}

        >

          <CloudDone

            color="primary"

            fontSize="large"

          />


          <Box>

            <Typography

              variant="h6"

              sx={{

                fontWeight:700

              }}

            >

              EKS Observability

            </Typography>


            <Typography

              variant="caption"

              color="text.secondary"

            >

              Kubernetes Monitoring Platform

            </Typography>


          </Box>


        </Box>





        {/* Right Side */}

        <Box

          sx={{

            display:"flex",

            alignItems:"center",

            gap:2

          }}

        >


          {/* Cluster Status */}

          <Box

            sx={{

              display:"flex",

              alignItems:"center",

              gap:1,

              padding:"6px 12px",

              borderRadius:2,

              backgroundColor:"#dcfce7"

            }}

          >

            <Box

              sx={{

                width:10,

                height:10,

                borderRadius:"50%",

                backgroundColor:"#16a34a"

              }}

            />


            <Typography

              variant="body2"

              sx={{

                color:"#166534",

                fontWeight:600

              }}

            >

              Cluster Healthy

            </Typography>


          </Box>





          {/* Notifications */}

          <Tooltip title="Alerts">

            <IconButton>

              <Badge

                badgeContent={3}

                color="error"

              >

                <Notifications />

              </Badge>

            </IconButton>

          </Tooltip>





          {/* User Avatar */}

          <Tooltip title="Admin">

            <Avatar

              sx={{

                width:40,

                height:40

              }}

            >

              A

            </Avatar>

          </Tooltip>


        </Box>


      </Toolbar>


    </AppBar>

  );

}


export default Navbar;
