const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthentication} = require('../helper/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');


// IDEA route
router.get('/', ensureAuthentication, (req,res) => {
	Idea.find({user: req.user.id})
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
router.get('/add', ensureAuthentication, (req,res)=>{
	res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthentication, (req,res)=>{
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			if(idea.user !== req.user.id) {
				req.flash('error_msg', 'Not Autrorized');
				res.redirect('/ideas');
			} else {
				res.render('ideas/edit', {
					idea: idea
				});
			}
		});
});

// Process Form
router.post('/', ensureAuthentication, (req,res)=>{
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
			details: req.body.details,
			user: req.user.id
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
router.put('/:id', ensureAuthentication, (req, res)=>{
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
router.delete('/:id', ensureAuthentication, (req, res)=>{
	Idea.findOneAndRemove({
		_id: req.params.id
	}).then(ideaa => {
		req.flash('error_msg', 'Video Idea removed');
		res.redirect('/ideas');
	})
});

module.exports = router;
