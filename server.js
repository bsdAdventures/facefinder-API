const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const controller = require('./controller')


const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: '',
		password: '',
		database: 'face-finder'
	}
});


const app = express();

app.use(cors())
app.use(bodyParser.json());


app.post('/signin', controller.signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { controller.register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { controller.profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { controller.image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { controller.image.handleApiCall(req, res) })


const PORT = process.env.PORT !== undefined ? process.env.PORT : 3000
app.listen(PORT, () => {
	console.log(`app is running on port ${ PORT }`);
})
