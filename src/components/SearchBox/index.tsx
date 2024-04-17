import React from "react";
import classnames from 'classnames'
import { SearchOutlined } from "@ant-design/icons";

import styles from './index.module.less'



const SearchBox: React.FC<{
    className?: string
    placeholder?: string
    onChange?: (val: string) => void
    onSearch?: (val: string) => void
}> = ({className, placeholder, onChange, onSearch}) => {
    const keydown = (e: React.KeyboardEvent) => {
        if(e.key === 'Enter') {
            onSearch && onSearch((e.target as any).value)
        }
    }
    const change = (e: any) => {
        onChange && onChange(e.target.value)
    }
    return (
        <div className={classnames(styles.box, className)}>
            <input type="text" className={styles.input} placeholder={placeholder} onChange={change} onKeyDown={keydown} />
            <div className={styles.after}>
                <SearchOutlined className={styles.icon} />
            </div>
        </div>
    )
}

export default SearchBox