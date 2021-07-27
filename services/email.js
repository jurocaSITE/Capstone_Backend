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
}

module.exports = EmailService;
