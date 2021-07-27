import { NotExtended } from "http-errors";
import { sendEmail } from "./utils/sendEmail";

export const testEmailRoute = {
	path: "api/test-email",
	method: "post",
	handler: async (req, res) => {
		try {
			await sendEmail({
				to: "camila.noimportante@gmail.com",
				from: "camilailiberg@gmail.com",
				subject: "Does this work?",
				text: "if you are reading this....yes!",
			});

			res.sendStatus(200);
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	},
};
