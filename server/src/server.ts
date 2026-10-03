import 'dotenv/config'
import express from "express"

const app = express()

const PORT = process.env.PORT

app.use(express.json())

app.get("/", (req, res) => {
    console.log("got the request from frontend")
    return res.status(200).json({ message: "request recieved" })
})

app.post("/api/tests", (req, res) => {
    const { url } = req.body
    console.log(url)

    if ( !url || url.trim() === "") {
        return res.status(400).json({ message: "A URL is required."})
    }

    return res.status(200).json({ message: "url receieved"})
})

app.listen(PORT, () => { console.log(`Server is listening on port ${PORT}`)})