import { daysInWeek, daysInWeekShort } from '../../global_functions/constantsAndFunction';
import './DaySelection.css'
import React, { useEffect, useState } from 'react';

const defWeeks : React.ReactElement[] = []
const DaySelection = ({
        sections
    } : {
        sections: { [key: number]: string }
    }) => {

    const [selectedDate, setSelectedDate] = useState(new Date().getDate() -1)
    const [staredSections, setStoredSections] = useState(sections)

    const [firstWeek, setFirstWeek] = useState([...defWeeks])
    const [secondWeek, setSecondWeek] = useState([...defWeeks])

    useEffect(() => {
        setStoredSections(sections)
    }, [sections])

    useEffect(() => {
        const date = new Date()

        const first: React.ReactElement[] = []
        const dateDay: number = date.getDate()
        first.push(
            <div key={date.getDate()} className={selectClasses(date)}>
                <a href={staredSections[date.getDate()]} onClick={() => {setSelectedDate(dateDay)}}>Dnes</a>
            </div>
        )
        
        date.setDate(date.getDate() + 1)

        
        const temp: number = date.getDate()
        first.push(
            <div key={date.getDate()} className={selectClasses(date)}>
                <a href={staredSections[date.getDate()]} onClick={() => {setSelectedDate(temp)}}>Zítra</a>
            </div>
        )
        
        date.setDate(date.getDate() + 1)

        for (let i = 0; i < 5; i++) {
            const dateDay = date.getDate()
            first.push(
                <div key={date.getDate()} className={selectClasses(date)}>
                    <a href={staredSections[date.getDate()]} onClick={() => {setSelectedDate(dateDay)}}>{daysInWeekShort[date.getDay()]}</a>
                </div>
            )
            date.setDate(date.getDate() + 1)
        }

        const second: React.ReactElement[] = []
        for (let i = 0; i < 7; i++) {
            const dateDay = date.getDate()
            second.push(
                <div key={date.getDate()} className={selectClasses(date)}>
                    <a href={staredSections[date.getDate()]} onClick={() => {setSelectedDate(dateDay)}}>{daysInWeekShort[date.getDay()]}</a>
                </div>
            )
            date.setDate(date.getDate() + 1)
        }

        setFirstWeek(first)
        setSecondWeek(second)

    }, [staredSections, selectedDate])

    const selectClasses = (date: Date): string => {

        const selected = date.getDate() === selectedDate ? 'selected' : ''
        const inactive = staredSections[date.getDate()] === undefined ? 'inactice' : ''
        return `${selected} ${inactive}`
    }

    return (
        <div className='day-selection'>
            <div>
                {firstWeek}
            </div>
            <div>
                {secondWeek}
            </div>
        </div>
    )
}

export default DaySelection 