import { useEffect, useState } from 'react'
import SmartInput from '../../SmartInput'
import './VisaPayment.css'
import PaymentInformations from './PaymentInformations'

const VisaPayment = ({
    setPaymentInformations,
    paymentInformations
}:{
    setPaymentInformations: Function,
    paymentInformations: PaymentInformations
}) => {

    const [data, setData] = useState({...paymentInformations})

    useEffect(() => {                
        setPaymentInformations({...data})
    }, [data])
    
    const registerPrePostFunction = async () => {
        const Stripe = require('stripe');
        const stripe = await Stripe("pk_test_51OYl1pGYcwjrKZZTUzabFaNopHJDRbTosxWe0JuLr7GSIlptNEzv1UES29xs6Lveh8YmoJeqXGHJfw3KjL3p3RMi00CiEVhlB2");

        const prePostFunction = async (paymentData: { [key:string]: string }) => {

            const splitedExpiration = paymentData["card-expiration"].split(/[0-9]{2}/)

            let month = splitedExpiration[0]
            let year = "20" + splitedExpiration[1]

            if (month.startsWith("0")) {
                month = month.substring(1)
            }

            const token = await stripe.tokens.create({
                card: {
                  number: paymentData["card-number"],
                  exp_month: month,
                  exp_year: year,
                  cvc: paymentData["verification-code"], 
                },
              })

            delete paymentData["card-expiration"]
            delete paymentData["card-number"]
            delete paymentData["verification-code"]
            paymentData["token"] = token
        }

        data["prePostFunction"] = prePostFunction
        setData({ ...data });
    }

    if (data["paymentData"]["type"] !== "visa") {
        data["paymentData"]["type"] = "visa"

        registerPrePostFunction()

        setData({ ...data })
    }

    const showCardNumber = (cardNumber: string|undefined):string => {
        if (cardNumber === undefined) 
            return ''
        
        const arr = cardNumber.split(/([0-9]{4})/).filter(number => number !== '')
        return arr.join(" ")
    } 

    const showCardExpiration = (cardExpiration: string|undefined):string => {
        if (cardExpiration === undefined) 
            return ''
        
        const arr = cardExpiration.split(/([0-9]{2})/).filter(number => number !== '')
        return arr.join("/")
    }

    const validateData = (data: { [key:string]: string }): boolean => {
        const number = data['card-number']?.length === 16
        const expiration = data['card-expiration']?.length === 4
        const verification = data['verification-code']?.length === 3 || data['verification-code']?.length === 4       

        return number && expiration && verification
    }

    const handleChange = (e:any) => {
        const { name, value } = e.target

        const newValue = value.replaceAll(" ", "").replaceAll("/", "")

        if (name === 'card-number' && newValue.length > 16) {
            return
        }

        if (name === 'card-expiration' && newValue.length > 4) {
            return
        }

        if (name === 'verification-code' && newValue.length > 4) {
            return
        }

        const paymentData = { ...data["paymentData"], [name]: newValue, ["valid"]: validateData({...data["paymentData"], [name]: newValue}).toString()}
        
        setData({...data, ["paymentData"]: paymentData})
    }

    return (
        <div className='visa-payment'>
            <SmartInput label='Číslo kreditní karty'>
                <input 
                    type="text" 
                    name='card-number' 
                    value={showCardNumber(data["paymentData"]["card-number"])} 
                    onChange={handleChange}  />
            </SmartInput>
            <SmartInput label='Platnost karty'>
                <input 
                    type="text" 
                    name='card-expiration' 
                    value={showCardExpiration(data["paymentData"]["card-expiration"])} 
                    onChange={handleChange} />
            </SmartInput>
            <SmartInput label='CVV2/CVC2'>
                <input 
                    type="text" 
                    name='verification-code' 
                    value={data["paymentData"]["verification-code"]} 
                        onChange={handleChange} />
            </SmartInput>
        </div>
    )
}

export default VisaPayment