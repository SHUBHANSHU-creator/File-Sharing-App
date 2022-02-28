require('dotenv').config();
const express=require('express')
const mongoose=require('mongoose')
const app = express()

app.set('view engine', 'ejs');

const PORT=process.env.PORT|| 3000;

app.use(express.static('public'))

const connectDB=()=>{
    mongoose.connect(process.env.MONGO_CONNECTION_URL).then(()=>{
        console.log('connection successful');
    })
    .catch((err)=> console.log('connection failed'));
    
    const connection=mongoose.connection;
    
        connection.on('err',err=>{
            console.log(`DB connection error:'$(err.message)`);
        })

};

connectDB();

//Routes

app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'))



app.get('/',function(req,res){
    res.render('home')
})

app.listen(PORT,function(){
    console.log(`Listening on port ${PORT}`);
})