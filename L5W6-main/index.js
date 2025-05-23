const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();
const path = require('path')

const studentSchema = new mongoose.Schema({ name: String, age: Number, course: String });
const Student = mongoose.model("Student", studentSchema);

const initDatabase = async (mongoUri) => {
    try {
        await mongoose.connect(mongoUri, {
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,'views'));

app.get("/", (req, res) => {
    res.redirect("/students");
});

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.render("students", { students });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).send("Error fetching students");
    }
});

app.get("/student/new", (req, res) => {
    res.render("new_student");
});

app.post("/student", async (req, res) => {
    try {
        const newStudent = new Student({ name: req.body.name, age: req.body.age, course: req.body.course });
        await newStudent.save();
        res.redirect("/students");
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).send("Error adding student");
    }
});

app.get("/student/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send("Student Not Found");
        res.render("student", { student });
    } catch (error) {
        console.error("Error fetching student by ID:", error);
        res.status(500).send("Error fetching student");
    }
});

app.get("/student/:id/edit", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send("Student Not Found");
        res.render("edit_student", { student });
    } catch (error) {
        console.error("Error fetching student for edit:", error);
        res.status(500).send("Error fetching student");
    }
});

app.put("/student/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, age: req.body.age, course: req.body.course },
            { new: true }
        );
        if (!student) return res.status(404).send("Student Not Found");
        res.redirect("/students");
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).send("Error updating student");
    }
});

app.delete("/student/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).send("Student Not Found");
        res.redirect("/students");
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).send("Error deleting student");
    }
});

module.exports = { app, Student, initDatabase, mongoose };

if (require.main === module) {
    initDatabase("mongodb://20.0.153.128:10999/studentsDB").then(() => {
        app.listen(1210, () => console.log("Server is running on port 1210"));
    });
}