import {
  Box,
  Typography,
  Grid,
  Button
} from "@mui/material";

import {
  Cloud,
  Storage,
  Memory,
  Warning,
  Refresh
} from "@mui/icons-material";


import DashboardCard from "../components/DashboardCard";
import Charts from "../components/Charts";
import StatusBadge from "../components/StatusBadge";
import Loading from "../components/Loading";

import useDashboard from "../hooks/useDashboard";

import "../assets/styles/dashboard.css";



function Dashboard() {


  const {
    data,
    loading,
    error,
    refresh
  } = useDashboard();



  if (loading) {

    return (

      <Loading

        message="Loading EKS cluster metrics..."

      />

    );

  }



  if (error) {

    return (

      <Box className="dashboard-container">


        <Typography

          variant="h5"

          color="error"

        >

          Failed to load dashboard data

        </Typography>


        <Button

          variant="contained"

          startIcon={<Refresh />}

          onClick={refresh}

          sx={{mt:2}}

        >

          Retry

        </Button>


      </Box>

    );

  }



  return (

    <Box className="dashboard-container">


      {/* Header */}

      <Box className="dashboard-header">


        <Box>

          <Typography

            className="dashboard-title"

          >

            EKS Observability Dashboard

          </Typography>


          <Typography

            className="dashboard-subtitle"

          >

            Kubernetes cluster health, workloads and metrics

          </Typography>


        </Box>



        <Button

          variant="outlined"

          startIcon={<Refresh />}

          onClick={refresh}

        >

          Refresh

        </Button>


      </Box>





      {/* Metrics Cards */}


      <Grid

        container

        spacing={3}

        sx={{mb:4}}

      >


        <Grid item xs={12} sm={6} md={3}>


          <DashboardCard

            title="Running Pods"

            value={
              data?.pods?.length || 0
            }

            icon={<Cloud />}

            status="Healthy"

            color="success"

          />


        </Grid>





        <Grid item xs={12} sm={6} md={3}>


          <DashboardCard

            title="Cluster Nodes"

            value={
              data?.nodes?.length || 0
            }

            icon={<Storage />}

            status="Ready"

            color="primary"

          />


        </Grid>





        <Grid item xs={12} sm={6} md={3}>


          <DashboardCard

            title="Memory Usage"

            value={
              data?.cluster?.memory || "N/A"
            }

            icon={<Memory />}

            status="Healthy"

            color="warning"

          />


        </Grid>





        <Grid item xs={12} sm={6} md={3}>


          <DashboardCard

            title="Active Alerts"

            value={
              data?.cluster?.alerts || 0
            }

            icon={<Warning />}

            status="Critical"

            color="error"

          />


        </Grid>


      </Grid>





      {/* Cluster Status */}


      <Box

        sx={{

          mb:3,

          display:"flex",

          alignItems:"center",

          gap:2

        }}

      >

        <Typography

          variant="h6"

        >

          Cluster Status:

        </Typography>


        <StatusBadge

          status="Running"

        />


      </Box>





      {/* Charts */}


      <Charts />


    </Box>

  );

}


export default Dashboard;
