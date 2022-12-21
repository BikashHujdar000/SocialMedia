const express = require("express")
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const helmet = require("helmet");
const morgan = require("morgan");
const userRoutes= require("./routes/users")
const userAuth = require("./routes/auth")


dotenv.config();


mongoose.connect("mongodb+srv://bikash:bikash@socailapp.itqisqn.mongodb.net/bikashdev?retryWrites=true&w=majority"
    , { useNewUrlParser: true, useUnifiedTopology: true }, () =>
(
    console.log("connection Sucessfull in Mongodb")
)
)

// middleware

app.use(express.json());
app.use(morgan("common"));
app.use(helmet());

app.use("/api/users",userRoutes)
app.use("/api/auths",userAuth)

app.get ("/",(req,res)=>
{
    res.send("This is Social media app")
})




app.listen(3000, () => {
    console.log("listening at port 3000")
})