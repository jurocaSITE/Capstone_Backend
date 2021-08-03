const User = require("./users");
const tokens = require("../utils/tokens");
const { BadRequestError } = require("../utils/errors");
const newUser = {
	first_name: "test",
	last_name: "prueba",
	username: "test_prueba",
	email: "test2@gmail.com",
	password: "pw",
};

describe("User", () => {
	describe("Test password reset", () => {
		test("User can store reset token in the db", async () => {
			await User.register({ ...newUser });
			let userFromDb = await User.fetchUserByEmail(newUser.email);
			expect(userFromDb.pw_reset_token).toBeNull();
			expect(userFromDb.pw_reset_token_exp).toBeNull();

			const resetToken = tokens.generatePasswordResetToken();

			await User.savePasswordResetToken(newUser.email, resetToken);

			userFromDb = await User.fetchUserByEmail(newUser.email);
			expect(userFromDb.pw_reset_token).toEqual(resetToken.token);
			expect(userFromDb.pw_reset_token_exp).toEqual(expect.any(Date));
		});

		test("User can reset password when supplying the correct token", async () => {
			// const user = await User.register({ ...newUser });
			const oldUserFromDb = await User.fetchUserByEmail(newUser.email);
			expect(
				await User.login({
					email: oldUserFromDb.email,
					password: "pw",
				})
			).toBeTruthy();

			const resetToken = tokens.generatePasswordResetToken();

			await User.savePasswordResetToken(newUser.email, resetToken);
			await User.resetPassword(resetToken.token, "new_pw");

			const newUserFromDb = await User.fetchUserByEmail(newUser.email);
			expect(newUserFromDb.pw_reset_token).toBeNull();
			expect(newUserFromDb.pw_reset_token_exp).toBeNull();
			expect(newUserFromDb.password === oldUserFromDb.password).toBeFalsy();
			expect(
				await User.login({
					email: newUserFromDb.email,
					password: "new_pw",
				})
			).toBeTruthy();
		});

		test("Error is thrown when bad token is supplied", async () => {
			expect.assertions(1);

			// const user = await User.register({ ...newUser });
			const resetToken = tokens.generatePasswordResetToken();

			await User.savePasswordResetToken(newUser.email, resetToken);

			try {
				await User.resetPassword("bad_token", "new_pw");
			} catch (error) {
				expect(error instanceof BadRequestError).toBeTruthy();
			}
		});
	});
});
