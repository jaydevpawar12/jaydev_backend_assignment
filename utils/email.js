const nodemailer = require("nodemailer")

const sendEmail = ({ to, subject, message }) => new Promise((resolve, reject) => {
    try {
        const mailer = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.EMAIL_PASS
            }
        })
        mailer.sendMail({
            from: process.env.FROM_EMAIL,
            to,
            subject,
            text: message,
            html: message
        }, (err) => {
            if (err) {
                console.log(err)
                reject(err.message)
            }
            console.log("email Send Success")
            resolve("Email Send Success")
        })
    } catch (error) {
        console.log(error)
        reject(error.message)
    }
})
module.exports = sendEmail
// export default sendEmail
