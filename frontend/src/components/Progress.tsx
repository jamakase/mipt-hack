import React from 'react';
import {Box,} from "@mui/material";
import {styled} from "@mui/material/styles";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

type StatusType = "in_progress" | "failed" | "success" | "pending";
type ProgressProps = {
    items: {
        s2t: StatusType,
        terms: StatusType,
        summ: StatusType,
        llm: StatusType,
        finished: StatusType,
    }
};

const Dot = styled("div")(() => ({
    height: "3px",
    width: "3px",
    margin: "0 3px",
    background: "rgba(0, 0, 0, 0.15)",
    borderRadius: "50%",
}));

const Name = styled("div")(() => ({
    position: "absolute",
    top: "-60%",
    color: "rgba(0, 0, 0, 0.3)",
    fontSize: "11px",
}));

const Item = styled("div")((props: { status: StatusType }) => ({
    position: "relative",
    margin: "0 3px",
    height: "25px",
    width: "25px",
    borderRadius: "50%",
    border: props.status === "success" || props.status === "failed" ? "1px solid rgba(0, 0, 0, 0)" : "1px solid rgba(0, 0, 0, 0.3)",
    background:
        props.status === "success"
            ? "#ecf6e4"
            : props.status === "failed"
                ? "#feedee" : "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color:
        props.status === "success"
            ? "#6eb63e"
            : props.status === "failed"
                ? "#f74e67"
                : props.status === "pending"
                    ? "#a8afbb" : "#7653FF",
}));

const Connection = styled("div")(() => ({
    position: "absolute",
    height: "calc(100% + 17px)",
    width: "157px",
    right: "52px",
    top: "-10px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "10px"

}));

const Progress: React.FC<ProgressProps> = ({items}) => {
    const data: {type: "s2t" | "terms" | "summ" | "llm" | "finished", title: string}[] = [
        {
            type: "s2t",
            title: "s2t"
        },
        {
            type: "terms",
            title: "Terms"
        },
        {
            type: "summ",
            title: "Summ"
        },
        {
            type: "llm",
            title: "LLM"
        },
        {
            type: "finished",
            title: "Finished"
        },
    ]
    return (
        <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            pt={1}
            justifyContent="end"
            position="relative"
        >
            <Connection />
            {
                data.map((currentItem, key) => {
                    const currentStatus = items[currentItem.type];
                    return (
                        <>
                            <Item status={currentStatus}>
                                <Name>{currentItem.title}</Name>
                                {
                                    // @ts-ignore
                                    currentStatus === "success"
                                        ? <DoneIcon sx={{fontSize: "15px"}}/>
                                        : currentStatus === "failed"
                                            ? <CloseIcon sx={{fontSize: "15px"}}/>
                                            : currentStatus === "in_progress"
                                                ? <CircularProgress color="primary" size="15px"/>
                                                : null
                                }
                            </Item>
                            {
                                key === (data.length - 1)
                                    ? null
                                    : <><Dot/><Dot/><Dot/></>
                            }
                        </>
                    )
                })
            }
        </Box>
    );
};

export default Progress;