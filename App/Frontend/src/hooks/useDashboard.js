import { useEffect, useState, useCallback } from "react";

import {
  getClusterMetrics,
  getPodMetrics,
  getNodeMetrics,
  getServiceMetrics,
} from "../services/dashboardService";


function useDashboard() {

  const [dashboardData, setDashboardData] = useState({

    cluster: null,

    pods: [],

    nodes: [],

    services: [],

  });


  const [loading, setLoading] = useState(true);


  const [error, setError] = useState(null);



  const fetchDashboardData = useCallback(async () => {

    try {

      setLoading(true);

      setError(null);


      const [
        cluster,
        pods,
        nodes,
        services
      ] = await Promise.all([

        getClusterMetrics(),

        getPodMetrics(),

        getNodeMetrics(),

        getServiceMetrics(),

      ]);



      setDashboardData({

        cluster,

        pods,

        nodes,

        services,

      });


    } catch (err) {


      console.error(
        "Dashboard data fetch failed:",
        err
      );


      setError(
        err.message ||
        "Unable to load dashboard data"
      );


    } finally {

      setLoading(false);

    }


  }, []);




  useEffect(() => {

    fetchDashboardData();

  }, [fetchDashboardData]);





  return {

    data: dashboardData,

    loading,

    error,

    refresh: fetchDashboardData,

  };


}


export default useDashboard;
