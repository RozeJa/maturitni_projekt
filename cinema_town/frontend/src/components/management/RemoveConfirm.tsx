import './RemoveConfirm.css'

const RemoveConfirm = ({
        close,
        callBack,
        message
    }: {
        close: () => void,
        callBack: () => void,
        message?: string
    }) => {
    return (
        <div className="remove-confirm">
            <div className='remove-confirm-dialog'>
                <p>{message === undefined ? 'Opravdu si přejete tato data odebrat?' : message}</p>
                <div>
                    <button onClick={() => close()}>Ne</button>
                    <button onClick={() => {
                        callBack()
                        close()
                    }}>Ano</button>
                </div>
            </div>
        </div>
    )
}

export default RemoveConfirm