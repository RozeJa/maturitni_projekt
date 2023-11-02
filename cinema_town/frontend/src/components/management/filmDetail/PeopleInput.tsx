import { on } from "events"
import People from "../../../models/People"
import SelectInput from "../../SelectInput"

const PeopleInput = (
    {
        peoples,
        onChange,
        selected
    } : {
        peoples: People[],
        onChange: Function,
        selected: People
    }) => {

    const handleChange = (e: any) => {
        const { value } = e.target

        const surname = value.trim().split(' ')[0]
        const name = value.trim().split(' ')[1]

        let newSelected: People | undefined = peoples.find(p => p.surname === surname);
        if (newSelected === undefined) {
            newSelected = peoples.find(p => p.surname === name);
        }

        if (newSelected !== undefined) {
            onChange(newSelected)
        } else {
            selected.surname = surname === undefined ? '' : surname.charAt(0).toUpperCase() + surname.slice(1)
            selected.name = name === undefined ? '' : name.charAt(0).toUpperCase() + name.slice(1)
            onChange({ ...selected })
        }
    } 
        
    return (
        <div key={selected.id === null ? `${selected.surname} ${selected.name}` : selected.id}> 
            <SelectInput options={peoples.map((p:People) => p.surname + p.name)} onChange={(e: any) => handleChange(e) } initValue={(`${selected.surname} ${selected.name}`).trim()} autoFocus={selected.surname !== ''} />
        </div>
    )
}


export default PeopleInput