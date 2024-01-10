import { ReactElement } from 'react';
import './PaymentOption.css'

const PaymentOption = ({
        setPayment,
        payment,
        imgUrl,
        label
    }:{
        setPayment: Function,
        payment: ReactElement,
        imgUrl: string,
        label: string
    }) => {
    return (
        <div className='payment-option'>
            <input type="radio" name='payment' onChange={(e:any) => {
                console.log(e.target);

                // TODO podmínka
                if (false) {
                    setPayment(payment)
                } else {
                    setPayment(<></>)
                }
                
            }} />
            <label>{label}</label>
            {/** //TODO vytvořit složku a nahrát do ní obrázek/y 
            <img src={require(`../../assets/imgs/${imgUrl}`)} alt="" />*/}
        </div>
    )
}

export default PaymentOption