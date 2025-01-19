export const getAverageScore = ({score, totalPossible, is_transmuted}:{score:number, totalPossible:number, is_transmuted?:boolean}) => {
    if(!!is_transmuted){
        const totalScore = score/totalPossible
        return (totalScore * 50) + 50
    }
    if(score<=0){
        return 0
    }
    return score/totalPossible*100
} 