import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  Button,
  Divider
} from "@mui/material";

import {
  Save,
  Cloud,
  Notifications,
  Refresh
} from "@mui/icons-material";



function Settings() {


  return (

    <Box className="dashboard-container">


      {/* Header */}

      <Typography

        variant="h4"

        sx={{

          fontWeight:700,

          mb:1

        }}

      >

        Dashboard Settings

      </Typography>


      <Typography

        color="text.secondary"

        sx={{mb:4}}

      >

        Configure EKS monitoring preferences and application settings

      </Typography>





      {/* Cluster Settings */}

      <Card

        sx={{mb:3}}

      >

        <CardContent>


          <Box

            sx={{

              display:"flex",

              alignItems:"center",

              gap:1,

              mb:2

            }}

          >

            <Cloud color="primary"/>


            <Typography

              variant="h6"

              sx={{

                fontWeight:600

              }}

            >

              Cluster Configuration

            </Typography>


          </Box>



          <Divider sx={{mb:3}} />



          <TextField

            fullWidth

            label="Cluster Name"

            defaultValue="vickycluster"

            margin="normal"

          />



          <TextField

            fullWidth

            label="AWS Region"

            defaultValue="ap-south-1"

            margin="normal"

          />



          <TextField

            fullWidth

            select

            label="Default Namespace"

            defaultValue="monitoring"

            margin="normal"

          >

            <MenuItem value="default">

              default

            </MenuItem>


            <MenuItem value="monitoring">

              monitoring

            </MenuItem>


            <MenuItem value="kube-system">

              kube-system

            </MenuItem>


          </TextField>


        </CardContent>


      </Card>





      {/* Monitoring Settings */}

      <Card

        sx={{mb:3}}

      >

        <CardContent>


          <Box

            sx={{

              display:"flex",

              alignItems:"center",

              gap:1,

              mb:2

            }}

          >

            <Refresh color="primary"/>


            <Typography

              variant="h6"

              sx={{

                fontWeight:600

              }}

            >

              Monitoring Configuration

            </Typography>


          </Box>



          <Divider sx={{mb:3}} />



          <TextField

            fullWidth

            select

            label="Metrics Refresh Interval"

            defaultValue="30"

            margin="normal"

          >

            <MenuItem value="10">

              10 seconds

            </MenuItem>


            <MenuItem value="30">

              30 seconds

            </MenuItem>


            <MenuItem value="60">

              1 minute

            </MenuItem>


          </TextField>



          <TextField

            fullWidth

            label="Prometheus URL"

            defaultValue="http://prometheus-server:9090"

            margin="normal"

          />


        </CardContent>


      </Card>





      {/* Alert Settings */}

      <Card

        sx={{mb:3}}

      >

        <CardContent>


          <Box

            sx={{

              display:"flex",

              alignItems:"center",

              gap:1,

              mb:2

            }}

          >

            <Notifications color="primary"/>


            <Typography

              variant="h6"

              sx={{

                fontWeight:600

              }}

            >

              Alert Configuration

            </Typography>


          </Box>



          <Divider sx={{mb:2}} />



          <FormControlLabel

            control={

              <Switch

                defaultChecked

              />

            }

            label="Enable Kubernetes Alerts"

          />



          <FormControlLabel

            control={

              <Switch

                defaultChecked

              />

            }

            label="Enable Email Notifications"

          />


        </CardContent>


      </Card>





      {/* Save */}

      <Button

        variant="contained"

        startIcon={<Save />}

        size="large"

      >

        Save Settings

      </Button>



    </Box>

  );

}


export default Settings;
