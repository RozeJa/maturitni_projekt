import { AxiosError } from "axios"
import DialogErr from "../components/DialogErr"

export const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
export const pwRegex = new RegExp(/^.*(?=.[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{12,}).*$/)
export const daysInWeekShort = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So']
export const daysInWeek = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota']
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

export const formatDateTime = (date: string[] | Date): string => {
    let dateToShow: string = ''

    if (date instanceof Date) {
        dateToShow = `${date.getMonth()+1}. ${date.getDate()}. ${date.getHours()}:${date.getMinutes()}`

    } else {
        if (Array.isArray(date)) {
            let hour = parseInt(date[3]) + 1
            dateToShow = `${date[1]}. ${date[2]}. ${hour.toString().padStart(2, "0")}:${date[4].toString().padStart(2, "0")}`
        }
    }

    return dateToShow
}

export const handleErr = (setErr: Function, err: AxiosError, redirect: boolean = false) => {
    
    console.log(err);
    

    const status = err.request.status

    switch (status) {
        case 400:
            setErr(<DialogErr err='Chybný požadavek' description={"Zkontroujte data, která posíláte a zkuste to znovu."} dialogSetter={setErr} okText={redirect ? <a href='/management/'>Ok</a> : "Ok"} />)
            break;
        case 401:
            setErr(<DialogErr err='Tuto akci nemůžete provést nepřihlášeni.' description={""} dialogSetter={setErr} okText={redirect ? <a href='/management/'>Ok</a> : "Ok"} />)
            break;
        case 403:
            setErr(<DialogErr err='Na provedení této akce nemáte dostatečná oprávnění' description={""} dialogSetter={setErr} okText={redirect ? <a href='/management/'>Ok</a> : "Ok"} />)
            break;
        case 404:
            setErr(<DialogErr err='Záznam neexistuje nebo ho není možné odebrat.' description={"Je možné, že na datech, která se snažíte odebrat jsou závislá další data."} dialogSetter={setErr} okText={redirect ? <a href='/management/'>Ok</a> : "Ok"} />)
            break;
    
        default:
            setErr(<DialogErr err='Neočekávaná chyba servru' description={"Obraťte se na podporu"} dialogSetter={setErr} okText={redirect ? <a href='/management/'>Ok</a> : "Ok"} />)
            break;
    }
}

export const handleErrRedirect = (setErr: Function, err: AxiosError) => {
    handleErr(setErr, err, true);
}

export const callbackOnEnter = (event: any, callBack: Function) => {
    const { key } = event
    console.log(event.key);
    
    if (key === "Enter") {
        callBack()
    }
}