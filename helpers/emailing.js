const { SendMailClient } = require("zeptomail");
const url = "api.zeptomail.com/";
const token = process.env.ZEPTO_MAIL_API_KEY
const emailText = require('../json/emails.json')
const { resetPassword } = require('./emailTemplates')

let client = new SendMailClient({ url, token });

function sendEmail(to, name, type, lang, link = '', subject, ...extras) {
    const text = emailText[type][lang]
    console.log(to, name, type, lang, link, extras[0])

    client.sendMail({
        "bounce_address": "bounced@bounce.pebblescommunity.com",
        "from":
        {
            "address": "info@pebblescommunity.com",
            "name": "Pebbles Community"
        },
        "to":
            [
                {
                    "email_address":
                    {
                        "address": to,
                        "name": name
                    }
                }
            ],
        "subject": subject,
        "htmlbody": resetPassword(to, name, type, lang, link = '', ...extras),
    }).then((resp) => console.log("success")).catch((error) => console.log("error"));

}

module.exports = sendEmail



// const mailchimp = require("@mailchimp/mailchimp_transactional")(process.env.MAILCHIMP_API_KEY)

// function sendEmail(msg) {
//     const message = {
//         from_email: "info@pebblescommunity.com",
//         subject: "Hello world",
//         text: "Welcome to Mailchimp Transactional!",
//         to: [
//             {
//                 email: "karmen.tanaka@gmail.com",
//                 type: "to"
//             }
//         ]
//     };

//     async function run() {
//         try {
//             const response = await mailchimp.messages.send({
//                 message
//             });
//             console.log(response);
//             return "success"
//         } catch (e) {
//             return e
//         }
//     }
//     run();
// }

// module.exports = sendEmail

