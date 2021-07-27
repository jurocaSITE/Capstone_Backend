// create a single instance of the email service that we'll export for use across our application

const EmailService = require("./email");

const emailService = new EmailService({
	isActive: EMAIL_SERVICE_ACTIVE,
	apiKey: SENDGRID_API_KEY,
});

module.exports = { emailService };
