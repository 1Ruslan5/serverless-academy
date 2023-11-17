import axios from "axios"

export const checkValidUserLink = async (linkToCheck: string) => {
    try {
        const result = await axios.get(linkToCheck);
        if (result.status === 200) {
            return true
        }
        return false
    } catch (err) {
        console.log(err);
        return false
    }
}