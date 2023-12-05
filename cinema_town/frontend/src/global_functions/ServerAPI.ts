import axios, { AxiosRequestConfig } from 'axios';
import Cinema from '../models/Cinema';
import City from '../models/City';
import Film from '../models/Film';
import Genre from '../models/Genre';
import Hall from '../models/Hall';
import People from '../models/People';
import Permission from '../models/Permission';
import Projection from '../models/Projection';
import Reservation from '../models/Reservation';
import Role from '../models/Role';
import Seat from '../models/Seat';
import User from '../models/User';
import { TokenDeviceId } from '../models/TokenDeviceId';
import { getSessionStorageItem } from './storagesActions';

// url na server 
const BASE_URL = 'http://localhost:8080/'

// povolený typ pro dotazy na rest api
export type ApiData = Cinema | City | Film | Genre | Hall | People | Permission | Projection | Reservation | Role | Seat | User

// výčtový typ mapovaný na endpointy 
export enum ModesEndpoints {
    Cinama =  "api/cinemas/",
    City = "api/cities/",
    Film = "api/films/",
    FilmBlockBuster = "api/films/block-busters",
    Genre = "api/genres/",
    Hall = "api/halls/",
    HallsUnremovable = "api/halls/unremovable/",
    People = "api/people/",
    Permission = "api/permissions/",
    Projection = "api/projections/",
    Reservation = "api/reservations/",
    Role = "api/roles/",
    Seat = "api/seats/",
    User = "api/users/"
}


// funkce pro načtení dat z api
export const loadData = async <T extends ApiData>(modelEndpoint: ModesEndpoints, ids: Array<string> = []): Promise<T[]> => {
    let data: T[] = []

    // načti si config
    const config = await getRequestConfig()

    if (ids.length > 0) {
        // pokud se jedná o sérii id, načti si postupně data
        for (let i = 0; i < ids.length; i++) {
            data.push((await axios.get<T>(BASE_URL + modelEndpoint + `${ids[i]}`, config)).data);
        }
    } else {
        // jinak načti všechna data
        data = (await axios.get<T[]>(BASE_URL + modelEndpoint, config)).data
    }

    return data
}

// funkce pro uložení dat na server
export const storeData = async <T extends ApiData>(modelEntpoint: ModesEndpoints, data: T[]): Promise<ApiData[]> => {
    let reseavedData: ApiData[] = []

    let config = await getRequestConfig()
    
    if (config.headers !== undefined)
        config.headers["Content-Type"] = "application/json"

    for (let i = 0; i < data.length; i++) {
     
        const url = BASE_URL + modelEntpoint

        // TODO zkontrolovat zda podmínka funguje
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
export const deleteData = async <T extends ApiData>(modelEntpoint: ModesEndpoints, data: T[]): Promise<T[]> => {
    for (let i = 0; i < data.length; i++) {
     
        // načti si config
        const config = await getRequestConfig()

        await (axios.delete<T>(BASE_URL + modelEntpoint + `${data[i].id}`, config))
    }

    return data
}

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

        throw error
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

export const login = async (email: string, password: string, deviceId: string): Promise<string|null> => {
    try {

        const headers = {
            "Content-Type": "application/json",
            "deviceID": deviceId
        }
        const config = {
            headers: headers
        }
        const user = {
            email: email,
            password: password,
            role: {}
        }        
      
        const res = (await axios.post(BASE_URL + "auth/login", user, config))

        if (res.status === 200) {
            return res.data
        } else {
            return null
        }
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

