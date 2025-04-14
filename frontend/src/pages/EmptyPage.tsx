import React from 'react';
import {Box, Container, Typography} from "@mui/material";

type EmptyPageProps = {
    text?: string;
    children?: any;
}
const EmptyPage: React.FC<EmptyPageProps> = ({text, children}) => {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                textAlign: "center"
        }}>
            {
                text ? (
                    <Typography variant="h6" gutterBottom color="primary" fontWeight='fontWeightBold'>
                        {text}
                    </Typography>
                ) : null
            }
            {
                children ? <Box mt={4}>{children}</Box> : null
            }
        </Container>
    );
};

export default EmptyPage;