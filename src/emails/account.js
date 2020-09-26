const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'saxenasandivya@gmail.com',
        subject: 'Thanks for joining Task-Manager',
        text: `Hi, ${name}.\n\nLet me know how you get along with the app.\n\nRegards,\nSandivya`
    })
}

const sendGoodbyeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'saxenasandivya@gmail.com',
        subject: 'A goodbye from Task-Manager',
        text: `Hi, ${name}.\n\nIt's sad to see you going from the app. We hope you rejoin.\n\nRegards,\nSandivya`
    })
}

module.exports = {
    sendWelcomeMail,
    sendGoodbyeMail
}