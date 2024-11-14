export const getAverageScore = ({score, totalPossible}:{score:number, totalPossible:number}) => {
    if(score<=0){
        return 0
    }
    return score/totalPossible*100
} 