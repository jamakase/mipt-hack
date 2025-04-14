import React, {Suspense} from "react";
import {RouteObject, useRoutes, BrowserRouter, Link} from 'react-router-dom';

import CircularProgress from '@mui/material/CircularProgress';

import IndexPage from "./IndexPage"
import MainLayout from "../components/MainLayout";
import EmptyPage from "./EmptyPage";
import LecturePage from "./LecturePage";
import UploadPage from "./UploadPage";

export const  Routes = {
    ROOT: "/",
    LECTURE: "/lecture",
    UPLOAD: "/upload",
};

const Loading = () => <EmptyPage><CircularProgress color="primary"/></EmptyPage>;

export const InnerRouter: React.FC = () => {
    const routes: RouteObject[] = [
        {
            path: '/',
            element: <MainLayout />,
            children: [
                {
                    index: true,
                    element: <IndexPage/>,
                },
                {
                    path: `${Routes.LECTURE}/:id`,
                    element: <LecturePage/>,
                },
                {
                    path: Routes.UPLOAD,
                    element: <UploadPage />,
                },
                {
                    path: '*',
                    element: (
                        <EmptyPage text="ERROR 404">
                            <Link to={Routes.ROOT}>Перейти на главную страницу</Link>
                        </EmptyPage>
                    ),
                },
            ],
        }
    ];
    const element = useRoutes(routes);
    return (
        <Suspense fallback={<Loading/>}>{element}</Suspense>
    );
}

export const Router = () => {
    return (
        <BrowserRouter>
            <InnerRouter />
        </BrowserRouter>
    );
};