// const mongoose = require("mongoose");

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

// const password = process.argv[2];
// const name = process.argv[3];
// const number = process.argv[4];

// const url = `mongodb+srv://mdn789:${password}@nodejs.80qow.mongodb.net/noteApp?retryWrites=true&w=majority&appName=nodejs`;

// mongoose.set("strictQuery", false);

// mongoose.connect(url);

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// });

// const Note = mongoose.model("Note", noteSchema);

// // note.save().then((result) => {
// //   console.log("note saved!");
// //   mongoose.connection.close();
// // });

// Note.find({ important: false }).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });

const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://mdn789:${password}@nodejs.80qow.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=nodejs`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name,
  number,
});

if (name && number) {
  person.save().then((result) => {
    console.log(`added ${name}'s number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("phonebook:");
  Person.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}\ `);
    });
    mongoose.connection.close();
  });
}
