import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress
} from "@mui/material";

import {
  Storage,
  Memory,
  Speed,
  People
} from "@mui/icons-material";

import StatusBadge from "../components/StatusBadge";



function Database() {


  const databaseMetrics = [

    {
      title: "Database Status",
      value: "Healthy",
      icon: <Storage />,
      status: "Running"
    },

    {
      title: "CPU Usage",
      value: "42%",
      icon: <Memory />,
      status: "Healthy"
    },

    {
      title: "Query Performance",
      value: "98 ms",
      icon: <Speed />,
      status: "Healthy"
    },

    {
      title: "Active Connections",
      value: "35",
      icon: <People />,
      status: "Running"
    }

  ];



  return (

    <Box className="dashboard-container">


      {/* Header */}

      <Typography

        variant="h4"

        sx={{

          fontWeight:700,

          mb:3

        }}

      >

        Database Monitoring

      </Typography>



      <Typography

        color="text.secondary"

        sx={{mb:4}}

      >

        PostgreSQL database health and performance metrics

      </Typography>





      {/* Metrics */}

      <Grid

        container

        spacing={3}

      >


        {
          databaseMetrics.map((metric)=>(


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

                    <Box>


                      <Typography

                        variant="body2"

                        color="text.secondary"

                      >

                        {metric.title}

                      </Typography>



                      <Typography

                        variant="h5"

                        sx={{

                          mt:1,

                          fontWeight:700

                        }}

                      >

                        {metric.value}

                      </Typography>


                    </Box>


                    {metric.icon}


                  </Box>



                  <Box sx={{mt:2}}>

                    <StatusBadge

                      status={metric.status}

                    />

                  </Box>



                </CardContent>


              </Card>


            </Grid>


          ))

        }


      </Grid>





      {/* Storage Usage */}

      <Card

        sx={{

          mt:4

        }}

      >

        <CardContent>


          <Typography

            variant="h6"

            sx={{

              fontWeight:600,

              mb:2

            }}

          >

            Database Storage

          </Typography>



          <Typography

            variant="body2"

            color="text.secondary"

          >

            PostgreSQL Persistent Volume Usage

          </Typography>



          <Box sx={{mt:2}}>


            <Typography

              variant="body2"

              sx={{mb:1}}

            >

              65 GB / 100 GB

            </Typography>



            <LinearProgress

              variant="determinate"

              value={65}

              sx={{

                height:10,

                borderRadius:5

              }}

            />


          </Box>


        </CardContent>

      </Card>





      {/* Database Information */}

      <Card

        sx={{

          mt:4

        }}

      >

        <CardContent>


          <Typography

            variant="h6"

            sx={{

              fontWeight:600,

              mb:2

            }}

          >

            Database Information

          </Typography>



          <Typography>

            Engine: <b>PostgreSQL 16</b>

          </Typography>



          <Typography>

            Namespace: <b>monitoring</b>

          </Typography>



          <Typography>

            Service: <b>postgres-service</b>

          </Typography>



          <Typography>

            Storage Class: <b>gp3 EBS</b>

          </Typography>



        </CardContent>

      </Card>


    </Box>

  );

}


export default Database;
