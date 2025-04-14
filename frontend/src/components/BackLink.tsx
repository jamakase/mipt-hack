import React from 'react';

import WestIcon from "@mui/icons-material/West";
import {Link} from "react-router-dom";
import {styled} from "@mui/material/styles";

type BackLinkProps = {
    children: any,
    to: string,
}

const Back = styled(Link)(({theme}) => ({
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    fontSize: "12px",
    lineHeight: "12px",
    marginBottom: 2,
    color: theme.palette.secondary.main,
    width: "max-content"
}));

const BackLink: React.FC<BackLinkProps> = ({children, to}) => (
    <Back to={to}>
        <WestIcon sx={{ fontSize: "12px", mr: 1}} />
        {children}
    </Back>
);

export default BackLink;