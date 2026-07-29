import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Box, Card, CardContent, Typography } from "@mui/material";


const cpuData = [
  {
    time: "10:00",
    cpu: 35,
  },
  {
    time: "10:05",
    cpu: 45,
  },
  {
    time: "10:10",
    cpu: 60,
  },
  {
    time: "10:15",
    cpu: 48,
  },
  {
    time: "10:20",
    cpu: 70,
  },
];


const memoryData = [
  {
    time: "10:00",
    memory: 40,
  },
  {
    time: "10:05",
    memory: 55,
  },
  {
    time: "10:10",
    memory: 65,
  },
  {
    time: "10:15",
    memory: 50,
  },
  {
    time: "10:20",
    memory: 75,
  },
];


const podStatusData = [
  {
    name: "Running",
    value: 24,
  },
  {
    name: "Pending",
    value: 3,
  },
  {
    name: "Failed",
    value: 1,
  },
];


const requestData = [
  {
    service: "Frontend",
    requests: 4500,
  },
  {
    service: "Backend",
    requests: 3200,
  },
  {
    service: "Database",
    requests: 1800,
  },
];


const COLORS = [
  "#16a34a",
  "#d97706",
  "#dc2626",
];



function ChartCard({ title, children }) {

  return (

    <Card>

      <CardContent>

        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600
          }}
        >
          {title}
        </Typography>


        <Box
          sx={{
            width:"100%",
            height:300
          }}
        >

          {children}

        </Box>


      </CardContent>

    </Card>

  );

}



function Charts() {


  return (

    <Box
      sx={{
        display:"grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(400px,1fr))",
        gap:3
      }}
    >


      {/* CPU Usage */}

      <ChartCard title="Cluster CPU Usage (%)">

        <ResponsiveContainer>

          <LineChart data={cpuData}>

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="time"/>

            <YAxis/>

            <Tooltip/>

            <Legend/>


            <Line
              type="monotone"
              dataKey="cpu"
              stroke="#2563eb"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </ChartCard>




      {/* Memory Usage */}

      <ChartCard title="Cluster Memory Usage (%)">

        <ResponsiveContainer>

          <AreaChart data={memoryData}>

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="time"/>

            <YAxis/>

            <Tooltip/>

            <Area
              type="monotone"
              dataKey="memory"
              stroke="#7c3aed"
              fill="#7c3aed"
            />

          </AreaChart>

        </ResponsiveContainer>


      </ChartCard>





      {/* Pod Health */}

      <ChartCard title="Pod Health Status">


        <ResponsiveContainer>


          <PieChart>


            <Pie
              data={podStatusData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >

              {
                podStatusData.map(
                  (entry,index)=>(
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  )
                )
              }


            </Pie>


            <Tooltip/>

            <Legend/>


          </PieChart>


        </ResponsiveContainer>


      </ChartCard>






      {/* Service Traffic */}

      <ChartCard title="Service Request Traffic">


        <ResponsiveContainer>


          <BarChart data={requestData}>


            <CartesianGrid strokeDasharray="3 3"/>


            <XAxis dataKey="service"/>


            <YAxis/>


            <Tooltip/>


            <Legend/>


            <Bar
              dataKey="requests"
              fill="#2563eb"
            />


          </BarChart>


        </ResponsiveContainer>


      </ChartCard>



    </Box>

  );

}


export default Charts;
