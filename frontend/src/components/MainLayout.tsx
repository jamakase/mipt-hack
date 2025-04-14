import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import {AppBar, Container, Toolbar, CssBaseline} from "@mui/material";
import {Routes} from "../pages/router";
import {styled} from "@mui/material/styles";

const ContainerView = styled(Container)(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    background: theme.palette.secondary.light,
    padding: "30px 0",
    position: "relative",
    overflow: "auto"
}));

const MainLayout: React.FC = () => {
    return (
        <>
            <CssBaseline />
            <AppBar component="nav" position="sticky" color={"secondary"} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
                <Container maxWidth="xl" >
                    <Toolbar disableGutters>
                        <Link to={Routes.ROOT}>
                            <img src={"/logo.png"} alt="logo" width={150}/>
                        </Link>
                    </Toolbar>
                </Container>
            </AppBar>
            <ContainerView
                maxWidth={false}
            >
                <Outlet/>
            </ContainerView>
        </>
    );
};

export default MainLayout;
