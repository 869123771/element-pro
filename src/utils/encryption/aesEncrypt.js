import CryptoJS from 'crypto-js/crypto-js'

// AES加密 ：字符串 key iv  返回base64

export const aesEncrypt = (str, keyStr, ivStr) => {
    let key = CryptoJS.enc.Utf8.parse(keyStr)
    let iv = CryptoJS.enc.Utf8.parse(ivStr)

    if (keyStr && ivStr) {
        key = CryptoJS.enc.Utf8.parse(keyStr);
        iv = CryptoJS.enc.Utf8.parse(ivStr);
    }
    let srcs = CryptoJS.enc.Utf8.parse(str);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,                // mode 与后台一致
        padding: CryptoJS.pad.ZeroPadding,
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}



// AES 解密 ：字符串 key iv  返回base64

export function aesDecrypt(str, keyStr, ivStr) {
    let key = CryptoJS.enc.Utf8.parse(keyStr)
    let iv = CryptoJS.enc.Utf8.parse(ivStr)

    if (keyStr && ivStr) {
        key = CryptoJS.enc.Utf8.parse(keyStr);
        iv = CryptoJS.enc.Utf8.parse(ivStr);
    }

    let base64 = CryptoJS.enc.Base64.parse(str);
    let src = CryptoJS.enc.Base64.stringify(base64);

    let decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        // mode: CryptoJS.mode.ECB,
        mode: CryptoJS.mode.BCB, // 保持一致
        padding: CryptoJS.pad.Pkcs7
    });

    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}