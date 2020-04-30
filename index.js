let { db, sse, update } = require('./db')
let express = require('express');
let cors = require('cors');

const app = express();


app.use(express.json());
app.use(cors());

app.use(express.static('public'))

//Routes

const vacuumsRoute = require('./routes/vacuums')

/* CODE YOUR API HERE */


//Auth middleware, check api keys
app.use((req, res, next)=>{
    
    //kika i headers, finns key där och att den matchar db, om ja: next, om nej rep status 500
    
    if(req.url ==='/' || req.url==='/init' || req.url ==='/stream'){ //alla req utom till frontend ska leta efter nyckel
        
        next();
        
        
        
    }
    else{
        
        let key = req.headers['authorization'];
        
        let dbKeys = db.get('keys').value();
        console.log(dbKeys);
        
        if(dbKeys.includes(key)){ //om medksickad nyckel finns i db
            
            next(); //fortsätt
            
        }else{
            res.status(500).send({msg: 'No api for you!'}) //ingen nyckel finns
        }
    }
    
})

//remote(postman, men vi ska koda ihop en fjärrkontroll)>API>db>update()>frontend
app.use('/vacuums', vacuumsRoute)


/* CODE YOUR API HERE */

app.get('/init', (req, res) => {
    let devices = db.get('devices').value();
    res.send(JSON.stringify({ devices: devices }));
})

app.get('/stream', sse.init);

app.listen(3000, () => {
    console.log('API for smart home 1.0 up n running.')
})