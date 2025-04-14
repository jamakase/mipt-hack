import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            light: '#B181FF',
            main: '#7653FF',
            dark: '#6632B9',
    //         contrastText: '#fff',
        },
        secondary: {
            // light: '#FAFAFD',
            light: '#fdfdfd',
            // light: 'rgba(245, 245, 245, 0.2)',
            main: '#263238',
            // dark: '#ba000d',
            // contrastText: '#000',
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: ({
                root: {
                    // backgroundColor: "#263238",
                }
            })
        },
        MuiTableContainer: {
            styleOverrides: ({
                root: {
                    boxShadow: "none",
                    border: "1px solid rgba(0, 0, 0, 0.12)"
                }
            })
        },
        MuiTableCell: {
            styleOverrides: ({
                head: {
                    // backgroundColor: "#e9eaeb",
                    // backgroundColor: "#FAFAFA",
                    backgroundColor: "#fafcfd",
                    // color: "white",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    fontWeight: "bold"
                }
            })
        },
        MuiTableRow : {
            styleOverrides: ({
                root: {
                    '&.MuiTableRow-hover:hover': {
                        backgroundColor: 'rgba(118, 83, 255, 0.03)',
                    },
                }
            })
        },
        MuiButton: {
            styleOverrides: ({
                root: {
                    '&:focus': {
                        outline: '#6632B9',
                    },
                }
            })
        }
    }
});