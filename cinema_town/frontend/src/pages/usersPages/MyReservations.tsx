import { useEffect, useState } from 'react'
import './MyReservations.css'
import User, { defaultUser } from '../../models/User'
import Reservation from '../../models/Reservation'
import { ModesEndpoints, loadData, storeData } from '../../global_functions/ServerAPI'
import { handleErr } from '../../global_functions/constantsAndFunction'
import Filter from '../../components/management/Filter'
import ReservationGroup from '../../components/myReservations/ReservationGroup'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

type ReservationGroup = { 
    [key: string] : Reservation[]
}

const defUser: User = defaultUser
const defReservations: Reservation[] = []

const defGrouped: ReservationGroup = {}

const MyReservations = () => {

    const [err, setErr] = useState(<></>)

    const [user, setUser] = useState({...defUser})
    const [reservations, setReservations] = useState([...defReservations])

    const [fsReservations, setFsReservations] = useState([...defReservations])
    const [groupedReservations, setGroupedReservations] = useState({...defGrouped})

    const navigate = useNavigate()

    const { userId } = useParams<string>()

    useEffect(() => {

        loadData<User>(ModesEndpoints.User, [userId !== undefined ? userId : ''])
            .then(data => setUser(data[0]))
            .catch(err => handleErr(setErr, err))
        loadData<Reservation>(ModesEndpoints.Reservation)
            .then(data => setReservations(data))
            .catch(err => {})
    }, [])

    useEffect(() => {
        setFsReservations([...reservations])
    }, [reservations])

    useEffect(() => {
        const newGroups: ReservationGroup = {}
        // získej uniqu datumi
        const dates = new Set<string>()

        fsReservations.forEach(r => {
            let date = ''
            if (!(r.projection.dateTime instanceof Date)) {
                date = r.projection.dateTime.slice(0,3).join(" ")
                dates.add(date)
            }
        })

        dates.forEach(date => {
            const dateReservations = fsReservations.filter(r => {
                if (!(r.projection.dateTime instanceof Date)) 
                    return r.projection.dateTime.slice(0,3).join(" ") === date
                return false
            })

            newGroups[date] = dateReservations
        })

        setGroupedReservations({...newGroups})
    }, [fsReservations])

    const filter = (e:any) => {
        const { value } = e.target
        const patern = value.toLowerCase()

        const newData = reservations.filter(r => {
                let date = ''
                let time = ''

                if (!(r.projection.dateTime instanceof Date)) {
                    date = `${r.projection.dateTime[2]}.${r.projection.dateTime[1]}.${r.projection.dateTime[0]}`
                    time = `${r.projection.dateTime[3]}:${r.projection.dateTime[4]}`
                }

                console.log(date);
                console.log(time);
                

                return (
                    r.projection.film.name.toLowerCase() === patern ||
                    r.projection.film.name.toLowerCase().split(patern).length > 1 ||
                    date === patern ||
                    date.split(patern).length > 1 ||
                    time === patern ||
                    time.split(patern).length > 1
                )
            })      

        setFsReservations([...newData])
    }

    return (
        <div className='my-reservations'>
            {err}
            <div className="my-reservations-header">
                <div className="my-reservations-header-left">
                    <h1>Ahoj, {user.email}</h1>
                    <h2>Odběratel: {user.subscriber ? "Ano" : "Ne"}</h2>
                </div>
                <div className="my-reservations-header-right">
                    <button onClick={() => {
                        navigate("/pw-change")
                    }}>
                        Změnit heslo
                    </button>
                    <button onClick={() => {
                        const newUser = user
                        newUser.subscriber = !user.subscriber

                        storeData<User>(ModesEndpoints.User, [newUser])
                        .then(data => setUser({...newUser}))
                        .catch(err => console.log(err))
                    }}>
                        {user.subscriber ? "Odhlásit se od odběru" : "Přihlásit se k odběru"}
                    </button>
                </div>
            </div>
            <div className="my-reservations-reservations">
                <div className="my-reservations-reservations-header">
                    <Filter filter={filter} />
                </div>
                <div className="my-reservations-reservations-body">
                    {
                        Object.keys(groupedReservations)
                            .sort((a,b) => {
                            
                                let bSplited = b.split(" ")                                
                                let aSplited = a.split(" ")
                                
                                let bDate: string = bSplited[0].toString() + bSplited[1].padStart(2, "0") + bSplited[2].padStart(2, "0")
                                let aDate: string = aSplited[0].toString() + aSplited[1].padStart(2, "0") + aSplited[2].padStart(2, "0")
                                
                                return bDate.localeCompare(aDate)
                            })
                            .map((key, index) => {
                                return <ReservationGroup 
                                    key={index}
                                    date={key}
                                    reservations={groupedReservations[key]}
                                    setFsReservations={(rmReservation: Reservation) => setFsReservations([...fsReservations.filter(r => r.id !== rmReservation.id)])}
                                    />
                            })
                    }
                </div>
            </div>
        </div>
    )
}

export default MyReservations