export const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
export const pwRegex = new RegExp(/^.*(?=.[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{12,}).*$/)
export const formatDate = (date: Date | string[]): string => {
    
    let year
    let month 
    let day 
    if (date instanceof Date) {
        year = date.getFullYear()
        month = (date.getMonth() + 1).toString().padStart(2, '0')
        day = date.getDate().toString().padStart(2, '0')
    } else {
        const objData = new Date(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))
        year = objData.getFullYear()
        month = (objData.getMonth()).toString().padStart(2, '0')
        day = objData.getDate().toString().padStart(2, '0')
    }
        
    return `${year}-${month}-${day}`;
}