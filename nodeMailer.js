import nodemailer from "nodemailer"
import "dotenv/config"
// 1 - CASE
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_APP_PASSWORD
    }
})
(async () => {
    const info = await transporter.sendMail({
        from: `"Karimjonova Mukhtasar" <karimjonovamukhtasar2003@gmail.com>`,
        to: "oybarchinroziqulova23@gmail.com",
        subject: "nodemailer test",
        html: "<b>HELLO WORLD</b>"
    });
    console.log("MESSAGE SENT", info.messageId)
    console.log({info});
})()

// // 2 - CASE
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.GOOGLE_MAIL,
//         pass: process.env.GOOGLE_APP_PASSWORD,
//     },
// });

// (async () => {
//     const info = await transporter.sendMail({
//         from: `"Karimjonova Mukhtasar" <karimjonovamukhtasar2003@gmail.com>`,
//         to: "oybarchinroziqulova23@gmail.com",
//         subject: "Hello",
//         html: "<b>Salom nima gap</b>"
//     })

//     console.log("message send: ", info.messageId)
//     console.log({info})
// })()


