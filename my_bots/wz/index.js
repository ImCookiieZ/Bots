import API from "call-of-duty-api";

const intervall = ()=> {
    API.login(process.env.SSO)
    // setTimeout(intervall, 5000)
}
intervall()
export const getWZStats = async (gamertag, platform) => {
    try {
        console.log(gamertag, platform)
        let dataAll = await API.Warzone.fullData(gamertag, platform ? platform : API.platforms.Activision)
        console.log(dataAll)
        let weekly = dataAll.data.weekly.all.properties
        let alltime = dataAll.data.lifetime.mode.br.properties
        console.log(weekly)
        var out = ["user not found or private"]
        if (dataAll.status === 'success') {
            out = []
            out.push(`${gamertag} is level ${dataAll.data.level}. He has ${alltime.wins} wins.`)
            out.push(`Lifetime: He has a ${Math.round((alltime.kdRatio + Number.EPSILON) * 1000) / 1000}KD with ${alltime.kills} kills in ${alltime.gamesPlayed} matches`)
            out.push(`Weekly: ${gamertag} has a ${Math.round((weekly.kdRatio + Number.EPSILON) * 1000) / 1000} KD and ${Math.round((weekly.killsPerGame + Number.EPSILON) * 1000) / 1000} kills/game in ${weekly.matchesPlayed} matches with a HeadshotRate of ${Math.round((weekly.headshotPercentage + Number.EPSILON) * 100000) / 1000}%`)
        }
        return out
     } catch(err) {
        console.log(err)
        return [`user for ${gamertag} not found`]
     }
}
