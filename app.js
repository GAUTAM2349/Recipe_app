require('dotenv').config();
require('./models');
const sequelize = require('./config/database');
const cors = require('cors');


const express = require('express');
const { authRouter, userRouter, recipeRouter, followRouter, favoriteRouter, reviewRouter, activityRouter, collectionRouter, adminRouter, passwordRouter } = require('./routes');
const { logIncomingRequests } = require('./middlewares/requests');
const app = express();
const PORT = process.env.PORT;

app.use(logIncomingRequests);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


//routes
app.get( '/', (req,res)=>{res.end("yes working")})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/recipe', recipeRouter);
app.use('/api/follow', followRouter);
app.use('/api/favorite', favoriteRouter);
app.use('/api/review', reviewRouter);
app.use('/api/collection', collectionRouter);
app.use('/api/activity', activityRouter);
app.use('/api/admin', adminRouter);
app.use('/api/activity', activityRouter);
app.use('/api/password', passwordRouter);

sequelize.sync({ alter : true }) 
  .then(() => {
    console.log('All models were synchronized.');
  })
  .catch(err => {
    console.error('Sync failed:', err);
  });

app.listen( PORT ,()=>{ console.log("server started on port : "+ PORT) } );``