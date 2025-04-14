import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {Box, CircularProgress, IconButton, TextareaAutosize, TextField, Tooltip} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useMutation} from "react-query";
import {addGlossaryItem} from "../domain/api";

type AddGlosaryItemFormProps = {
    onClose: () => void;
    glosaryId: string;
}

const Textarea = styled(TextareaAutosize)(({theme}) => ({
    color: theme.palette.secondary.main,
    fontWeight: 400,
    lineHeight: 1.5,
    padding: "8px",
    borderRadius: "12px 12px 0 12px",
    fontFamily: "IBM Plex Sans, sans-serif",
    width: "100%",
    resize: "none",
    "&:hover": {
        borderColor: theme.palette.primary.main,
    },
    "&:focus": {
        outline: theme.palette.primary.dark,
        borderColor: theme.palette.primary.dark,
    }
}));

const validationSchema = Yup.object({
    meaning: Yup.string().required(),
    term: Yup.string().required(),
});

const AddGlosaryItemForm: React.FC<AddGlosaryItemFormProps> = ({onClose, glosaryId}) => {
    const send = useMutation(addGlossaryItem, {
        onSuccess: () => {
            onClose();
        }
    });

    const formik = useFormik<{
        meaning: string,
        term: string
    }>({
        initialValues: {
            term: "",
            meaning: "",
        },

        onSubmit: async (values) => send.mutate({
            term: values.term, meaning: values.meaning, id: glosaryId
        }),
        validationSchema,
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <TextField
                variant="standard"
                autoFocus={true}
                size="small"
                error={!!formik.touched?.term && !!formik.errors?.term}
                label="Понятие"
                sx={{paddingBottom: 2, "& input": {fontSize: "13px !important"}}}
                {...formik.getFieldProps("term")}
            />
            <Textarea
                id="standard-basic"
                sx={{
                    borderColor: !!formik.touched?.meaning && !!formik.errors?.meaning ? "#d32f2f" : ""
                }}
                maxRows={7}
                minRows={2}
                placeholder="Описание"
                {...formik.getFieldProps("meaning")}
            />
            <Box flexDirection="row" display="flex" justifyContent="right">
                {
                    send.isLoading ? <CircularProgress color="primary" size="25px"/> : (
                        <>
                            <Tooltip title="Сохранить">
                                <IconButton
                                    aria-label="done"
                                    size="small"
                                    sx={{"&:focus": {outline: "none"}}}
                                    color="success"
                                    type="submit"
                                >
                                    <DoneIcon sx={{fontSize: "15px"}}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Отмена">
                                <IconButton
                                    type="button"
                                    aria-label="back"
                                    size="small"
                                    sx={{"&:focus": {outline: "none"}}}
                                    color="error"
                                    onClick={onClose}
                                >
                                    <CloseIcon sx={{fontSize: "15px"}}/>
                                </IconButton>
                            </Tooltip>
                        </>
                    )
                }
            </Box>
        </form>
    );
};

export default AddGlosaryItemForm;