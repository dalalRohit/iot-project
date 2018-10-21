const functions = require('firebase-functions');
const express=require('express');
const app=express();
const hbs=require('hbs');
const firebase=require('firebase-admin');
const axios=require('axios');
const path=require('path');

const firebaseApp=firebase.initializeApp(
    functions.config().firebase
);



app.set('views','./views');
app.set('view engine','hbs');

app.use((req, res, next) =>  {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  
app.use('/js',express.static(path.join(__dirname,'./js/')));

app.get('/',(req,res) => {
    res.set('Cache-Control','public','max-age=300','s-maxage=600');
    res.render('index');
});

app.post('/iot',function (req,res) {
    let url=req.body.url;
    console.log(url);

    let data=new Object();

    axios.get(url).then( (response) => {
        let urlRes=response.data;

        data.timezone=urlRes.timezone;
        data.temp=urlRes.currently.temperature;
        data.desc=urlRes.hourly.summary;
    
        res.send(data);
    });


})
exports.app = functions.https.onRequest(app);
