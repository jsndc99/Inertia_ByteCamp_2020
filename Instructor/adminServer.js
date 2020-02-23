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

        var str = 'SELECT COUNT (DISTINCT name) FROM persons;'
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

app.get("/getDashboardData/<name>", async (req, res) => {
   
    var output_list = [];
    var time_list = [];

    var client = new Client({
        connectionString: conString,
    })

    try {
        await client.connect()
        console.log("Connected successfully.")

        var str = 'SELECT output,timestamp from maindata where name = $1 limit 10'
        var values = [req.params.name]
        var rows = await client.query(str,values)
        // console.log(rows.rows)
        maindata = rows.rows
        maindata.forEach(data => {
            output_list.push(data.output);
            time_list.push(data.timestamp);
        });

        my_json = {
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



//a=[1,2,3]
//var max = Math.max.apply(null, a);
//a.indexOf(max)