// ==========================================
// EKS Observability Dashboard Helpers
// ==========================================



// Format CPU percentage

export const formatCPU = (value) => {

  if (value === null || value === undefined) {

    return "0%";

  }


  return `${Number(value).toFixed(1)}%`;

};





// Format Memory values

export const formatMemory = (bytes) => {


  if (!bytes || bytes === 0) {

    return "0 Mi";

  }


  const units = [

    "B",

    "Ki",

    "Mi",

    "Gi",

    "Ti"

  ];


  const index = Math.floor(

    Math.log(bytes) /

    Math.log(1024)

  );


  return (

    `${(

      bytes /

      Math.pow(1024, index)

    ).toFixed(2)} ${units[index]}`

  );


};





// Convert Kubernetes CPU millicores

// Example: 500m => 0.5 CPU

export const formatCPUUnits = (cpu) => {


  if (!cpu) {

    return "0 CPU";

  }


  if (cpu.endsWith("m")) {


    return (

      `${(

        Number(

          cpu.replace("m", "")

        ) / 1000

      ).toFixed(2)} CPU`

    );

  }


  return `${cpu} CPU`;

};





// Format pod count

export const formatCount = (value) => {


  if (!value) {

    return "0";

  }


  return Number(value).toLocaleString();

};





// Format uptime

export const formatUptime = (seconds) => {


  if (!seconds) {

    return "0m";

  }


  const days = Math.floor(

    seconds / 86400

  );


  const hours = Math.floor(

    (seconds % 86400) / 3600

  );


  const minutes = Math.floor(

    (seconds % 3600) / 60

  );



  return (

    `${days}d ${hours}h ${minutes}m`

  );

};





// Format date/time

export const formatDateTime = (date) => {


  if (!date) {

    return "-";

  }


  return new Date(date)

    .toLocaleString();

};





// Get Kubernetes resource status color

export const getStatusColor = (status) => {


  switch(status?.toLowerCase()) {


    case "running":

    case "healthy":

    case "ready":

    case "active":

      return "success";



    case "pending":

    case "warning":

    case "degraded":

      return "warning";



    case "failed":

    case "error":

    case "critical":

    case "crashloopbackoff":

      return "error";



    default:

      return "default";

  }

};





// Check resource health

export const isHealthy = (status) => {


  const healthyStates = [

    "running",

    "healthy",

    "ready",

    "active"

  ];


  return healthyStates.includes(

    status?.toLowerCase()

  );

};





// Calculate percentage

export const calculatePercentage = (

  used,

  total

) => {


  if (!total) {

    return 0;

  }


  return Number(

    (

      (used / total) *

      100

    ).toFixed(2)

  );

};





// Truncate long Kubernetes names

export const truncateName = (

  name,

  length = 20

) => {


  if (!name) {

    return "";

  }


  if (name.length <= length) {

    return name;

  }


  return (

    `${name.substring(0, length)}...`

  );

};





// Generate random ID

export const generateId = () => {


  return (

    Math.random()

      .toString(36)

      .substring(2, 10)

  );

};
