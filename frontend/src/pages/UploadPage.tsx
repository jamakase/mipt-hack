import React from "react";

import {useFormik} from "formik";
import * as Yup from "yup";
import {Box, Container, IconButton, Paper, TextField} from "@mui/material";

import {Head} from "../components/Head";
import Dropzone from "../components/Dropzone";
import PageTitle from "../components/PageTitle";
import BackLink from "../components/BackLink";
import {Routes} from "./router";
import {uploadFile} from '../domain/api';
import {useMutation} from "react-query";
import AudioFileOutlinedIcon from '@mui/icons-material/AudioFileOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {LoadingButton} from "@mui/lab";
import {useNavigate} from "react-router";

const validationMessage = "Обязательное поле";

const validationSchema = Yup.object({
    name: Yup.string().required(validationMessage),
});

const UploadPage: React.FC = () => {
    const navigate = useNavigate();

    const send = useMutation(uploadFile, {
        onSuccess: (data) => {
            navigate(`${Routes.LECTURE}/${data.data.id}`);
        }
    });

    const formik = useFormik<{
        name: string,
        files: {
            path: string;
            type: "file" | "folder";
            name: string;
            mimeType: string;
            data: string;
        }[]
    }>({
        initialValues: {
            name: "",
            files: [],
        },
        onSubmit: async (values) => send.mutate({ file: values.files[0], name: values.name }),
        validationSchema,
    });

    const hasFile = !!formik.values.files.length;
    const nameError = !!(formik.touched?.name && formik.errors?.name);

    return (
        <>
            <Head title="Страница загрузки лекции"/>
            <Container maxWidth="lg" >
                <BackLink to={Routes.ROOT}>назад к лекциям</BackLink>
                <PageTitle>
                    Загрузка лекции
                </PageTitle>
                <Paper variant="outlined" sx={{p: "30px", maxWidth: "70%", margin: "0 auto"}}>
                    <form onSubmit={formik.handleSubmit}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap="30px"
                        >
                            <TextField
                                error={nameError}
                                id="outlined-error-helper-text"
                                label="Название лекции"
                                {...formik.getFieldProps("name")}
                            />
                            <Box
                                display="flex"
                                gap="30px"
                                maxWidth="80%"
                                minHeight="300px"
                            >
                                <Box flex={1}>
                                    {hasFile
                                        ? <Box display="flex" gap="10px" justifyContent="space-between" alignItems="center">
                                            <AudioFileOutlinedIcon sx={{ width: '40px', height: '40px'}} />
                                            <p>{formik.values.files.map(file => file.name)}</p>
                                            <IconButton
                                                aria-label="delete"
                                                color="primary"
                                                size="small"
                                                onClick={() => formik.setFieldValue("files", [])}
                                                sx={{"&:focus": {outline: "none"}}}
                                            >
                                                <CloseOutlinedIcon
                                                    fontSize="medium"
                                                    cursor="pointer"
                                                />
                                            </IconButton>
                                            
                                        </Box>
                                        : <Dropzone
                                            acceptTypes={{"audio/mp3": [".mp3"]}}
                                            onDrop={(acceptedFiles: any[]) => {
                                                acceptedFiles.forEach((file) => {
                                                    const reader = new FileReader()

                                                    reader.onabort = () => console.log('file reading was aborted')
                                                    reader.onerror = () => console.log('file reading has failed')
                                                    reader.onload = () => {
                                                        // Do whatever you want with the file contents
                                                        //const binaryStr = reader.result
                                                        formik.setFieldValue("files", [file]);
                                                    }
                                                    reader.readAsArrayBuffer(file)
                                                })
                                            }}
                                        />
                                    }
                                </Box>
                                <Box flex={1}>
                                    <p>Добавьте файл с данными.</p>
                                    <p>Вы можeте добавить только файлы в формате .mp3</p>
                                    <LoadingButton
                                        type="submit"
                                        loading={send.isLoading}
                                        loadingPosition="center"
                                        variant="contained"
                                        disabled={!hasFile}
                                    >
                                        Загрузить
                                    </LoadingButton>
                                </Box>
                            </Box>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </>
    );
};

export default UploadPage;

