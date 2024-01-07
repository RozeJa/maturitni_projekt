import Projection from '../../models/Projection'
import './ProjectionGroup.css'
import ProjectionComponent from '../../components/home/Projection';
import { daysInWeek } from '../../global_functions/constantsAndFunction';

const ProjectionGroup = ({
        projections,
        day,
        selectedCinemaId
    }:{
        projections: Projection[][],
        day: number,
        selectedCinemaId: string | null
    }) => {


    const date = new Date()
    date.setDate(day);

    return (
        <div id={day.toLocaleString()} className='projection-group'>
            <h2>{daysInWeek[date.getDay()]} {date.getDate()}.{date.getMonth()+1} <div></div></h2>
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