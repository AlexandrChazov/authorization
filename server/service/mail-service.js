const nodemailer = require("nodemailer");

class MailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      // service: 'gmail',
      host: "smtp.gmail.com",
      port: 587 ,
      secure: false,                   // true for "port: 465", false for other ports
      auth: {
        user: "chazovby@gmail.com",
        pass: "nueeslvfxjusahak",
      }
    })
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: "chazovby@gmail.com",
      to,
      subject: `Account activation at ${process.env.API_URL}`,
      text: "",
      html:
        `
          <a>
            <h1>Click at link for activation</h1>
            <a href="${link}">${link}</a>
          </div>
        `
    })
  }
}

module.exports = new MailService();
