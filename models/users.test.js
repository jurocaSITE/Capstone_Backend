const User = require("./users");
const tokens = require("../utils/tokens");
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
	});
});
