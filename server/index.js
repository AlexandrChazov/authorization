require("dotenv").config();
const express = require("express");
const cors = require("cors");                         // чтобы не было проблем с корсами при отправке запросов из браузера
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router/index.js");
const errorMiddleware = require("./middlewares/error-middleware")

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());  // для того, чтобы при ответе с сервера мы могли присылать cookie
app.use(cors({
  credentials: true,               // разрешаем cookie
  origin: process.env.CLIENT_URL    // url фронтенда
}));
app.use("/api", router);
app.use(errorMiddleware);    // миддлвэйр ошибок всегда ставится последним

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    app.listen(PORT, () => {
      console.log(`Server started at PORT = ${PORT}`)
    })
  } catch(e) {
    console.log(e)
  }
}

startServer()
