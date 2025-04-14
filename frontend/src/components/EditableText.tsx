import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import {Box, IconButton, TextareaAutosize, Tooltip, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useFormik} from "formik";
import * as Yup from "yup";
import {editGlossaryItem} from "../domain/api";
import {useMutation} from "react-query";

type EditableTextProps = {
    currentValue: string;
    glosaryId: string;
    term: string;
    termId: string;
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
    description: Yup.string().required(),
});

const EditableText: React.FC<EditableTextProps> = ({currentValue, glosaryId, term,termId}) => {
    const [editMode, setEditMode] = React.useState(false);
    // const send = useMutation(uploadFile, {
    //     onSuccess: () => {
    //         setEditMode(false);
    //     }
    // });

    const send = useMutation(editGlossaryItem, {
        onSuccess: () => {
            setEditMode(false);
        }
    });

    const formik = useFormik<{
        description: string,
    }>({
        initialValues: {
            description: currentValue,
        },
        // TODO: add edit api call
        onSubmit: async (values) => send.mutate({
            term: term, meaning: values.description, id: glosaryId, termId: termId
        }),
        validationSchema,
    });


    if (editMode) {
        return (
            <form onSubmit={formik.handleSubmit}>
                <Textarea
                    autoFocus={true}
                    id="standard-basic"
                    maxRows={7}
                    minRows={2}
                    placeholder="Описание"
                    sx={{
                        borderColor: !!formik.touched?.description && !!formik.errors?.description ? "#d32f2f" : ""
                    }}
                    {...formik.getFieldProps("description")}
                />
                <Box flexDirection="row" display="flex" justifyContent="right">
                    <Tooltip title="Сохранить">
                        <IconButton
                            aria-label="done"
                            size="small"
                            // onClick={() => setEditMode(true)}
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
                            onClick={() => setEditMode(false)}
                        >
                            <CloseIcon sx={{fontSize: "15px"}}/>
                        </IconButton>
                    </Tooltip>
                </Box>
            </form>
        );
    }

    return (
        <Typography variant="body2" align={"justify"} display="inline">
            {currentValue}
            <Tooltip title="Редактировать">
                <IconButton
                    aria-label="edit"
                    size="small"
                    onClick={() => setEditMode(true)}
                    sx={{opacity: "0.6", "&:hover": {opacity: "1"}, "&:focus": {outline: "none"}}}
                >
                    <EditIcon sx={{fontSize: "15px"}}/>
                </IconButton>
            </Tooltip>

            {/*TODO: add delete action*/}
            <Tooltip title="Удалить">
                <IconButton
                    aria-label="delete"
                    color="error"

                    size="small"
                    // onClick={() => setEditMode(true)}
                    sx={{opacity: "0.4", "&:hover": {opacity: "0.7"}, "&:focus": {outline: "none"}}}
                >
                    <DeleteForeverOutlinedIcon sx={{fontSize: "18px"}}/>
                </IconButton>
            </Tooltip>
        </Typography>
    );
};

export default EditableText;