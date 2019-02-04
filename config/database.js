if(process.env.NODE_ENV === 'production'){
	module.exports = {mongoURI: 'mongodb://heroku_2gg0mq35:32o53gm826fotcpmtrbm9qqcmi@ds221115.mlab.com:21115/heroku_2gg0mq35'}
} else {
	module.exports = {mongoURI: 'mongodb://localhost/vidjot'}
}

