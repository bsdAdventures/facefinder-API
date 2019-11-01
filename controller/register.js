const validation = require('../util/helper')

const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}

	if (validation.validateName(name)) {

		return res.status(400).json('Name can not be empty');
	} else if (validation.validateEmail(email)) {
		return res.status(400).json('Email is not valid');
	} else if (validation.validatePassword(password)) {
		return res.status(400).json('Password must be 4 or more characters');
	}



	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
	})
		.catch(err => res.status(400).json('unable to register'))
}

module.exports = {
	handleRegister: handleRegister
};
