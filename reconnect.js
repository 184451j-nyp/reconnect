const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const session = require("cookie-session");
const cookie = require("cookie-parser");
const flash = require("connect-flash");
const https = require("https");
const fs = require("fs");
const db = require("./config/DBConnection");

require('dotenv').config();

const app = express();

app.engine(".hbs", exphbs({
    defaultLayout: "layout",
    extname: ".hbs",
    partialsDir: __dirname + "/views/partials"
}));
app.set("view engine", ".hbs");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.enable("view cache");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie());
app.use(session({
    name: "reconnectSession",
    keys: ["reconkey", "reconkey2"],
    maxAge: 60 * 60 * 1000
}));
app.use(flash());

app.use("/", require("./routes/main"));
app.use("/api", require("./routes/api"));

app.use(compression());
app.use(helmet());

db.setUpDB();

if (process.env.NODE_ENV == "production") {
    const options = {
        key: fs.readFileSync(process.env.KEY),
        cert: fs.readFileSync(process.env.CERT)
    }
    https.createServer(options, app).listen(49443);
}

app.listen(49080);