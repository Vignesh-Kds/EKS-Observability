import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from "@mui/material";

import {
  Dashboard,
  MonitorHeart,
  Storage,
  Cloud,
  Settings,
  Info
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";


const menuItems = [

  {
    text: "Dashboard",
    path: "/",
    icon: <Dashboard />
  },

  {
    text: "MonitorHeart",
    path: "/monitorHeart",
    icon: <MonitorHeart />
  },

  {
    text: "Database",
    path: "/database",
    icon: <Storage />
  },

  {
    text: "Services",
    path: "/services",
    icon: <Cloud />
  },

  {
    text: "Settings",
    path: "/settings",
    icon: <Settings />
  },

  {
    text: "About",
    path: "/about",
    icon: <Info />
  }

];



function Sidebar() {


  return (

    <Box

      sx={{

        width:240,

        minHeight:"100vh",

        backgroundColor:"#111827",

        color:"#ffffff",

        paddingTop:2

      }}

    >


      {/* Logo */}

      <Box

        sx={{

          padding:"16px 20px"

        }}

      >

        <Typography

          variant="h6"

          sx={{

            fontWeight:700

          }}

        >

          🚀 EKS Monitor

        </Typography>


        <Typography

          variant="caption"

          sx={{

            color:"#9ca3af"

          }}

        >

          Kubernetes Observability

        </Typography>


      </Box>



      <Divider

        sx={{

          backgroundColor:"#374151"

        }}

      />





      {/* Navigation */}

      <List>


        {

          menuItems.map((item)=>(


            <ListItemButton

              key={item.text}

              component={NavLink}

              to={item.path}


              sx={{

                margin:"6px 12px",

                borderRadius:2,

                color:"#d1d5db",


                "&.active":{

                  backgroundColor:"#2563eb",

                  color:"#ffffff"

                },


                "&:hover":{

                  backgroundColor:"#1f2937"

                }


              }}

            >


              <ListItemIcon

                sx={{

                  color:"inherit",

                  minWidth:40

                }}

              >

                {item.icon}

              </ListItemIcon>


              <ListItemText

                primary={item.text}

              />


            </ListItemButton>


          ))

        }


      </List>



      {/* Footer Status */}

      <Box

        sx={{

          position:"absolute",

          bottom:20,

          width:240,

          padding:"0 20px"

        }}

      >

        <Typography

          variant="caption"

          sx={{

            color:"#9ca3af"

          }}

        >

          Cluster: vickycluster

        </Typography>


        <Box

          sx={{

            display:"flex",

            alignItems:"center",

            gap:1,

            marginTop:1

          }}

        >

          <Box

            sx={{

              width:8,

              height:8,

              borderRadius:"50%",

              backgroundColor:"#16a34a"

            }}

          />


          <Typography

            variant="caption"

            sx={{

              color:"#22c55e"

            }}

          >

            Online

          </Typography>


        </Box>


      </Box>


    </Box>

  );

}


export default Sidebar;
