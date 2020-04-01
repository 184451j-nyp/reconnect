const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
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

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie());
app.use(session({
    cookie:{
	secure: true,
	maxAge: 60000
	},
    secret: 'dirtyLittleSecret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(compression());
app.use(helmet());

const mainRoute = require('./routes/main');
app.use('/', mainRoute);

db.setUpDB(true);

app.listen(49800);
