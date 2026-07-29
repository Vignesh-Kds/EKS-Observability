// ==========================================
// Material UI Theme Configuration
// EKS Observability Dashboard
// ==========================================

import { createTheme } from "@mui/material/styles";


const theme = createTheme({

  palette: {

    mode: "light",

    primary: {
      main: "#2563eb",
      light: "#60a5fa",
      dark: "#1e40af",
      contrastText: "#ffffff",
    },


    secondary: {
      main: "#7c3aed",
      light: "#a78bfa",
      dark: "#5b21b6",
    },


    success: {
      main: "#16a34a",
    },


    warning: {
      main: "#d97706",
    },


    error: {
      main: "#dc2626",
    },


    background: {

      default: "#f5f7fb",

      paper: "#ffffff",

    },


    text: {

      primary: "#111827",

      secondary: "#6b7280",

    },


  },


  typography: {

    fontFamily:
      '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',


    h1: {

      fontSize: "2rem",

      fontWeight: 700,

    },


    h2: {

      fontSize: "1.5rem",

      fontWeight: 600,

    },


    h3: {

      fontSize: "1.25rem",

      fontWeight: 600,

    },


    body1: {

      fontSize: "1rem",

    },


    body2: {

      fontSize: "0.875rem",

    },

  },


  shape: {

    borderRadius: 12,

  },


  components: {


    // Global Card Styling

    MuiCard: {

      styleOverrides: {

        root: {

          borderRadius: 12,

          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",

        },

      },

    },


    // Buttons

    MuiButton: {

      styleOverrides: {

        root: {

          borderRadius: 8,

          textTransform: "none",

          fontWeight: 600,

        },

      },

    },


    // Paper

    MuiPaper: {

      styleOverrides: {

        root: {

          borderRadius: 12,

        },

      },

    },


    // Table

    MuiTableCell: {

      styleOverrides: {

        root: {

          padding: "14px",

        },

      },

    },


  },

});


export default theme;
