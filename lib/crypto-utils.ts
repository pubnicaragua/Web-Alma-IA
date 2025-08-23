import CryptoJS from 'crypto-js';

// Clave de cifrado - debe estar en variables de entorno  
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key-cambiar-para-prod';

export const encryptData = (data: string): string => {
    try {
        return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
        console.error('Error encrypting data:', error);
        return data;
    }
};

export const decryptData = (encryptedData: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Error decrypting data:', error);
        return encryptedData;
    }
};