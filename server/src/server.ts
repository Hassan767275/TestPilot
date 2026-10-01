import 'dotenv/config'
import express from "express"

const app = express()

const PORT = process.env.PORT

app.get("/", (req, res) => {
    console.log("got the request from frontend")
})

app.listen(PORT, () => { console.log(`Server is listening on port ${PORT}`)})