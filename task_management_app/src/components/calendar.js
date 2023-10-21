import React, { useState } from "react";

function Calendar() {
    const [date, setDate] = useState(new Date());

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const weeks = [];
    let week = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        week.push(null);
    }
    for (let i = 0; i < days.length; i++) {
        week.push(days[i]);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }
    if (week.length > 0) {
        for (let i = week.length; i < 7; i++) {
            week.push(null);
        }
        weeks.push(week);
    }

    const prevMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    };

    return (
        <div>
            <div>
                <button onClick={prevMonth}>Prev</button>
                <span>{monthsOfYear[date.getMonth()]} {date.getFullYear()}</span>
                <button onClick={nextMonth}>Next</button>
            </div>
            <table>
                <thead>
                    <tr>
                        {daysOfWeek.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {weeks.map((week, i) => (
                        <tr key={i}>
                            {week.map((day, j) => (
                                <td key={j}>{day}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Calendar;
