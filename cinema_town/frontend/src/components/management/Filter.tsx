import './Filter.css'

const Filter = ({
        filter
    }:{
        filter: Function
    }) => {
    return (
        <div className="filter">
            <label><b>Filtruj</b></label>
            <input type="text" placeholder='Filtruj' onChange={(e:any) => filter(e)} />
        </div>
    )
}

export default Filter