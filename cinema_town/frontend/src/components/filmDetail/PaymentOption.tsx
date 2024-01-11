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
                const { checked } = e.target

                // TODO podmínka
                if (checked) {
                    setPayment(payment)
                } else {
                    setPayment(<></>)
                }
                
            }} />
            <label>{label}</label>
            {/** //TODO vytvořit složku a nahrát do ní obrázek/y */}
            <img src={require(`../../assets/imgs/payment-options/${imgUrl}`)} alt="" />
        </div>
    )
}

export default PaymentOption