const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { SECRET_KEY } = require("../config");

//geterate a token
const generateToken = (data) =>
	jwt.sign(data, SECRET_KEY, { expiresIn: "24h" });

// accepts a user object and then cobnvert it into a valid token, soring only the emial and isAdmin value
const createUserJwt = (user) => {
	const payload = {
		email: user.email,
		isAdmin: user.isAdmin || false,
	};

	return generateToken(payload);
};

//validate token
const validateToken = (token) => {
	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		return decoded;
	} catch (err) {
		return {};
	}
};

// function that takes a number of bites that we want to use and is going to use crypto random bytes method that takes in a number of bytes and creates a buffer array of sudo random bytes and then we are going to convert it to a String and that String is going to have an encoding of hexadecimal
const generateCryptoToken = (numBytes) =>
	crypto.randomBytes(numBytes).toString("hex");

// now we are going to use the generate cypto method to generate a password reset token.
const generatePasswordResetToken = () => {
	// and this token will have a few things we are going to return an object that has
	return {
		// the result of generating a crypto token with 20 bytes
		token: generateCryptoToken(20),
		// and also an expiresAt with the current data + and hour ( so it expires in an hour ) and we'll convert it to an ISOSTring which means it gents easyly store as a time stamp in postgres
		expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
	};
};

module.exports = {
	generateToken,
	createUserJwt,
	validateToken,
	generatePasswordResetToken,
};

// this will provide suer useful when convine with custom authentification middleware
