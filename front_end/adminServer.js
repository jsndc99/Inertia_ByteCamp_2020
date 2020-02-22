var express = require("express");
const { Client } = require('pg');
var bodyParser = require("body-parser");
const cors = require('cors')
const conString = 'postgres://postgres:Prince@99@localhost/teach.ai'

var app = express();

app.set("view engine", "hbs");

app.use(express.static("views"));
app.set("views", __dirname + "/views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", (req,res) =>{
    res.render("home.hbs")
})


app.get("/getidcount", async (req, res) => {
    var client = new Client({
        connectionString: conString,
    })

    try {
        await client.connect()
        console.log("Connected successfully.")

        var str = 'SELECT COUNT (DISTINCT id) FROM persons;'
        var rows = await client.query(str)
        console.log(rows.rows[0].count)
        var thecount = rows.rows[0].count
        my_json = {
            mycount: thecount
        }
        res.json(my_json)
    }
    catch (ex) {
        console.log(`Something wrong happened here${ex}`)
    }
    finally 
    {
        await client.end();
        console.log("Client disconnected successfully.")  ;  
    }
});

app.get("/getDashboardData/:id", async (req, res) => {
    // console.log(xlData[0]);
    var anger_list = []; 
    var happy_list = [];
    var disgusted_list = [];
    var sleeping_list = [];
    var output_list = [];
    var time_list = [];

    var client = new Client({
        connectionString: conString,
    })

    try {
        await client.connect()
        console.log("Connected successfully.")

        var str = 'SELECT happy,disgusted,angry,sleep,output1,timestamp from maindata where personid = $1 limit 10'
        var values = [req.params.id ]
        var rows = await client.query(str,values)
        // console.log(rows.rows)
        maindata = rows.rows
        maindata.forEach(data => {
            happy_list.push(data.happy);
            disgusted_list.push(data.disgusted);
            anger_list.push(data.angry);
            sleeping_list.push(data.sleep);
            output_list.push(data.output1);
            time_list.push(data.timestamp);
        });

        my_json = {
            happy: happy_list,
            disgusted: disgusted_list,
            angry: anger_list,
            sleep: sleeping_list,
            output: output_list,
            time: time_list
        };
        res.json(my_json);
        
    }
    catch (ex) {
        console.log(`Something wrong happened there${ex}`)
    }
    finally 
    {
        await client.end();
        console.log("Client disconnected successfully.")  ;  
    }
    
});


var port = process.env.PORT || 15000;

app.listen(port, function() {
  console.log("App running on port " + port);
});
