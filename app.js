const express = require('express') ;
const cors = require('cors');
require('dotenv').config();

const authRouters = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());



app.use('/api/user',authRouters);



module.exports=app;