const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const mongoose = require('mongoose');

require('./config/database');

// Map global promis - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot', { useNewUrlParser: true }).then(() => {
	console.log('MongoDB Connected …')
}).catch(err => console.log(err));

const port = process.env.PORT || 3000;
const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

// Static folger
app.use(express.static(path.join(__dirname, 'public')));

// express-handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// method-override middleware
app.use(methodOverride('_method'));

// express-session middleware
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
	// cookie: { secure: true }
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect-flash middleware
app.use(flash());

// global variables with flash
app.use((req,res,next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// INDEX route
app.get('/', (req, res) => {
	const title = 'Welcome';
	res.status(200);
	res.render('index', {
		title: title
	});
});

// ABOUT route
app.get('/about', (req,res)=>{
	res.render('about');
});

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);


app.listen(port, () => {
	console.log(`Started at port: ${port}`)
});