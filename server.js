// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require('fs');


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static(__dirname + "/public"));
app.use(express.static("public"));

// reservation (DATA)
// =============================================================
const notes = require("./db/db.json");
const { response } = require("express");
// const { fstat } = require("fs");
// console.log("notes = ", notes);

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Displays Notes
app.get("/api/notes", function(req, res) {
    // console.log(res);
    return res.json(notes);
});

// Save a note
app.post("/api/notes", function(req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    //add a unique ID to note - use date/time/seconds from previous project.
    var note = req.body;

    var tdate = new Date();
    var strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = tdate.getDate();
    var m = strArray[tdate.getMonth()];
    var y = tdate.getFullYear();
    var h = tdate.getHours();
    var mi = tdate.getMinutes();
    var s = tdate.getSeconds();

    // console.log("month = ", tdate.getMonth());
    // console.log("month letters = ", m);

    currdate = '' + (d <= 9 ? '0' + d : d) + '-' + m + '-' + y + "_" + h + ":" + mi + ":" + s;
    // console.log(currdate);
    note.id = currdate;
    notes.push(note);
    // console.log("note = ", note);
    // console.log("notes = ", notes);
    // console.log("type of notes = ", typeof notes);
    fs.writeFile("./db/db.json", JSON.stringify(notes), err => {
        // Checking for errors 
        if (err) throw err;
        console.log("Done writing"); // Success
    })

});


app.delete("/api/notes/:id", function(req, res) {
    console.log("In app.delete...");
    // console.log("id in app.delete = ", req);
    console.log("req.params.id = ", req.params.id);
    console.log("notes = ", notes);

    // $.each(notes, function(i) {
    //     if (notes[i].id === req.params.id) {
    //         notes.splice(i, 1);
    //         return false;
    //     }
    // });

    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === req.params.id) {
            notes.splice(i, 1);
            return false;
        }
    };

    res.send(req.params.id)
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});