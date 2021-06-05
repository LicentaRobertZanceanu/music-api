import express from 'express';
import dotenv from 'dotenv';
import { routes } from './routes.js';
import cors from 'cors';
import mongoose from 'mongoose';
import { ytUrlCron } from './yturl-cron.js';
import cron from 'node-cron'
import AWS from 'aws-sdk'

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

export const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    // CreateBucketConfiguration: {
    //     // Set your region here
    //     LocationConstraint: "us-east-1"
    // }
}

s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data);
})

const mongodbUri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.h3y2c.mongodb.net/main_DB?retryWrites=true&w=majority`;
mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => console.log('Connected to MongoDB!'))

app.listen(port, () => {
    // ytUrlCron();
    routes(app);
    console.log(`server is running on port ${port}`)
})