import {
  Chip
} from "@mui/material";


function StatusBadge({
  status
}) {


  const getStatusConfig = () => {

    switch(status?.toLowerCase()) {


      case "running":

      case "healthy":

      case "active":

      case "ready":

        return {

          label: status,

          color: "success"

        };



      case "pending":

      case "warning":

      case "degraded":

        return {

          label: status,

          color: "warning"

        };



      case "failed":

      case "error":

      case "critical":

      case "crashloopbackoff":

        return {

          label: status,

          color: "error"

        };



      case "deploying":

      case "starting":

      case "loading":

        return {

          label: status,

          color: "info"

        };



      default:

        return {

          label: status || "Unknown",

          color: "default"

        };


    }

  };



  const config = getStatusConfig();



  return (

    <Chip

      label={config.label}

      color={config.color}

      size="small"

      sx={{

        fontWeight:600,

        borderRadius:2,

        textTransform:"capitalize"

      }}

    />

  );

}


export default StatusBadge;
