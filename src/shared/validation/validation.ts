import Exception from "../utils/error.utility";

export const date_validation = (body: any, keys: string[]) => {
    let invalid_keys: string[] = []
    for (let i = 0; i < keys.length; i++) {
        let element = body[keys[i]];
        if (!isNaN(Date.parse(body[keys[i]]))) body[keys[i]] = new Date(element)
        else invalid_keys.push(keys[i])
    }
    
    if (invalid_keys.length) throw Exception.setError(`${invalid_keys} is not valid`, true)
}