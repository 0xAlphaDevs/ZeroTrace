import React, { FunctionComponent, ChangeEvent, useState } from 'react';

interface FileInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function FileInput({ onChange }: FileInputProps) {
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('No file selected');

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
    <div>
      <div className="flex items-center justify-center space-x-4 mt-8">
        <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg tracking-wide uppercase border border-blue hover:bg-blue-600 cursor-pointer hover:shadow-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-qr-code"
          >
            <rect width="5" height="5" x="3" y="3" rx="1" />
            <rect width="5" height="5" x="16" y="3" rx="1" />
            <rect width="5" height="5" x="3" y="16" rx="1" />
            <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
            <path d="M21 21v.01" />
            <path d="M12 7v3a2 2 0 0 1-2 2H7" />
            <path d="M3 12h.01" />
            <path d="M12 3h.01" />
            <path d="M12 16v.01" />
            <path d="M16 12h1" />
            <path d="M21 12v.01" />
            <path d="M12 21v-1" />
          </svg>
          <span className="ml-2 text-base leading-normal">Select your QR code</span>
          <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>
      </div>
      {fileData && (
        <div>
          <img
            src={fileData}
            alt="Uploaded file"
            style={{ maxWidth: '100%', maxHeight: '300px', margin: 'auto', display: 'block' }}
          />
        </div>
      )}
    </div>
  );
}
