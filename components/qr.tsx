import React, {
    useEffect,
    useState,
    Dispatch,
    SetStateAction,
    useContext,
} from 'react'
import FileInput from './fileInput.jsx'
import { uploadQRpng } from './uploadPng.js'


export default function Qr(
) {
    const [qrData, setQrData] = useState<string | null>(null)
    const [provingEnabled, setProvingEnabled] = useState<boolean>(false)


    return (
        <div >



            <div>
                <div>
                    <label>Upload your Aadhaar secure QR Code: </label>
                    <FileInput
                        onChange={async e => {


                            const { qrValue } = await uploadQRpng(e)
                            setQrData(qrValue)
                        }}

                    />
                </div>


            </div>




        </div>
    )
}

