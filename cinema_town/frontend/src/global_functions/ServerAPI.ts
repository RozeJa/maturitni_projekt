// url na server 
const BASE_URL = 'http://localhost:8080/'

// výčtový typ mapovaný na endpointy 
export enum ModesEndpoints {
    Cinama =  "cinemas",
    City = "cities",
    Film = "films",
    Genre = "genres",
    Hall = "halls",
    People = "people",
    Permission = "permissions",
    Projection = "projections",
    Reservation = "reservations",
    Role = "roles",
    Seat = "seats",
    User = "users"
}


// funkce pro 
export async function loadData<T>(model: ModesEndpoints, ids: string[], type: T): Promise<T> {
    
}