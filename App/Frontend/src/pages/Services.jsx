import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

import {
  Cloud,
  Public,
  Storage,
  NetworkCheck
} from "@mui/icons-material";

import StatusBadge from "../components/StatusBadge";


function Services() {


  const services = [

    {
      name: "frontend-service",
      namespace: "default",
      type: "LoadBalancer",
      endpoint: "frontend.example.com",
      port: "80",
      status: "Running"
    },

    {
      name: "backend-service",
      namespace: "default",
      type: "ClusterIP",
      endpoint: "backend-service",
      port: "8080",
      status: "Running"
    },

    {
      name: "postgres-service",
      namespace: "monitoring",
      type: "ClusterIP",
      endpoint: "postgres-service",
      port: "5432",
      status: "Healthy"
    },

    {
      name: "prometheus-service",
      namespace: "monitoring",
      type: "ClusterIP",
      endpoint: "prometheus-server",
      port: "9090",
      status: "Running"
    }

  ];



  const serviceMetrics = [

    {
      title: "Active Services",
      value: services.length,
      icon: <Cloud />
    },

    {
      title: "External Endpoints",
      value: "1",
      icon: <Public />
    },

    {
      title: "Internal Services",
      value: "3",
      icon: <Storage />
    },

    {
      title: "Healthy Services",
      value: "100%",
      icon: <NetworkCheck />
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

        Kubernetes Services

      </Typography>



      <Typography

        color="text.secondary"

        sx={{mb:4}}

      >

        Monitor service discovery, networking and application availability

      </Typography>





      {/* Summary Cards */}

      <Grid

        container

        spacing={3}

        sx={{mb:4}}

      >

        {
          serviceMetrics.map((metric)=>(

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

                        variant="h4"

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


                </CardContent>

              </Card>


            </Grid>

          ))
        }


      </Grid>





      {/* Service Table */}

      <Card>

        <CardContent>


          <Typography

            variant="h6"

            sx={{

              fontWeight:600,

              mb:2

            }}

          >

            Service Details

          </Typography>



          <TableContainer

            component={Paper}

          >

            <Table>


              <TableHead>

                <TableRow>

                  <TableCell>
                    Service Name
                  </TableCell>

                  <TableCell>
                    Namespace
                  </TableCell>

                  <TableCell>
                    Type
                  </TableCell>

                  <TableCell>
                    Endpoint
                  </TableCell>

                  <TableCell>
                    Port
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>

                </TableRow>

              </TableHead>



              <TableBody>


                {
                  services.map((service)=>(


                    <TableRow

                      key={service.name}

                    >

                      <TableCell>

                        {service.name}

                      </TableCell>


                      <TableCell>

                        {service.namespace}

                      </TableCell>


                      <TableCell>

                        {service.type}

                      </TableCell>


                      <TableCell>

                        {service.endpoint}

                      </TableCell>


                      <TableCell>

                        {service.port}

                      </TableCell>


                      <TableCell>

                        <StatusBadge

                          status={service.status}

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


export default Services;
