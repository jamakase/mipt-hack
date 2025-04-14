import React from 'react';

import {Typography} from "@mui/material";

const PageTitle: React.FC<{children: any}> = ({children}) => (
    <Typography variant="h6" gutterBottom color="primary" fontWeight='fontWeightBold' align={"left"}>
        {children}
    </Typography>
);

export default PageTitle;