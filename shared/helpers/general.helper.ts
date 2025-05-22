import {BASE_URL} from "../constants";

export const generateOTP =() => {
    return `${Math.floor(100000 + Math.random() * 900000)}`
}
export const getFileUrl = (file_url) =>  {
    if (file_url != null && file_url != '') {
        if (file_url.startsWith('http')) {
            file_url = file_url;
        } else {
            file_url = BASE_URL + file_url;
        }
    }
    return file_url;
}
export const extractFields = (obj, fields) => {
    const result = {};
    for (const field of fields) {
        if (field in obj) {
            result[field] = obj[field];
        }
    }
    return result;
}
