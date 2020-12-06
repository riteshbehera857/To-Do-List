const express = require("express");
const bodyParser = require("body-parser");
const date = require(`${__dirname}/date.js`);


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const items = [];
const workItems = [];

app.get("/", (req, res) => {

    // to get the current date or week name

    let day = date();


    res.render("list", {
        listTitle: day,
        newItem: items
    });
});

app.post("/", (req, res) => {

    let item = req.body.toDoList;  
    let workItem = req.body.toDoList;

    if (req.body.list === "Work") {
        workItems.push(workItem);
        res.redirect("/work");
    }
    else {
        items.push(item);
        res.redirect("/");
    }   
})

app.get("/work", (req, res) => {


    res.render("list", {
        listTitle: "Work List",
        newItem: workItems
    });
})


app.listen(3000, () => {
    console.log("server is running at port 3000");
});



/*
 the concept of scope:

 function a {
 let x = something

 console.log(x);

 //output willbe something.

 //these ar called Local variables


 in this case i can only call the variable x inside the function a,which might give us some problem.
 }

*/

/*


var a = 2

function x {
    console.log(a)

}

console.log(a);

//these are called Global variables.


//in this case we can call the variable both inside or outside the variable.

*/