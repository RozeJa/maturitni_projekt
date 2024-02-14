import './DeviceTrust.css'

const DeviceTrust = ({
        setTrustedDevice,
        setTDForm,
        setActivated
    }:{
        setTrustedDevice: (trust: boolean) => void,
        setTDForm: () => void,
        setActivated: () => void
    }) => {
    return (
        <div className='device-trust-form'>
            <h2>Chcete důvěřovat tomuto zařízení</h2>

            <div className="device-trust-confirm">
                <button onClick={() =>{
                    setTrustedDevice(false)
                    setTDForm()
                    setActivated()
                }}>Nedůvěřovat</button>  
                <button onClick={() => {
                    setTrustedDevice(true) 
                    setTDForm()     
                    setActivated() 
                }}>Důvěřovat</button>
            </div>
        </div>
    )
}

export default DeviceTrust