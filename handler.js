const serverless = require("serverless-http");
const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

//Listagem de produtos
app.get('/listar-produtos', async (req, res, next) => {
  const connection = await mysql.createConnection({ host: "aws-curso-desenvolvimento-web.cwb0akjpddo0.us-east-1.rds.amazonaws.com", user: "admin", password: "#pass2230E", database: "productsdb" })
  const [rows, fields] = await connection.execute("SELECT products.id, products.name, products.price, category.name AS category FROM products JOIN category ON products.category = category.id;");
  res.status(200).json({
    response: rows
  });
})

//Listagem de categorias
app.get('/listar-categorias', async (req, res, next) => {
  const connection = await mysql.createConnection({ host: "aws-curso-desenvolvimento-web.cwb0akjpddo0.us-east-1.rds.amazonaws.com", user: "admin", password: "#pass2230E", database: "productsdb" })
  const [rows, fields] = await connection.execute("select * from category");
  res.status(200).json({
    response: rows
  });
})

//Cadastro de produtos
app.post('/cadastro-produto', async function (req, res) {
  const { name, price, category } = req.body;

  const connection = await mysql.createConnection({ host: "aws-curso-desenvolvimento-web.cwb0akjpddo0.us-east-1.rds.amazonaws.com", user: "admin", password: "#pass2230E", database: "productsdb" })
  const [rows, fields] = await connection.execute("INSERT INTO `products` (`id`, `name`, `price`, `category`) VALUES (NULL, ?, ?, ?)", [name, price, category]);

  res.status(200).json({
    message: "Produto cadastrado com sucesso!"
  });
});

//Cadastro de categorias
app.post('/cadastro-categoria', async function (req, res) {
  const { name } = req.body;

  const connection = await mysql.createConnection({ host: "aws-curso-desenvolvimento-web.cwb0akjpddo0.us-east-1.rds.amazonaws.com", user: "admin", password: "#pass2230E", database: "productsdb" })
  const [rows, fields] = await connection.execute("INSERT INTO `category` (`id`, `name`) VALUES (NULL, ?)", [name]);

  res.status(200).json({
    message: "Categoria cadastrada com sucesso!"
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
