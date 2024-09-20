import { format } from "date-fns"


export const studentYear = [{
    label: "1st Year",
    value: "FIRST"
}, {
    label: "2nd Year",
    value: "SECOND"
}, {
    label: "3rd Year",
    value: "THIRD"
}, {
    label: "4th Year",
    value: "FOURTH"
}, {
    label: "5th Year",
    value: "FIFTH"
}]

export const semesters = [{
    label: "1st Sem",
    value: "FIRST"
}, {
    label: "2nd Sem",
    value: "SECOND"
}]

export const yearNow = Number(format(new Date(), "yyyy"))

export const schoolYear = (startYear=2023) => {
    const availableYears = []

    for(startYear; startYear<=yearNow+1; startYear ++){
        availableYears.push({
            label : `${startYear}-${startYear+1}`,
            value : `${startYear}-${startYear+1}`
        })
    }

    return availableYears
}