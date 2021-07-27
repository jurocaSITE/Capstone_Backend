const EmailService = require("./email");

// {} empty config object
const emailService = new EmailService({});

describe("Test EmailService", () => {
	test("Stores is active config flag and nodemailer transport on instance", () => {
		expect(emailService).toHaveProperty("isActive");
		expect(emailService).toHaveProperty("transport");
	});
});
