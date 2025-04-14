import React from 'react';
import {useParams} from "react-router";

import {Box, IconButton, Paper, Tooltip, Typography} from "@mui/material";

import PageTitle from "../components/PageTitle";
import {Routes} from "./router";
import {Head} from "../components/Head";
import BackLink from "../components/BackLink";
import SideBlock from "../components/SideBlock";
import GlosaryItem from "../components/GlosaryItem";
import {getLecture} from "../domain/api";
import {useQuery} from "react-query";
import EmptyPage from "./EmptyPage";
import CircularProgress from "@mui/material/CircularProgress";
import {Link} from "react-router-dom";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AddGlosaryItemForm from "../components/AddGlosaryItemForm";
import {config} from "../config/config";
import {styled} from "@mui/material/styles";

interface TextChunk {
    id: string;
    from: number;
    to: number;
    order: number;
    content: string;
}

const TextChunk = styled(Box)(({theme}) => ({
    cursor: 'pointer',
    transition: 'all 0.5s',
    "&:hover": {
        color: theme.palette.primary.main,
    },
}));

const LecturePage: React.FC = () => {
    const [hasAddForm, setHasAddForm] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState<number>(0);

    const {id = ""} = useParams();

    const audioRef = React.useRef<any>();

    const {data: lecture, isLoading, error} = useQuery(id, () => getLecture(id), {refetchInterval: 1000});

    setInterval(() => {
        setCurrentTime(audioRef?.current?.currentTime);
    }, 5000);

    const text = React.useMemo<string>(() => {
        const onTextClick = (chunk: TextChunk): void => {
            if (audioRef?.current?.currentTime !== undefined) {
                audioRef.current.currentTime = chunk.from;
                setCurrentTime(audioRef?.current?.currentTime);
            }
        }

        /* return lecture?.textChunks?.reduce((acc: string, t: { content: string }) => acc + t.content, "");*/
        return lecture?.textChunks?.map((chunk: TextChunk) => (
                <TextChunk
                    component="span"
                    key={chunk.id}
                    onClick={() => onTextClick(chunk)}
                    sx={{ backgroundColor: chunk.to < currentTime ? 'grey.300' : 'transparent' }}
                >
                    {chunk.content}
                </TextChunk>
            )
        );
    }, [lecture?.textChunks, currentTime]);

    if (isLoading) {
        return (
            <EmptyPage>
                <CircularProgress color="primary"/>
            </EmptyPage>
        )
    }

    if (error) {
        return (
            <EmptyPage text="Ой! Произошла ошибка с данной лекцией">
                <Link to={Routes.ROOT}>Перейти на главную страницу</Link>
            </EmptyPage>
        )
    }

    const data = lecture;

    // DATA NOT FROM API ! ! !
    const glosary = lecture.glossary;

    return (
        <>
            <Head title={`Лекция "${data.lectureName}"`}/>
            <Box sx={{display: 'flex'}}>
                <SideBlock
                    anchor="left"
                >
                    <PageTitle>
                        Содержание:
                    </PageTitle>
                  {data.summarizedDescription}
                </SideBlock>
                <Box component="main" sx={{flexGrow: 1}}>
                    <BackLink to={Routes.ROOT}>
                        назад к лекциям
                    </BackLink>

                    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px">
                        <PageTitle>
                            {data.lectureName}
                        </PageTitle>
                        <audio
                            src={`${config.apiUrl}/${lecture?.file?.path}`}
                            controls
                            ref={audioRef}
                        />
                    </Box>

                    <Paper
                        sx={{p: 8, minHeight: "200px", display: "flex"}} variant="outlined"
                    >
                        {
                            text?.length > 0
                                ? <Typography paragraph align="justify" m={0}>
                                    {text}
                                </Typography>
                                : <Box sx={{ alignSelf: "center", margin: "0 auto" }}>
                                    <CircularProgress size="30px" />
                                </Box>

                        }
                    </Paper>
                </Box>
                <SideBlock
                    anchor="right"
                >
                    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                        <PageTitle>
                            Глоссарий:
                        </PageTitle>
                        <Tooltip title="Добавить">
                            <IconButton
                                aria-label="add"
                                color="primary"
                                size="small"
                                onClick={() => setHasAddForm(true)}
                                sx={{border: "1px solid", "&:focus": {outline: "none"}}}
                            >
                                <AddOutlinedIcon fontSize="medium"/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    { hasAddForm ? (
                        <AddGlosaryItemForm onClose={() => setHasAddForm(false)} glosaryId={glosary.id}/>
                    ) : null}

                    {
                        glosary?.items?.map((item: any) => (
                            <GlosaryItem
                                key={`term-${item.id}`}
                                term={item.term}
                                meaning={item.meaning}
                                id={glosary.id}
                                termId={item.id}
                            />
                        ))
                    }
                </SideBlock>
            </Box>
        </>
    );
};

export default LecturePage;