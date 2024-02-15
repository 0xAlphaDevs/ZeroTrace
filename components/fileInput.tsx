import React, { FunctionComponent, ChangeEvent, useState } from 'react'

interface FileInputProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function FileInput({
    onChange,

}: FileInputProps) {

    const [fileData, setFileData] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('No file selected')


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const fileDataURL = reader.result as string;
            setFileData(fileDataURL);
            setFileName(selectedFile.name);
        };
        reader.readAsDataURL(selectedFile);
        onChange(e);
    };

    return (
        <>
            <button  >Choose file</button>
            <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
            />
            {fileData && (
                <div >
                    <img src={fileData} alt="Uploaded file" style={{ maxWidth: '100%', maxHeight: '200px', paddingLeft: '45px' }} />
                </div>
            )}

        </>
    )
}

