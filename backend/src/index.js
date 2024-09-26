import express from 'express';
import './db/mongoose.js'; // This will execute the file (assuming it connects to the database)
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js"
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// api
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
