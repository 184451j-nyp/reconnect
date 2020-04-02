const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('cookie-session');
const cookie = require('cookie-parser');
const flash = require('connect-flash');
const db = require("./config/DBConnection");

const app = express();

app.engine('.hbs', exphbs({
    defaultLayout: "layout",
    extname: '.hbs',
    partialsDir: __dirname + "/views/partials"
}));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.enable('view cache');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie());
app.use(session({
    name: "reconnectSession",
    keys: ["reconkey", "reconkey2"],
    maxAge: 60 * 60 * 1000
}));
app.use(flash());

app.use('/', require('./routes/main'));
app.use('/api', require('./routes/api'));

app.use(compression());
app.use(helmet());

db.setUpDB();

app.listen(49800);