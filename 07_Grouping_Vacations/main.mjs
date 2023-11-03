import { readFileSync, writeFileSync } from "fs";

const jsonArray = JSON.parse(readFileSync('C:/serverless-academy/07_Grouping_Vacations/data.json', 'utf-8'))
                        .sort(((a,b) => a.user._id.localeCompare(b.user._id)));
const rebuildJSONArray = [transformJSON(jsonArray[0])]

for(let i = 1; i < jsonArray.length; i++){
    const rebuildJSON = rebuildJSONArray[rebuildJSONArray.length-1];
    if(jsonArray[i].user._id === rebuildJSON.userId){
        rebuildJSONArray[rebuildJSONArray.length-1] = addVacation(rebuildJSON , jsonArray[i]);
    }else{
        rebuildJSONArray.push(transformJSON(jsonArray[i]));
    }
}

writeFileSync('C:/serverless-academy/07_Grouping_Vacations/sortedJSON.json', JSON.stringify(rebuildJSONArray, null, 2))

function addVacation(transformJSON, json){
    const { startDate, endDate } = json;
    transformJSON.vacations.push({startDate, endDate})
    return transformJSON
}

function transformJSON(json){
    const { user: { _id, name }, startDate, endDate } = json;
    return {
        userId: _id,
        userName: name,
        vacations: [
            {
                startDate,
                endDate
            }
        ]
    }
}