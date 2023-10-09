import readTokenProperty from "./readTokenProperty";

const verifyAccess = (permissionRequired: string): boolean => {

    // pokud je permissionRequired prázdný string funkce vrací zda je uživatel přihlášený
    if (permissionRequired === "") {
        return sessionStorage.getItem("loginToken") !== null
    }
    
    // otestuj, zda uživatel má požadovaný oprávnění 
    const permissions = readTokenProperty("permissions") 
    if (permissions !== undefined) {
        for (let i = 0; i < permissions.length; i++) {
            if (permissions[i] === permissionRequired) 
                return true
        }
    }

    return false
}

export default verifyAccess