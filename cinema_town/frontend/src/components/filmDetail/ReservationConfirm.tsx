import { ReactElement, useEffect, useState } from 'react'
import { callbackOnEnter, formatDateTime } from '../../global_functions/constantsAndFunction'
import AgeCategory from '../../models/AgeCategory'
import Cinema from '../../models/Cinema'
import Projection from '../../models/Projection'
import Seat from '../../models/Seat'
import './ReservationConfirm.css'
import PaymentOption from './PaymentOption'
import VisaPayment from './payments/VisaPayment'
import PaymentInformations from './payments/PaymentInformations'
import { ModesEndpoints, storeData } from '../../global_functions/ServerAPI'
import ReservationDTO from '../../models/ReservationDTO'
import { useNavigate } from 'react-router-dom'
import DialogErr from '../DialogErr'
import readTokenProperty from '../../global_functions/readTokenProperty'

const defSeatsRows: Seat[][] = []

const defPaymentInformations: PaymentInformations = {
    prePostFunction: async (paymentData: { [key:string]: string }) => {
        return {}
    },
    paymentData: {}
}

const ReservationConfirm = ({
        setReservationConfirm,
        ageCategories,
        ageCategoriesCount,
        seats,
        projection,
        cinema
    }:{
        setReservationConfirm: Function,
        ageCategories: AgeCategory[],
        ageCategoriesCount: { [key: string]: number},
        seats: Seat[] ,
        projection: Projection,
        cinema: Cinema
    }) => {

    const [seatsRows, setSeatRows] = useState([...defSeatsRows])
    const [quantitiOfTickets, setQuantitiOfTickets] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)

    const [payment, setPayment] = useState(<></>)
    const [paymentInformations, setPaymentInformations] = useState({...defPaymentInformations})

    const [confirmable, setConfirmable] = useState(true)

    const [err, setErr] = useState(<></>)

    const navigate = useNavigate()

    useEffect(() => {
        const seatsRows: Seat[][] = []

        seats.forEach(seat => {                 
            if (seatsRows[seat.rowIndex] === undefined) {
                seatsRows[seat.rowIndex] = [seat]
            } else {
                seatsRows[seat.rowIndex].push(seat)
            }
        })
        
        setSeatRows([...seatsRows])

    }, [seats])

    useEffect(() => {
        let count = 0
        let price = 0

        Object.entries(ageCategoriesCount)
        .filter(acc => acc[1] > 0)
        .forEach((acc) => {
            const ageCategory = ageCategories.find(a => a.id === acc[0])
            const priceModificator: number = ageCategory?.priceModificator !== undefined ? ageCategory.priceModificator : 1
            const costOfOne = Math.round(priceModificator * projection.cost)

            count += acc[1]
            price += costOfOne * acc[1]
        })

        setQuantitiOfTickets(count)
        setTotalPrice(price)
    }, [ageCategoriesCount])

    const handleSubmit = async () => { 
        
        if (!confirmable)
            return

        setConfirmable(false)
        setTimeout(() => setConfirmable(true), 1000) 
        
        if (paymentInformations["paymentData"]["valid"] == "true") {
            const paymentData = await paymentInformations.prePostFunction(paymentInformations.paymentData)
                .catch(err => {
                    setErr(<DialogErr description='Na paywallu Stripe se nepodařilo ověřit vaše platební údaje.' err='Platební údaje nejsou validní' dialogSetter={setErr} okText="Ok"/>)
                    
                    return undefined
                })

            if (paymentData === undefined) 
                return
            
            const reservationDTO: ReservationDTO = {
                id: null,
                agesCategories: ageCategoriesCount,
                paymentData: paymentData,
                projection: projection,
                seats: seats
            }             

            storeData<ReservationDTO>(ModesEndpoints.ReservationReservate, [reservationDTO])
                .then(data => {
                    navigate(`/my-reservation/${readTokenProperty("sub")}`)
                })
                .catch(err => {
                    setErr(<DialogErr description='Platba neproběhla. Rezervace nebyla dokončena.' err='Rezervace se nezdařila' dialogSetter={setErr} okText="Ok"/>)
                })
        }
    }
    
    return (
        <div className='reservation-confirm-dialog'>
            {err}
            <div className="reservation-confirm">
                <div className="reservation-confirm-header">
                    <h1>{projection.film.name} {formatDateTime(projection.dateTime)}</h1>
                    <h2>{`${cinema.city.name}, ${cinema.street}, ${cinema.houseNumber}`} Sál: {projection.hall.designation}</h2>
                </div>
                <h3>Souhrn lístků</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Cenová kategorie</th>
                            <th>Množství</th>
                            <th>Cena za kus</th>
                            <th>Cena celkem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.entries(ageCategoriesCount)
                            .filter(acc => acc[1] > 0)
                            .map((acc, index) => {
                                const ageCategory = ageCategories.find(a => a.id === acc[0])
                                const priceModificator: number = ageCategory?.priceModificator !== undefined ? ageCategory.priceModificator : 1                                
                                const costOfOne = Math.round(priceModificator * projection.cost)

                                return <tr key={index}>
                                    <td>{ageCategory?.name}</td>
                                    <td>{acc[1]}</td>
                                    <td>{costOfOne} Kč</td>
                                    <td>{costOfOne * acc[1]} Kč</td>
                                </tr>
                            })
                        }
                        <tr>
                            <td>Celkem</td>
                            <td>{quantitiOfTickets}</td>
                            <td></td>
                            <td>{totalPrice} Kč</td>
                        </tr>
                    </tbody>
                </table>
                <h3>Souhrn sedadel</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Řada</th>
                            <th>Sedadla</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            seatsRows
                            .filter(row => row !== undefined)
                            .map((row, index) => {
                                return <tr key={index}>
                                    <td>{row.find(v => v!== undefined)?.rowDesignation}.</td>
                                    <td>{row.map(s => s.number).join('. ')}.</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                <div className="reservation-confirm-payment">
                    <h2>Způsob platby</h2>
                    <form>
                        <PaymentOption
                            setPayment={(payload: ReactElement) => setPayment(payload)}
                            payment={
                                <VisaPayment
                                    setPaymentInformations={(data: PaymentInformations) => setPaymentInformations(data)}/>
                                }
                            imgUrl='visa.png'
                            label='Debetní/kreditní karta' />
                    </form>
                    {payment}
                </div>
                {/** TODO přidat souhlas se smluvními podmínkami */}
                <div className="reservation-confirm-btns">
                    <button onClick={() => setReservationConfirm()}>Zpět</button>
                    <button 
                        className={paymentInformations["paymentData"]["valid"] == "true" ? '' : 'reservation-confirm-btns-disable'}
                        onClick={handleSubmit}
                        onKeyDown={(event: any) => callbackOnEnter(event, handleSubmit)}
                        >Zaplatit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReservationConfirm 