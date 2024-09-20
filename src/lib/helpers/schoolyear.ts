import { format } from "date-fns"


export const studentYear = [{
    label: "All",
    value: "ALL"
},{
    label: "1st",
    value: "FIRST"
}, {
    label: "2nd",
    value: "SECOND"
}, {
    label: "3rd",
    value: "THIRD"
}, {
    label: "4th",
    value: "FOURTH"
}, {
    label: "5th",
    value: "FIFTH"
}]

export const yearNow = Number(format(new Date(), "yyyy"))

export const schoolYear = () => {
    let startYear = 2023
    const availableYears = []

    for(startYear; startYear<=yearNow; startYear ++){
        availableYears.push({
            label : `${startYear}-${startYear+1}`,
            value : `${startYear}-${startYear+1}`
        })
    }

    return availableYears
}