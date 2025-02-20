const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views directory is set
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure "hisaab" directory exists before writing a file
if (!fs.existsSync("./hisaab")) {
    fs.mkdirSync("./hisaab");
}

app.post("/createhisaab", function(req, res) { 
    var currentDate = new Date();
    currentDate.getDate();
    var date =` ${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`;
    fs.writeFile(`./hisaab/${date}.txt`, req.body.content, function(err) {
        if (err) return res.status(500).send(err);
        res.redirect("/");
    });
});

app.get("/create", function(req, res){
    res.render("create");

});
app.get("/edit", function(req, res){
    res.render("edit");
});

// app.get("/edit/:filename", function(req, res) {
//     fs.readFile(`./hisaab/${req.params.filename}`, "utf8", function(err, filedata) {
//         if(err) return res.status(500).send(err);
//         res.render("edit", {filedata, filename: req.params.filename});
//     });
// });
app.get("/edit/:filename", function(req, res) {
    const filePath = `./hisaab/${req.params.filename}`;
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found.");
    }

    fs.readFile(filePath, "utf8", function(err, filedata) {
        if (err) return res.status(500).send(err);
        
        // ✅ Pass both 'filedata' and 'filename' to the EJS template
        res.render("edit", { filedata: filedata, filename: req.params.filename });
    });
});

app.get("/hisaab/:filename", function(req, res){
    fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", function(err,filedata){
        if(err)return res.status(500).send(errr);
        res.render("hisaab", {filedata, filename: req.params.filename});
    })
});

app.get("/delete/:filename", function(req, res){
    fs.unlink(`./hisaab/${req.params.filename}`, function(err){
        if(err)return res.status(500).send(err);
        res.redirect("/");
    })
})

app.post("/update/:filename", function (req, res) {
    fs.writeFile(`./hisaab/${req.params.filename}`, req.body.content, function(err) {
        if(err) return res.status(500).send(err);
        res.redirect("/");
    });
})

app.get("/", (req, res) => {
    fs.readdir("./hisaab/", function(err, files) {
        if (err) return res.status(500).send(err);
        res.render("index", { files: files }); // Ensure "index.ejs" exists in views
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000"); 
});
