import { ChangeEvent } from 'react';
import jsQR from 'jsqr';

export function text(emoji: string, text: string) {
  const msp = '\u2003'; // 1em space
  return `${emoji}${msp}${text}`;
}

/**
 * Handle the upload of the pdf, extract the signature and the signed data.
 * @param pdf pdf buffer
 * @returns {Signature, signedData}
 */

export const uploadQRpng = (e: ChangeEvent<HTMLInputElement>): Promise<{ qrValue: string }> => {
  return new Promise((resolve, reject) => {
    if (e.target.files) {
      try {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = e => {
          if (e.target && e.target.result) {
            try {
              const image = new Image();
              image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) throw Error('Image cannot be reconstructed');
                ctx.drawImage(image, 0, 0);
                const imageData = ctx.getImageData(0, 0, image.width, image.height);

                //@ts-ignore
                const qrValue = jsQR(imageData.data, image.width, image.height);
                if (qrValue != null) {
                  // console.log('Result', JSON.parse(qrValue.data));
                  resolve({
                    qrValue: qrValue.data,
                  });
                }
              };
              image.src = e.target.result.toString();
            } catch (error) {
              console.error(error);
              reject(error);
            }
          }
        };
      } catch {
        reject(new Error('No file selected'));
      }
    }
  });
};
