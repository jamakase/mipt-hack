import React from 'react';

import {Box, Typography} from "@mui/material";
import EditableText from "./EditableText";

type GlosaryItemProps = {
    term: string,
    meaning: string,
    id: string,
    termId: string,
}

const GlosaryItem: React.FC<GlosaryItemProps> = ({term, meaning, id, termId }) => (
    <Box mb={2}>
        <Typography variant="subtitle1" fontWeight='fontWeightBold' align={"left"} display="inline-block" pr={1}>
            {term}:
        </Typography>
        <EditableText currentValue={meaning} glosaryId={id} term={term} termId={termId}/>
    </Box>
);

export default GlosaryItem