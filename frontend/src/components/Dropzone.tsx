import React from "react";
import { useDropzone } from 'react-dropzone';
import {Box} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

const Dropzone: React.FC<{ onDrop: any, acceptTypes?: any }> = props => {
    const { onDrop } = props;
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: props.acceptTypes,
        onDrop: acceptedFiles => onDrop(acceptedFiles)
    });
    
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
            maxWidth="300px"
            sx={{cursor: 'pointer', "&:hover": {borderColor: 'grey.900'}}}
            border={1}
            p="20px"
            borderRadius="4px"
            borderColor="grey.400"
            {...getRootProps({ className: "dropzone" })}
        >
            <input {...getInputProps()} />
            <DownloadIcon sx={{ width: '80px', height: '80px'}} color="primary" />
            <Box mt="20px" textAlign="center">
                {isDragActive ? (
                    <p>Перетащить сюда ...</p>
                ) : (
                    <p>Загрузите файл, нажав сюда или перетащив его</p>
                )}
            </Box>
        </Box>
    );
};
export default Dropzone;