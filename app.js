require('dotenv').config();
require('./models');
const sequelize = require('./config/database');

const express = require('express');
const app = express();
const PORT = process.env.PORT;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



sequelize.sync({ alter : true }) 
  .then(() => {
    console.log('All models were synchronized.');
  })
  .catch(err => {
    console.error('Sync failed:', err);
  });

app.listen( PORT ,()=>{console.log("server started on port : "+PORT)});