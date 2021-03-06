const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));


//connection to mongodb atlas
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }, () => {
    console.log("Connected to MongoDB Atlas database");
    app.listen(8000, () => console.log("Server is running on port 8000"));
});

mongodb://jocelyn:jouh1823@todolist-shard-00-00.76z0e.mongodb.net:27017,todolist-shard-00-01.76z0e.mongodb.net:27017,todolist-shard-00-02.76z0e.mongodb.net:27017/todolist?ssl=true&replicaSet=atlas-7r3s9r-shard-0&authSource=admin&retryWrites=true&w=majority
app.set("view engine", "ejs");

// app.get('/', (req, res) => {
//     res.render('todo.ejs');
// });

//GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});


//POST METHOD
app.post('/', async (req, res) => {
    console.log(req.body)
    const todoTask = new TodoTask({ 
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//UPDATE
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });



//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});







