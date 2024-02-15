import React, { FunctionComponent, ChangeEvent, useState } from 'react'

interface FileInputProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function FileInput({
    onChange,

}: FileInputProps) {
    const [fileName, setFileName] = useState<string>('No file selected')
    return (
        <>
            <button  >Choose file</button>
            <input
                type="file"
                // id={id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!e.target.files) return
                    setFileName(e.target.files[0].name)
                    onChange(e)
                }}
                accept="image/*"
            />
            <div id="file-chosen">{fileName}</div>
        </>
    )
}

