const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');

require('./utilities/connect');

// Load Idea Model
require('./models/idea');
const Idea = mongoose.model('ideas');

const port = process.env.MONGODB_URI || 3000;
const app = express();

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

// connect-flash middleware
app.use(flash());

// global variables with flash
app.use((req,res,next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
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

// IDEA route
app.get('/ideas', (req,res) => {
	Idea.find({})
		.sort({date: 'desc'})
		.then(ideas => {
			res.render('ideas/index', {
				ideas: ideas
			});
		})
		.catch(err => {
			res.render('ideas/index', {
				err: err
			})
		})
});

// Add Idea Form
app.get('/ideas/add', (req,res)=>{
	res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req,res)=>{
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			res.render('ideas/edit', {
				idea: idea
			});
		});
});

// Process Form
app.post('/ideas', (req,res)=>{
	let errors = [];
	if(!req.body.title) {
		errors.push({text: 'Please add title'});
	}
	if(!req.body.details) {
		errors.push({text: 'Please add some details'});
	}
	if(errors.length > 0) {
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		})
	} else {
		const newIdea = {
			title: req.body.title,
			details: req.body.details
		};
		new Idea(newIdea)
			.save()
			.then(idea => {
				req.flash('success_msg', `Video Idea "${idea.title}" added`);
				res.redirect('/ideas');
			})
	}
});

// Edit Form process
app.put('/ideas/:id', (req, res)=>{
	Idea.findOne({
		_id: req.params.id
	}).then(idea => {
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
			.then(idea => {
				req.flash('success_msg', `Video Idea "${idea.title}" updated`);

				res.redirect('/ideas');
			})
	});
});

// Delete Idea
app.delete('/ideas/:id', (req, res)=>{
	Idea.findOneAndRemove({
		_id: req.params.id
	}).then(ideaa => {
		req.flash('error_msg', 'Video Idea removed');
		res.redirect('/ideas');
	})
});

app.listen(port, () => {
	console.log(`Started at port: ${port}`)
});