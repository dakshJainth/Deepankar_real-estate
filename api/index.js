import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from "cookie-parser";
import cors from  "cors";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });


const app = express();
app.use(cors())
app.listen(3000, () => {
  console.log("server is running...");
});

app.use(express.json());
app.use(cookieParser())

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use((err, req, res, next)=>{
  const statusCode =err.statusCode || 500;
  const message = err.message || "internal server error";

  return res.status(statusCode).json({
    success:false,
    statusCode,
    message,
  });
});