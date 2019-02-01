const mongoose = require('mongoose');

// Map global promis - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot', { useNewUrlParser: true }).then(() => {
	console.log('MongoDB Connected …')
}).catch(err => console.log(err));
