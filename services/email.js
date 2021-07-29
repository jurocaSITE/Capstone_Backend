const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");

class EmailService {
	//we are just setting up nodemailer to be able to send emails. And the transport variable is what we will be using to send all our emails
	constructor(config) {
		//initialize
		const { isActive, apiKey } = config;

		// we pass the previos apiKey to the nodemailerSendgrid configuration object, which will create our configuration for the nodemailer.createTransoprt method

		const transport = nodemailer.createTransport(
			nodemailerSendgrid({ apiKey })
		);

		// this is so that we keep this store on every instance of the email service class
		this.transport = transport;
		this.isActive = isActive;
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

	async sendPasswordResetEmail() {
		// complete me
	}

	async sendPasswordResetConfirmationEmail() {
		// complete me
	}
}

module.exports = EmailService;
