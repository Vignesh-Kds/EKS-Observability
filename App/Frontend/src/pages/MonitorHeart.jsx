import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

import {
  Memory,
  Speed,
  Dns,
  Warning
} from "@mui/icons-material";

import Charts from "../components/Charts";
import StatusBadge from "../components/StatusBadge";



function MonitorHeart() {


  const resources = [

    {
      name: "frontend-deployment",
      type: "Deployment",
      cpu: "35%",
      memory: "512Mi",
      status: "Running"
    },

    {
      name: "backend-deployment",
      type: "Deployment",
      cpu: "48%",
      memory: "768Mi",
      status: "Running"
    },

    {
      name: "postgres-statefulset",
      type: "StatefulSet",
      cpu: "42%",
      memory: "1Gi",
      status: "Healthy"
    },

    {
      name: "prometheus-server",
      type: "Monitoring",
      cpu: "28%",
      memory: "512Mi",
      status: "Running"
    }

  ];



  const metrics = [

    {
      title:"CPU Utilization",
      value:"45%",
      icon:<Speed />,
      progress:45
    },

    {
      title:"Memory Utilization",
      value:"68%",
      icon:<Memory />,
      progress:68
    },

    {
      title:"Running Workloads",
      value:"24 Pods",
      icon:<Dns />,
      progress:80
    },

    {
      title:"Active Alerts",
      value:"3",
      icon:<Warning />,
      progress:30
    }

  ];



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

        Cluster Monitoring

      </Typography>


      <Typography

        color="text.secondary"

        sx={{mb:4}}

      >

        Real-time Kubernetes workload and infrastructure metrics

      </Typography>





      {/* Resource Metrics */}

      <Grid

        container

        spacing={3}

        sx={{mb:4}}

      >


        {

          metrics.map((metric)=>(


            <Grid

              item

              xs={12}

              sm={6}

              md={3}

              key={metric.title}

            >


              <Card>


                <CardContent>


                  <Box

                    sx={{

                      display:"flex",

                      justifyContent:"space-between",

                      alignItems:"center"

                    }}

                  >

                    <Typography

                      variant="body2"

                      color="text.secondary"

                    >

                      {metric.title}

                    </Typography>


                    {metric.icon}


                  </Box>



                  <Typography

                    variant="h5"

                    sx={{

                      mt:2,

                      fontWeight:700

                    }}

                  >

                    {metric.value}

                  </Typography>



                  <LinearProgress

                    variant="determinate"

                    value={metric.progress}

                    sx={{

                      mt:2,

                      height:8,

                      borderRadius:5

                    }}

                  />


                </CardContent>


              </Card>


            </Grid>


          ))

        }


      </Grid>





      {/* Charts */}

      <Box sx={{mb:4}}>

        <Charts />

      </Box>





      {/* Kubernetes Workloads */}

      <Card>


        <CardContent>


          <Typography

            variant="h6"

            sx={{

              fontWeight:600,

              mb:2

            }}

          >

            Kubernetes Workloads

          </Typography>



          <TableContainer

            component={Paper}

          >

            <Table>


              <TableHead>

                <TableRow>

                  <TableCell>
                    Resource
                  </TableCell>

                  <TableCell>
                    Type
                  </TableCell>

                  <TableCell>
                    CPU
                  </TableCell>

                  <TableCell>
                    Memory
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>


                </TableRow>

              </TableHead>



              <TableBody>


                {

                  resources.map((resource)=>(


                    <TableRow

                      key={resource.name}

                    >

                      <TableCell>

                        {resource.name}

                      </TableCell>


                      <TableCell>

                        {resource.type}

                      </TableCell>


                      <TableCell>

                        {resource.cpu}

                      </TableCell>


                      <TableCell>

                        {resource.memory}

                      </TableCell>


                      <TableCell>

                        <StatusBadge

                          status={resource.status}

                        />

                      </TableCell>


                    </TableRow>


                  ))

                }


              </TableBody>


            </Table>


          </TableContainer>


        </CardContent>


      </Card>


    </Box>

  );

}


export default MonitorHeart;
