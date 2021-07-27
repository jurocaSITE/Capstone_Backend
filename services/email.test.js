const { SENDGRID_API_KEY, EMAIL_SERVICE_ACTIVE } = require("../config");
const EmailService = require("./email");

// {} empty config object
const emailService = new EmailService({
	isActive: EMAIL_SERVICE_ACTIVE,
	apiKey: SENDGRID_API_KEY,
});

describe("Test EmailService", () => {
	test("Stores is active config flag and nodemailer transport on instance", () => {
		expect(emailService).toHaveProperty("isActive");
		expect(emailService).toHaveProperty("transport");
	});
});

test("is inactive when testing", () => {
	expect(emailService.isActive).toBeFalsy();
	expect(emailService.transport).toBeTruthy();
});

describe("Test sendEmail", () => {
	test("Return 202 status code when all goes well", async () => {
		const email = {
			to: `camila.noimportante@gmail.com`,
			from: `camilailiberg@SpeechGrammarList.com`,
			subject: `test subject email sending thingie`,
			html: `<h1>Test email</h1>`,
		};
		const res = await emailService.sendEmail(email);
		expect(res).toEqual({ status: 202, email, error: null });
	});
});

describe("Test sendEmail", () => {
	test("Return 400 status code when something goes wrong", async () => {
		const email = {};
		const res = await emailService.sendEmail(email);
		expect(res).toEqual({
			status: 400,
			email,
			error: [{ field: `to`, message: "Missing to field." }],
		});
	});
});
