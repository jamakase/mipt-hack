import React from 'react';

import {Drawer, Toolbar,} from "@mui/material";
import {styled} from "@mui/material/styles";

type SideBlockProps = {
    anchor?: "left" | "right",
    drawerWidth?: number;
    children?: any
}

const MainDrawer = styled(Drawer)(() => ({
    // color: theme.palette.primary.main,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
        padding: "30px 20px",
        // background: "rgba(255, 255, 255, 0.2)",
        border: "none",
        boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
    }
}));

const SideBlock: React.FC<SideBlockProps> = ({anchor, drawerWidth, children}) => {
    return (
        <MainDrawer
            sx={{
                width: drawerWidth || 240,
                '& .MuiDrawer-paper': {
                    width: drawerWidth || 240,
                },
            }}
            variant="permanent"
            anchor={anchor || "left"}
        >
            <Toolbar/>
            {children}
        </MainDrawer>
    );
};

export default SideBlock;