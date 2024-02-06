import { useEffect, useState } from 'react'
import './MyReservation.css'
import User, { defaultUser } from '../../models/User'
import Reservation from '../../models/Reservation'
import { ModesEndpoints, loadData } from '../../global_functions/ServerAPI'
import { handleErr } from '../../global_functions/constantsAndFunction'
import Filter from '../../components/management/Filter'
import ReservationGroup from '../../components/myReservations/ReservationGroup'
import { getSessionStorageItem } from '../../global_functions/storagesActions'
import readTokenProperty from '../../global_functions/readTokenProperty'
import { useParams } from 'react-router-dom'

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

    const { userId } = useParams<string>()

    useEffect(() => {

        loadData<User>(ModesEndpoints.User, [userId !== undefined ? userId : ''])
            .then(data => setUser(data[0]))
            .catch(err => handleErr(setErr, err))
        loadData<Reservation>(ModesEndpoints.Reservation)
            .then(data => setReservations(data))
            .catch(err => handleErr(setErr, err))
    }, [])

    useEffect(() => {
        const newGroups: ReservationGroup = {}
        // získej uniqu datumi
        const dates = new Set<string>()

        fsReservations.forEach(r => {
            let date = ''
            if (!(r.projection.dateTime instanceof Date)) {
                date = r.projection.dateTime.join(" ")
                dates.add(date)
            }
        })

        dates.forEach(date => {
            const dateReservations = fsReservations.filter(r => {
                if (!(r.projection.dateTime instanceof Date)) 
                    return r.projection.dateTime.join(" ") === date
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
                    date = `${r.projection.dateTime[2]}. ${r.projection.dateTime[1]}. ${r.projection.dateTime[0]}`
                    time = `${r.projection.dateTime[3]}:${r.projection.dateTime[4]}`
                }

                return (
                    r.projection.film.name.toLowerCase() === patern ||
                    r.projection.film.name.toLowerCase().split(patern).length > 1 ||
                    date === patern ||
                    date.split(patern).length > 1 ||
                    time === patern ||
                    time.split(patern).length > 1
                )
            })
            // TODO setřídí podle data konání jednotlivá promítání použít u genetování stránky
            /*.sort((a,b) => {
                let aDate = ''
                let bDate = ''
                if (!(a.projection.dateTime instanceof Date) && !(b.projection.dateTime instanceof Date)) {
                    aDate = a.projection.dateTime.join(" ")
                    bDate = b.projection.dateTime.join(" ")
                }
            
                return aDate.localeCompare(bDate)
                // return bDate.localeCompare(aDate)
            })*/
      

        setFsReservations([...newData])
    }

    return (
        <div className='my-reservations'>
            {err}
            <div className="my-reservations-header">
                
            </div>
            <div className="my-reservations-reservations">
                <div className="my-reservations-reservations-header">
                    <Filter filter={filter} />
                </div>
                <div className="my-reservations-reservations-body">
                    {
                        Object.keys(groupedReservations)
                            .sort((a,b) => {
                            
                                return a.localeCompare(b)
                                // return b.localeCompare(a)
                            })
                            .map((key, index) => {
                                return <ReservationGroup 
                                    key={index}
                                    date={key}
                                    reservations={groupedReservations[key]}
                                    />
                            })
                    }
                </div>
            </div>
        </div>
    )
}

export default MyReservations