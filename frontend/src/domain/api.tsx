import axios from "axios";
import { request, gql } from "graphql-request";

import { config } from '../config/config';

export type UploadFilePayload = {
  name: string;
  file: any;
};

export type GlossaryItemPayload = {
  id: string;
  term: string;
  meaning: string;
  termId?: string;
};

export async function uploadFile(payload: UploadFilePayload) {
  const form = new FormData();
  form.append("file", payload.file);
  form.append("name", payload.name);

  const response = await axios.post(`${config.apiUrl}/inventory/lecture`, form, {
    headers: {
      'Content-Type': `multipart/form-data;`,
    },
  });

  console.log(response);

  await axios.post(`${config.apiUrl}/analyse/lecture/${response.data.id}`, {}, {
    headers: {
      'Content-Type': `application/json`,
    },
  });

  return response;
}


const LecturesQuery = gql`
    query getLectures {
        lectures(size: 1000) {
            id
            lectureName
            createdAt
            summarizedDescription
            file {
                id
                originalName
                path
            }
            glossary {
                id
                createdAt
                items {
                    id
                    term
                    meaning
                }
            }
            textChunks{
                id
                #                from
                #                to
                content
            }
        }
    }
`;

export async function getLectures() {
  const response = await request<{ lectures: any }>(`${config.apiUrl}/graphql`, LecturesQuery, {});
  return response.lectures
}

const LectureQuery = gql`
    query getLectures($id: String!) {
        lecture(id: $id) {
            id
            lectureName
            summarizedDescription
            file {
                id
                originalName
                path
            }
            glossary {
                id
                createdAt
                items {
                    id
                    term
                    meaning
                }
            }
            textChunks{
                id
                from
                to
                content
            }
        }
    }
`;

export async function getLecture(id: string) {
  const response = await request<{ lecture: any }>(`${config.apiUrl}/graphql`, LectureQuery, {
    "id": id
  });

  return response.lecture;
}

export async function addGlossaryItem(payload: GlossaryItemPayload) {
  return await axios.post(`${config.apiUrl}/glossary/${payload.id}/item`, {
    meaning: payload.meaning,
    term: payload.term,
  }, {
    headers: {
      'Content-Type': `application/json;`,
    },
  });
}

export async function editGlossaryItem(payload: GlossaryItemPayload) {
  return await axios.put(`${config.apiUrl}/glossary/${payload.id}/item/${payload.termId}`, {
    term: payload.term, meaning: payload.meaning
  }, {
    headers: {
      'Content-Type': `multipart/form-data;`,
    },
  });
}