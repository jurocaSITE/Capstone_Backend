const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");

class EmailService {
	//we are just setting up nodemailer to be able to send emails. And the transport variable is what we will be using to send all our emails
	constructor(config) {
		//initialize
		const { isActive, apiKey, clientUrl, emailFromAddress, applicationName } =
			config;

		// we pass the previos apiKey to the nodemailerSendgrid configuration object, which will create our configuration for the nodemailer.createTransoprt method

		const transport = nodemailer.createTransport(
			nodemailerSendgrid({ apiKey })
		);

		// this is so that we keep this store on every instance of the email service class
		this.transport = transport;
		this.isActive = isActive;
		this.clientUrl = clientUrl;
		this.emailFromAddress = emailFromAddress;
		this.applicationName = applicationName;
	}

	async sendEmail(email) {
		if (!this.isActive) {
			if (!email.to)
				return {
					status: 400,
					email,
					error: [{ field: `to`, message: `Missing to field.` }],
				};

			console.log(`Sending fake email to: ${email.to} from: ${email.from}`);

			return { status: 202, email, error: null };
		}

		try {
			const res = await this.transport.sendMail(email);
			const status = res?.[0]?.statusCode;

			if (status === 202) return { status, email, error: null };

			return { status, email, error: res?.[0]?.body };
		} catch (error) {
			console.error(`Errors with email occured: ${String(error)}`);

			const errors = err?.response?.body?.errors;

			return { status: 400, email, error: errors || [err] };
		}
	}

	constructPasswordResetUrl(token) {
		return `${this.clientUrl}/password-reset?token=${token}`;
	}

	async sendPasswordResetEmail(user, token) {
		const resetPAsswordUrl = this.constructPasswordResetUrl(token);

		const email = {
			to: user.email,
			from: this.emailFromAddress,
			subject: `Reset you password for ${this.applicationName}`,
			html: `
			<html>
				<body>
					<h1>Password Reset Notification</h1>
					<br />
					<p>You are receiving this email because you made a request to reset the password fro your account.</p>
					<br />
					<p>Click on the link below to finish the password reset process</p>
					<a href="${resetPAsswordUrl}">${resetPAsswordUrl}</a>
					<br />
					<p>If you did not make this request contact support inmediately</p>
				</body>
			</html>
			`,
		};

		return await this.sendEmail(email);
	}

	async sendPasswordResetConfirmationEmail(user) {
		const email = {
			to: user.email,
			from: this.emailFromAddress,
			subject: `Your ${this.applicationName} password has been reset successfully.`,
			html: `
			<html>
				<body>
					<h1>Password Reset Notification</h1>
					<br />
					<p>This is a confirmation of a successful password reset for your account.</p>
					<br />
					<p>If you did not reset your password contact support inmediately</p>
				</body>
			</html>
			`,
		};

		return await this.sendEmail(email);
	}
}

module.exports = EmailService;
