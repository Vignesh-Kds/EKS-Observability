import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider
} from "@mui/material";


function About() {


  const technologies = [

    "React",

    "Material UI",

    "Kubernetes",

    "Amazon EKS",

    "Prometheus",

    "Grafana",

    "Helm",

    "Docker",

    "Terraform",

    "AWS",

  ];



  return (

    <Box

      sx={{

        padding:3,

      }}

    >


      <Typography

        variant="h4"

        sx={{

          fontWeight:700,

          mb:3

        }}

      >

        About EKS Observability Dashboard

      </Typography>




      <Card

        sx={{

          mb:3

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

            Project Overview

          </Typography>



          <Typography

            color="text.secondary"

          >

            EKS Observability Dashboard is a Kubernetes monitoring
            platform designed to visualize cluster health,
            workload status, resource utilization, and service
            performance.

            The dashboard provides real-time insights into
            Amazon EKS environments using modern cloud-native
            monitoring tools.

          </Typography>


        </CardContent>


      </Card>





      <Card

        sx={{

          mb:3

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

            Architecture Stack

          </Typography>



          <Box

            sx={{

              display:"flex",

              flexWrap:"wrap",

              gap:1

            }}

          >

            {

              technologies.map((tech)=>(

                <Chip

                  key={tech}

                  label={tech}

                  color="primary"

                  variant="outlined"

                />

              ))

            }


          </Box>


        </CardContent>


      </Card>





      <Card>

        <CardContent>


          <Typography

            variant="h6"

            sx={{

              fontWeight:600,

              mb:2

            }}

          >

            Application Information

          </Typography>



          <Divider sx={{mb:2}} />



          <Typography>

            Version: <b>1.0.0</b>

          </Typography>



          <Typography>

            Environment: <b>Production Ready</b>

          </Typography>



          <Typography>

            Platform: <b>Amazon Elastic Kubernetes Service</b>

          </Typography>



          <Typography>

            Monitoring: <b>Prometheus + Grafana</b>

          </Typography>



        </CardContent>

      </Card>


    </Box>

  );

}


export default About;
