import express from "express";

const app = express();
const port = 3000;

app.get('/sls-team/json-1', (req, res)=>{
    res.json({
        Inrem: "gjklfdj",
        isDone: true
    });
})

app.get('/sls-team/json-2', (req, res)=>{
    res.json({
        Inrem: "gjklfdj",
    
        inrema: {
            inrema: {
                inrema: {
                    inrema: {
                        isDone:false
                    }
                }
            }
        },
    })
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})