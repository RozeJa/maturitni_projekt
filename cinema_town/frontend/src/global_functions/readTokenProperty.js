import jwt_decode from "jwt-decode"

const readTokenProperty = (propertyName) => {
    const token = sessionStorage.getItem("loginToken")

    if (token !== null) {
        const decodedToken = jwt_decode(token)

        return decodedToken[propertyName]
    }
    return undefined
} 

export default readTokenProperty