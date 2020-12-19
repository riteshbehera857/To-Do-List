const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require("lodash");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoose start
mongoose.connect('mongodb+srv://ritesh-database_857:riteshchiku3000@cluster0.tgqh9.mongodb.net/toDoListDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

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

app.get("/", (req, res) => {

    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('successfull !');
                }

                res.redirect('/');
            });

        } else {
            res.render("list", {
                listTitle: "Today",
                newItems: foundItems
            });
        }


    });

});

app.get("/:parameter", (req, res) => {
    const customListName = _.capitalize(req.params.parameter);

    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                //create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {

                res.render("list", {
                    listTitle: foundList.name,
                    newItems: foundList.items
                });
                //show an existing list
            }
        }
    });
});

app.post("/", (req, res) => {

    let newItem = req.body.toDoList;
    let listName = req.body.list;

    const item = new Item({
        name: newItem
    });

    if (listName === "Today") {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            console.log(err);
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                console.log("Successfully deleted checked item.");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }


});

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running at port 3000");
});