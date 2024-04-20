import { LoaderFunction } from "react-router-dom"

import { getArticleDetail } from "@/api/article"



export const articleDetailLoader: LoaderFunction = ({ params: { id = '' } }) => {
    return getArticleDetail(id)
}