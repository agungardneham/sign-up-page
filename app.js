require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
    console.log(res.statusCode);
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;

    let data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }
        ]
    }

    let dataJSON = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/" + process.env.AUDIENCE_ID;
    const options = {
        method: "POST",
        auth: "d13nim:" + process.env.API_KEY
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else{
            res.send(__dirname + "/failure.html");
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(dataJSON);
    request.end();
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running ....");
})

