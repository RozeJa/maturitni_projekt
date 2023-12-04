import Projection from '../../models/Projection'
import './ProjectionGroup.css'
import ProjectionComponent from '../../components/home/Projection';
import { daysInWeek } from '../../global_functions/constantsAndFunction';

const ProjectionGroup = ({
        projections,
        day
    }:{
        projections: Projection[],
        day: number
    }) => {


    const date = new Date()
    date.setDate(day);

    return (
        <div id={day.toLocaleString()} className='projection-group'>
            <h2>{daysInWeek[date.getDay()]} {date.getDate()}.{date.getMonth()} <div></div></h2>
            {
                projections.sort((a,b) => a.film.name.localeCompare(b.film.name)).map(p => p.film)
                .map((f, index) => {
                    return <ProjectionComponent key={index} film={f} i={index} />
                })
            }
        </div>
    )
}

export default ProjectionGroup