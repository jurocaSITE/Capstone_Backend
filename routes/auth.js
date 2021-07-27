const express = require("express");
const User = require("../models/users");
const { createUserJwt } = require("../utils/tokens"); //utility function to generate json we tokens
const security = require("../middleware/security"); // middleware
const router = express.Router();

//login
router.post("/login", async (req, res, next) => {
	try {
		const user = await User.login(req.body);
		const token = createUserJwt(user);
		return res.status(200).json({ user, token });
	} catch (err) {
		next(err);
	}
});

// register
router.post("/register", async (req, res, next) => {
	try {
		const user = await User.register({ ...req.body, isAdmin: false });
		const token = createUserJwt(user);
		return res.status(201).json({ user, token });
	} catch (err) {
		next(err);
	}
});

// update user profile information
router.put(
	"/update-personal-information",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { user } = res.locals;
			const updated_user = await User.updateUserInformation({
				user,
				new_user_info: req.body,
			});
			return res.status(204).json({ updated_user });
		} catch (err) {
			next(err);
		}
	}
);

// delete user profile
router.delete(
	"/delete-account",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { user } = res.locals;
			const deleted_user = await User.deleteUser(user);
			return res.status(204).json({ deleted_user });
		} catch (err) {
			next(err);
		}
	}
);

// set user genre interest
router.put(
	"/update-genre-interests",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { user } = res.locals;
			const genre_interests = await User.updateUserGenreInterests({
				user,
				user_genre_interests: req.body,
			});

			return res.status(204).json({ genre_interests });
		} catch (err) {
			next(err);
		}
	}
);

// get all user interests
router.get(
	"/user-genre-interests",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { user } = res.locals;
			const user_genre_interests = await User.getAllUserGenreInterests(user);
			return res.status(200).json({ user_genre_interests });
		} catch (err) {
			next(err);
		}
	}
);

// set user reading goal
router.put(
	"/update-reading-goal",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { user } = res.locals;
			const new_reading_goal = await User.updateUserReadingGoal({
				user,
				reading_goal: req.body,
			});

			return res.status(204).json({ new_reading_goal });
		} catch (err) {
			next(err);
		}
	}
);

// forgot password
router.put("/forgot-password", async (req, res, next) => {
	try {
		await User.forgotPassword();
		return res.status(200);
	} catch (err) {
		next(err);
	}
});

// I wan to take the token that was sent in this request and I want to turn it into a user in our data base, who can be then sent back to the client with all their information
router.get("/me", security.requireAuthenticatedUser, async (req, res, next) => {
	try {
		const { email } = res.locals.user;
		const user = await User.fetchUserByEmail(email);
		const publicUser = User.makePublicUser(user);
		return res.status(200).json({ user: publicUser });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
