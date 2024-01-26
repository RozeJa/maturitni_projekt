import './PeopleInput.css'
import People from "../../../models/People"
import SelectInput from "../../SelectInput"

// TODO předělat people input ať jako první bere jméno. (poslední slovo je příjmení ostatní spoj do jména)
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

        const surname = value.trim().split(' ')[1]
        const name = value.trim().split(' ')[0]

        let newSelected: People | undefined = peoples.find(p => p.surname === surname);
        if (newSelected === undefined) {
            newSelected = peoples.find(p => p.surname === surname);
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
        <div className="people-input">
            <SelectInput options={peoples.map((p:People) => p.name + " " + p.surname)} onChange={(e: any) => handleChange(e) } initValue={(selected.name + " " + selected.surname).trim()} autoFocus={selected.surname !== ''} />
        </div>
    )
}


export default PeopleInput