"use strict";
const fs = require("fs");
const pg = require("pg");
const axios = require("axios");

const config = {
  connectionString:
    "postgres://candidate:62I8anq3cFq5GYh2u4Lh@rc1b-r21uoagjy1t7k77h.mdb.yandexcloud.net:6432/db1",
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("/home/vladimir/.postgresql/root.crt").toString(),
  },
};

async function main() {
  const conn = new pg.Client(config);

  try {
    await conn.connect();
    console.log("Подключено к базе данных");
    // const res = await conn.query("SELECT * FROM djBOBAH");
    // console.log(res.rows);
    await conn.query(
      "CREATE TABLE IF NOT EXISTS djBOBAH (id SERIAL PRIMARY KEY NOT NULL, name TEXT, data JSONB)"
    );
    console.log("создана таблица djBOBAH");

    const response = await axios.get(
      "https://rickandmortyapi.com/api/character"
    );
    const characters = response.data.results;

    for (const character of characters) {
      await conn.query("INSERT INTO djBOBAH (name, data) VALUES ($1, $2)", [
        character.name,
        JSON.stringify(character),
      ]);
      console.log("Данные персонажа добавлены:", character.name);
    }
  } catch (error) {
    console.error("Ошибка при работе с базой данных:", error);
  } finally {
    await conn.end();
    console.log("Соединение с базой данных закрыто");
  }
}

main();
