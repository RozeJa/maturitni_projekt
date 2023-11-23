import './Tile.css'
import { ReactElement } from 'react'

const Tile = ({
        header,
        key,
        onClick,
        actions,
        children,
    } : {
        header: string,
        key: string,
        onClick: Function,
        actions: ReactElement,
        children: ReactElement
    }) => {

    return <div key={key} className='tile'>
            <div className='tile-header'>
                <h2 onClick={() => onClick()} >{header}</h2>
                <div className="tile-actions">{actions}</div>
            </div>
            <div className="tile-body" onClick={() => onClick()}>
                {children}
            </div>
        </div>
}

export default Tile