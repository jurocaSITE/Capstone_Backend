const {
	SENDGRID_API_KEY,
	EMAIL_SERVICE_ACTIVE,
	CLIENT_URL,
	EMAIL_FROM_ADDRESS,
	APPLICATION_NAME,
} = require("../config");
const EmailService = require("./email");

// {} empty config object
const emailService = new EmailService({
	isActive: EMAIL_SERVICE_ACTIVE,
	apiKey: SENDGRID_API_KEY,
	clientUrl: CLIENT_URL,
	emailFromAddress: EMAIL_FROM_ADDRESS,
	applicationName: APPLICATION_NAME,
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
	const emailService = new EmailService({
		isActive: true,
		apiKey: SENDGRID_API_KEY,
		clientUrl: CLIENT_URL,
		emailFromAddress: EMAIL_FROM_ADDRESS,
		applicationName: APPLICATION_NAME,
	});
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
		const emailService = new EmailService({
			isActive: true,
			apiKey: SENDGRID_API_KEY,
			clientUrl: CLIENT_URL,
			emailFromAddress: EMAIL_FROM_ADDRESS,
			applicationName: APPLICATION_NAME,
		});
		const email = {};
		const res = await emailService.sendEmail(email);
		expect(res).toEqual({
			status: 400,
			email,
			error: [{ field: `to`, message: "Missing to field." }],
		});
	});
});
