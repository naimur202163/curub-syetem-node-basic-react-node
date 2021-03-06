const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello world");
});
const uri = "mongodb+srv://mydbuser1:XSzJ1yYpwViGky5X@cluster0.tlrw7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect((err) => {
  const userList = client.db("randomUsers").collection("users");
  // Giveing  data to Server
  app.post("/addUser", (req, res) => {
    console.log(req.body);
    userList.insertOne(req.body).then((result) => {
      console.log(result);
      res.send(result.acknowledged);
    });
  });

  //   app.get("/users", (req, res) => {
  //     userList.find({}).toArray((err, documents) => {
  //       res.send(documents);
  //     });
  //   });
  // Loading data from server
  app.get("/users", async (req, res) => {
    const result = await userList.find({}).toArray();
    res.send(result);
  });
  // Delet data From Server
  app.delete("/deleteUser/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await userList.deleteOne({ _id: ObjectId(req.params.id) });

    console.log(result.acknowledged);
    res.send(result.acknowledged);
  });

  app.get("/singleUser/:id", (req, res) => {
    console.log(req.params.id);
    userList.findOne({ _id: ObjectId(req.params.id) }).then((result) => {
      res.send(result);
    });
  });

  //uodate user info
  app.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const updatedName = req.body;
    const filter = { _id: ObjectId(id) };
    const updateInfo = {
      $set: {
        name: updatedName.name,
      },
    };
    const result = await userList.updateOne(filter, updateInfo);
    console.log(result);
    res.send(result);
  });
});

// const users = [
//   { id: 0, name: "Shabana", email: "Shabana@gmail.com", phone: "01788888888" },
//   {
//     id: 1,
//     name: "Shabnoor",
//     email: "Shabnoor@gmail.com",
//     phone: "01788888888",
//   },
//   {
//     id: 2,
//     name: "Shrabonti",
//     email: "Shrabonti@gmail.com",
//     phone: "01788888888",
//   },
//   {
//     id: 3,
//     name: "Suchorita",
//     email: "Suchorita@gmail.com",
//     phone: "01788888888",
//   },
//   { id: 4, name: "Soniya", email: "Soniya@gmail.com", phone: "01788888888" },
//   { id: 5, name: "Susmita", email: "Susmita@gmail.com", phone: "01788888888" },
// ];

// app.get("/user", (req, res) => {
//   const search = req.query.search;
//   if (search) {
//     const searchResult = users.filter((user) =>
//       user.name.toLowerCase().includes(search)
//     );
//     res.send(searchResult);
//   } else {
//     res.send(users);
//   }
//   res.send(users);
// });

// app.get("/user/:userId", (req, res) => {
//   console.log(req.params.userId);
//   res.send(users[req.params.userId]);
// });

app.listen(port, () => {
  console.log("Running Server on port", port);
});
