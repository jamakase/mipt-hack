import {ThemeProvider} from "@mui/material";
import {QueryClient, QueryClientProvider} from "react-query";

import './App.css'
import {Router} from "./pages/router";
import {HelmetProvider} from "react-helmet-async";
import {theme} from "./theme";

const queryClient = new QueryClient();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <HelmetProvider>
                    <Router/>
                </HelmetProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App
