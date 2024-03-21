import React from "react";
import store from "store";

import { MDViewer } from "@/components/markdown";



const Article: React.FC = () => {
    const text = store.get('mdTest')

    return (
        <div>
            {/* <MDEditor value={text} /> */}
            <MDViewer value={text} />
        </div>
    )
}

export default Article