const { SendMailClient } = require("zeptomail");
const url = "api.zeptomail.com/";
const token = process.env.ZEPTO_MAIL_API_KEY
const emailText = require('../json/emails.json')
const { resetPassword, contactUs, register } = require('./emailTemplates')

let client = new SendMailClient({ url, token });
//sendEmail("karmen.tanaka@gmail.com", "Karmen", "PASSWORD_RESET", "EN", "www.pebblescommunity.com", "testing email")
function sendForgotPassword(to, name, type, lang, link = '', ...extras) {
    const text = emailText[type][lang].SUBJECT


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
        "subject": text,
        "htmlbody": resetPassword(to, name, type, lang, link, ...extras),
    }).then((resp) => console.log("success")).catch((error) => console.log("error", error));

}

function sendRegister(to, name, type, lang) {
    const text = emailText[type][lang].SUBJECT
    const domain = process.env.DOMAIN_URL

    console.log('in send registration', to, name, type, lang)
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
        "subject": text,
        "htmlbody": register(name, lang, domain),
    }).then((resp) => console.log("success")).catch((error) => console.log("error", error));

}


function sendToUs(data) {
    const { name, subject, email, msg } = data
    console.log('in emailing', name, subject, email, msg)
    to = "karmen.tanaka@gmail.com"

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
                        "name": 'PC'
                    }
                }
            ],
        "subject": "Comment from contact us page",
        "htmlbody": contactUs(to, name, subject, email, msg),
    }).then((resp) => console.log("success")).catch((error) => console.log("error", error));

}
// sendEmailWithTemplate()
// function sendEmailWithTemplate() {
//     client.sendMailWithTemplate({
//         "template_key": "2d6f.79391a66266a0467.k1.317d1ac0-0419-11ee-b904-5254004d4100.1888eb9166c",
//         "template_alias": "forgotpassworden",
//         "bounce_address": "bounced@bounce.pebblescommunity.com",
//         "from": {
//             "address": "info@pebblescommunity.com",
//             "name": "Pebbles Community"
//         },
//         "to": [
//             {
//                 "email_address": {
//                     "address": "karmen.tanaka@gmail.com",
//                     "name": "Karmen"
//                 }
//             }
//         ],

//         "merge_info": {
//             "name": "Karmen",
//             "username": "ktoo",
//             "team": "Pebble Team",
//             "password_reset_link": "www.pebblescommunity.com"
//         },
//         "reply_to": [
//             {
//                 "address": "info@pebblescommunity.com",
//                 "name": "Pebbles"
//             }
//         ],
//         "mime_headers": {
//             "X-Test": "test"
//         }
//     }).then((resp) => console.log("success")).catch((error) => console.log("error", error));

// }

module.exports = { sendForgotPassword, sendToUs, sendRegister }

