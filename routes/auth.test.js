// const app = require("../app");
// const User = require("../models/users");
// const token = require("../utils/tokens");
// const request = require("supertest");

// const themToken = token.createUserJwt({ username: "them", isAdmin: false });

// describe("Auth Routes", () => {
// 	describe(`POST /recover`, () => {
// 		test("User can request password recovery and receive a success message", async () => {
// 			const res = await request(app)
// 				.post(`auth/recover`)
// 				.set({ email: `test2@gmail.com` });
// 			expect(res.statusCode).toEqual(200);
// 			expect(res.body).toEqual({
// 				message: `If your account exists in our system, you should receive an email shortly`,
// 			});
// 		});
// 	});

// 	describe(`POST /password-reset`, () => {
// 		test("User with valid token can reset password", async () => {
// 			const email = "test2@gmail.com";
// 			const user = await User.fetchUserByEmail(email);
// 			const resetToken = token.generatePasswordResetToken();
// 			await User.savePasswordResetToken(email, resetToken);
// 			const res = await request(app)
// 				.post(`/auth/password-reset?token=${resetToken.token}`)
// 				.send({ newPassword: `brandNewPassword` });
// 			expect(res.statusCode).toEqual(200);
// 			expect(res.body).toEqual({ message: `Password successfull reset.` });

// 			const updatedUser = await User.fetchUserByEmail(email);
// 			expect(user.password === updatedUser.password).toBeFalsy();
// 		});

// 		test("User with invalid token gets 400 error", async () => {
// 			const badToken = "bad_token";
// 			const res = await request(app)
// 				.post(`/auth/password-reset?token=${badToken}`)
// 				.send({ newPassword: `brandNewPassword` });
// 			expect(res.statusCode).toEqual(400);
// 			expect(res.body).toEqual({
// 				error: {
// 					message: `That token is either expired or invalid.`,
// 					status: 400,
// 				},
// 			});
// 		});
// 	});
// });
