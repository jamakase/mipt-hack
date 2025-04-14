import React from 'react';
import {Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router";
import {Routes} from "../pages/router";

const IndexPage: React.FC = () => {
    const navigate = useNavigate();
    const onUploadClick = () => navigate(Routes.UPLOAD);

    return (
        <Button
            // as={Link}
            // to={Routes.UPLOAD}
            onClick={onUploadClick}
            variant="outlined"
            size="small"
            startIcon={<AddIcon/>}
            color="primary"
            disabled={false}
        >
            Загрузить лекцию
        </Button>
    );
};

export default IndexPage;