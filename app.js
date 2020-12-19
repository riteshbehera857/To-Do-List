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

const listSchema = {
    name: String,
    items: [itemsSchema]
};


const List = mongoose.model('List', listSchema);

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
    let listName = req.body.list;

    const item = new Item({
        name: newItem
    });

    if (listName === "today") {
        item.save();

        res.redirect('/');
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            console.log(err);
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }


})

app.post('/delete', (req, res) => {
    const itemId = req.body.checkbox;
    const listName = req.body.listName;
    // console.log(itemId);
    console.log(listName);
    if (listName === "Today") {
        Item.findByIdAndRemove(itemId, (err) => {
            if (!err) {
                console.log("succesfully deleted the Item");
            } else {
                console.log(err, "We are unable to delete the Item");
            }
        })
        res.redirect('/');
    } else {
        List.findOneAndUpdate({ name: listName }, {
            $pull: {
                items: {
                    _id: itemId
                }
            }
        }, (err, foundList) => {
            if (!err) {
                res.redirect("/" + listName);
                console.log(foundList);
            } else {
                console.log(err);
            }
        })
    }

});

app.get("/:parameter", (req, res) => {
    const customListName = req.params.parameter;

    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {

                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                //create a new list

                res.redirect("/" + customListName);
            } else {

                res.render("list", {
                    listTitle: foundList.name,
                    newItems: foundList.items
                })
                //show an existing list
            }
        }
    })
})

app.listen(3000, () => {
    console.log("server is running at port 3000");
});