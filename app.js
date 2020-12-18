const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoose start
mongoose.connect('mongodb://localhost:27017/toDoListDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Wake up"
});

const item2 = new Item({
    name: "Make your bed"
});

const item3 = new Item({
    name: "Start your day"
})

const defaultItems = [item1, item2, item3];



//mongoose finshed

const workItems = [];

app.get("/", (req, res) => {

    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('successfull !');
                }
            })
            res.redirect('/');
        } else {
            res.render("list", {
                listTitle: "Today",
                newItems: foundItems
            });
        }


    })

})

app.post("/", (req, res) => {

    let newItem = req.body.toDoList;

    const item = new Item({
        name: newItem
    });

    item.save();

    res.redirect('/');


    // let workItem = req.body.toDoList;

    // if (req.body.list === "Work") {
    //     workItems.push(workItem);
    //     res.redirect("/work");
    // }
    // else {
    //     items.push(item);
    //     res.redirect("/");
    // }
})

app.post('/delete', (req, res) => {
    const itemId = req.body.checkbox;
    // console.log(itemId);
    Item.findByIdAndRemove(itemId, (err) => {
        if (!err) {
            console.log("succesfully deleted the Item");
        } else {
            console.log(err, "We are unable to delete the Item");
        }
    })

    res.redirect('/');
});

app.get("/:parameter", (req, res) => {
    console.log(req.params.parameter);
})


// app.get("/work", (req, res) => {


//     res.render("list", {
//         listTitle: "Work List",
//         newItem: workItems
//     });
// })


app.listen(3000, () => {
    console.log("server is running at port 3000");
});