const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRouter = require('./routers/admin');
const userRouter = require('./routers/user');
const incidentRouter = require('./routers/incident');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json())

app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/incident', incidentRouter);

app.use('/', (req, res) => {
    res.send('Welcome to Incident Management API');
});

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(port, console.log(`Server Listenning on Port ${port}`));
});