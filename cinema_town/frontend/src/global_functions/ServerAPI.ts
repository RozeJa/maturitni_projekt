import axios, { AxiosRequestConfig } from 'axios';
import Film from '../models/Film';
import User from '../models/User';
import { TokenDeviceId } from '../models/TokenDeviceId';
import { getSessionStorageItem } from './storagesActions';
import Entity from '../models/Entity';
import logout from './logout';

// url na server 
const BASE_URL = window.location.hostname === "localhost" ? 'http://localhost:8080/' : 'https://api.mp.home-lab.rozekja.fun/'


// výčtový typ mapovaný na endpointy 
export enum ModesEndpoints {
    AgeCategory = "api/age_categories/",    
    Cinama = "api/cinemas/",
    CinamaByHall = "api/cinemas/by_hall/",
    City = "api/cities/",
    Film = "api/films/",
    FilmBlockBuster = "api/films/block-busters",
    Genre = "api/genres/",
    Hall = "api/halls/",
    HallsUnremovable = "api/halls/unremovable/",
    People = "api/people/",
    Permission = "api/permissions/",
    Projection = "api/projections/",
    ProjectionByFilm = "api/projections/by/film/",
    ProjectionArchived = "api/projections/archived",
    Reservation = "api/reservations/",
    ReservationReservate = "api/reservations/reservate",
    ReservationCensured = "api/reservations/censured/",
    Role = "api/roles/",
    Seat = "api/seats/",
    User = "api/users/"
}


// funkce pro načtení dat z api
export const loadData = async <T extends Entity>(modelEndpoint: ModesEndpoints, ids: Array<string> = []): Promise<T[]> => {
    let data: T[] = []

    // načti si config
    const config = await getRequestConfig()

    if (ids.length > 0) {
        // pokud se jedná o sérii id, načti si postupně data
        for (let i = 0; i < ids.length; i++) {
            let temp = (await axios.get<T|T[]>(BASE_URL + modelEndpoint + `${ids[i]}`, config)).data;
            
            if (Array.isArray(temp)) {
                data = [...data, ...temp]
            } else {
                data.push(temp)
            }
        }
    } else {
        // jinak načti všechna data
        data = (await axios.get<T[]>(BASE_URL + modelEndpoint, config)).data
    }

    return data
}

// funkce pro uložení dat na server
export const storeData = async <T extends Entity>(modelEntpoint: ModesEndpoints, data: T[]): Promise<Entity[]> => {
    let reseavedData: Entity[] = []

    let config = await getRequestConfig()
    
    if (config.headers !== undefined)
        config.headers["Content-Type"] = "application/json"

    for (let i = 0; i < data.length; i++) {
     
        const url = BASE_URL + modelEntpoint

        if (data[i].id === undefined || data[i].id === null) {
            // pokud ukládáš film, tak odstraň vlastnost "file" a importuj její obsah na server
            if (modelEntpoint === ModesEndpoints.Film) {

                reseavedData.push(await handleFilm(url, data[i], config))
            } else {
                // pokud je id undefinited vytváříš záznam
                reseavedData.push((await (axios.post<T>(url, data[i], config))).data) 
            }
        } else {
            // pokud ukládáš film, tak odstraň vlastnost "file" a importuj její obsah na server
            if (modelEntpoint === ModesEndpoints.Film) {
                reseavedData.push(await handleFilm(url, data[i], config))
            } else {
                // pokud id není undefinited záznam edituješ
                reseavedData.push((await (axios.put<T>(url + `${data[i].id}`, data[i], config))).data) 
            }
        }
    }

    return reseavedData
}

const handleFilm = async (url:string, film: any, config: AxiosRequestConfig<any>): Promise<Film> => {
    
    if (film["file"] !== null) {
        // připrav tělo dotazu, pro poslání obrázku na server
        const formData = new FormData();
        formData.append('file', film["file"]);
        formData.append('picture', film.picture);

        // z filmu smaž prop file
        delete film["file"]

        let data
        // ulož film
        if (film.id === null) {
            data = (await (axios.post<Film>(url, film, config))).data
        } else {
            data = (await (axios.put<Film>(url + film.id, film, config))).data
        }
        
        // použi jeho id k doplnění dotazu
        formData.append('film', data.id ? data.id : 'errr');

        // získej si token
        const accessToken = await getAccessToken()
        
        // proveď dotaz
        fetch(BASE_URL + ModesEndpoints.Film + 'store-img', {
            method: 'POST',
            headers: {
                "authorization": accessToken !== null ? accessToken : ''
            },
            body: formData
        })
                
        // navrať film
        return data;
    } else {
        // navrať film
        if (film.id === null) {
            return (await (axios.post<Film>(url, film, config))).data
        } else {
            return (await (axios.put<Film>(url + film.id, film, config))).data
        }
        
    }
}

// funkce pro odstranění dat
export const deleteData = async <T extends Entity>(modelEntpoint: ModesEndpoints, data: T[]): Promise<T[]> => {
    for (let i = 0; i < data.length; i++) {
     
        // načti si config
        const config = await getRequestConfig()

        await (axios.delete<T>(BASE_URL + modelEntpoint + `${data[i].id}`, config))
    }

    return data
}

// funkce pro registraci 
export const register = async (user: User): Promise<boolean> => {
    try {
        return (await axios.post(BASE_URL + "auth/register", user)).status === 200
    } catch (error) {
        throw error
    }
}

export const reactivateCode = async (email: string) => {
    try {

        const headers = {
            "Content-Type": "application/json"
        }

        const config = {
            headers: headers
        }

        const user = {
            email: email,
            password: "",
            role: {}
        }

        const status = (await axios.post(BASE_URL + "auth/reset-activation-code", user, config)).status

        console.log(status)

    } catch (error) {
        // TODO dej vedet, ze se nezdarilo
    }
}

export const activateAccount = async (code: string): Promise<string> => {
    try {        
        return (await axios.post<string>(BASE_URL + "auth/activate-account", code)).data
    } catch (error) {
        throw error
    }
}

export const secondVerify = async (code: string): Promise<TokenDeviceId> => {
    try {
        return (await axios.post<TokenDeviceId>(BASE_URL + "auth/second-verify", code)).data
    } catch (error) {
        throw error
    }
}

export const login = async (email: string, password: string, trustToken: string): Promise<TokenDeviceId|null> => {
    try {

        const headers = {
            "Content-Type": "application/json",
            "trust-token": trustToken
        }
        const config = {
            headers: headers
        }
        const user = {
            email: email,
            password: password,
            role: {}
        }        
      
        const res = (await axios.post<TokenDeviceId>(BASE_URL + "auth/login", user, config))

        if (res.status === 200) {  
            console.log(res.data);
                      
            return res.data
        } else {            
            return null
        }
    } catch (error) {
        throw error
    }
}

// funkce pro změnu hesla 
export const changePw = async (user: User): Promise<boolean> => {
    try {

        const headers = {
            "Content-Type": "application/json",
            "authorization": getSessionStorageItem("loginToken")
        }
        const config = {
            headers: headers
        }
      
        const res = (await axios.post(BASE_URL + "auth/change-pw", user, config))

        return res.status === 200
    } catch (error) {
        throw error
    }
}

export const resetPwRequest = async (user: User): Promise<boolean> => {
    try {

        const headers = {
            "Content-Type": "application/json"
        }
        const config = {
            headers: headers
        }
      
        const res = (await axios.post(BASE_URL + "auth/forgotten-password/reset-code", user, config))

        return res.status === 200
    } catch (error) {
        throw error
    }
}

export const resetPw = async (user: User): Promise<TokenDeviceId> => {
    try {

        const headers = {
            "Content-Type": "application/json"
        }
        const config = {
            headers: headers
        }
      
        const res = (await axios.post<TokenDeviceId>(BASE_URL + "auth/forgotten_password/", user, config))

        return res.data
    } catch (error) {
        throw error
    }
}

// funkce získá přístupový token
async function getAccessToken(): Promise<string> {

    const loginToken = getSessionStorageItem("loginToken")

    const headers = {
        "authorization": loginToken
    }

    const config = {
        headers: headers
    }

    try {
        let accessToken: string = (await axios.get<string>(BASE_URL + "auth/token", config)).data

        return accessToken         
    } catch (error) {
        logout()
        return ""
    }

}

// metoda vytvoří config objekt pro request na api
async function getRequestConfig(): Promise<AxiosRequestConfig> {
    
    const accessToken = await getAccessToken()

    let headers = {
        "authorization": accessToken,
    }

    let config = {
        headers: headers
    }

    return config
}   

