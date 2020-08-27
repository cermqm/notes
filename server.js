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

// Note (DATA)
// =============================================================
const notes = require("./db/db.json");
const { response } = require("express");
const { fileURLToPath } = require("url");

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
    return res.json(notes);
});

// Save a note
app.post("/api/notes", function(req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    var note = req.body;

    // Creating a unique id for the note - using date/time including seconds.
    var tdate = new Date();
    var strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = tdate.getDate();
    var m = strArray[tdate.getMonth()];
    var y = tdate.getFullYear();
    var h = tdate.getHours();
    var mi = tdate.getMinutes();
    var s = tdate.getSeconds();

    currdate = '' + (d <= 9 ? '0' + d : d) + '-' + m + '-' + y + "_" + h + ":" + mi + ":" + s;

    // Adding date to the note object
    note.id = currdate;

    //pushing the new notes object into the notes array.
    notes.push(note);

    // Writing notes array of objects to the db.json file.
    fs.writeFile("./db/db.json", JSON.stringify(notes), err => {
        // Checking for errors 
        if (err) throw err;
    })
    res.send(req.params.id)
    return (notes);
});

// Delete a note
app.delete("/api/notes/:id", function(req, res) {

    // Run through the notes array and delete the object with an id that matches the id we are looking for.
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === req.params.id) {
            notes.splice(i, 1);
        }
    };

    // Write updated notes array to the db.json file.
    fs.writeFile("./db/db.json", JSON.stringify(notes), err => {
        // Checking for errors 
        if (err) throw err;
        console.log("Done writing"); // Success
    })

    res.send(req.params.id)
    return (notes);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});