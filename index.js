require("dotenv").config()
const https= require("https");
var cors = require('cors');
const fs= require("fs");
const path= require("path");
const express= require("express");
const app= express();
const mongoos=require("mongoose");
const { crypto, randomBytes } =require('crypto');

process.env.TZ = "Asia/Calcutta";
mongoos.set("strictQuery", false);
mongoos.connect(process.env.DATABASE_URL)
const db= mongoos.connection
db.on('error',(error)=> console.error(error))
db.once('open',()=> console.log('Connected to Database!'))


app.use(express.json())
app.use(cors());

const userRouter= require("./routes/user_auth")
const addressRouter= require("./routes/address")
const ordersRouter= require("./routes/order_services")
const notificationRouter= require("./routes/notifications")
const transactionRouter= require("./routes/transaction")
const deviceRouter= require("./routes/devices")
const queryRouter= require("./routes/query")
const devicePaymentsRouter= require("./routes/devicePayments")
const invoiceRouter= require("./routes/invoice")
const companyConstRouter= require("./routes/consts")
const railwayRouter= require("./routes/railwayTest")

app.use("/api/user",userRouter)
app.use("/api/address",addressRouter)
app.use("/api/orders",ordersRouter)
app.use("/api/notification",notificationRouter)
app.use("/api/transaction",transactionRouter)
app.use("/api/devices",deviceRouter)
app.use("/api/query",queryRouter)
app.use("/api/devicePayments",devicePaymentsRouter)
app.use("/api/invoice",invoiceRouter)
app.use("/api/consts",companyConstRouter)
app.use("/api/railwaytest",railwayRouter)

app.listen(6622,()=>{
    console.log("Http Server is listning!")
})