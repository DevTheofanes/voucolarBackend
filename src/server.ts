import express from "express";
import cors from "cors";
import { resolve } from "path";

//importação da  conexão do banco de dados
import "./database/connections";

//importação das routas
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/files", express.static(resolve(__dirname, "..", "temp", "uploads")));
app.use(routes);

app.listen(3333);
