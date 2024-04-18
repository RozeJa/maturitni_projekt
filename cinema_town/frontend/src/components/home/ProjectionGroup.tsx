import Projection from '../../models/Projection'
import './ProjectionGroup.css'
import ProjectionComponent from '../../components/home/Projection';
import { daysInWeek } from '../../global_functions/constantsAndFunction';

const ProjectionGroup = ({
        projections,
        month,
        day,
        selectedCinemaId
    }:{
        projections: Projection[][],
        month: number,
        day: number,
        selectedCinemaId: string | null
    }) => {


    const date = new Date()
    date.setMonth(month-1);
    date.setDate(day);    

    return (
        <div id={day.toLocaleString().padStart(2, "0")} className='projection-group'>
            <h2>{daysInWeek[date.getDay()]} {day}.{month} <div></div></h2>
            {
                projections.sort((a,b) => a[0].film.name.localeCompare(b[0].film.name))
                .map((ps, index) => {
                    return <ProjectionComponent key={index} projections={ps} i={index} selectedCinemaId={selectedCinemaId} />
                })
            }
        </div>
    )
}

export default ProjectionGroup