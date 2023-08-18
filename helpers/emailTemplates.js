const emailText = require('../json/emails.json')

function register(name, lang, domain) {

    const link = `${domain}/${emailText.REGISTERED[lang].TEXT3_LINK}`
    const x = (`
        <table cellspacing="0" cellpadding="0" style="background-color: #F2F2F2; border: 1px solid #eee; width: 100%;">
    <tbody>
        <tr>
            <td>
                <div
                    style="background-color: #fff; border: 1px solid #eee; border-bottom: 4px solid #027EE6; box-sizing: border-box; 
                    font-family: Lato, Helvetica, 'Helvetica Neue', Arial, 'sans-serif'; padding: 40px ; margin: 0px auto; max-width: 600px; 
                    overflow: hidden; width: 600px;">
                    <div
                        style="display: flex; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">
                        <div style="height: 40px; "><br></div>
                        <h4 style="font-weight: normal; font-size: 24px; margin: 0;">Pebbles Community<br></h4>
                    </div>
                    <h2 style="color: #253745; font-size: 20px; font-weight: normal; margin: 0; margin-bottom: 30px;">${emailText.REGISTERED[lang].WELCOME}
                        ${name},<br></h2>
                    <p style="margin: 0px 0px 30px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px 0px 30px; 
                        line-height: 22px;">${emailText.REGISTERED[lang].TEXT1}
                        </span></span><br>
                    </p>
                    <p style="margin: 0px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">
                        ${emailText.REGISTERED[lang].TEXT2} </span></span><br>
                    </p><br>
                    
                    <p style="margin: 0px; line-height: 22px;">
                    <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">
                    ${emailText.REGISTERED[lang].TEXT3}</span></span>
                    </p>
                   
                    
                    <div><a href=${link}
                            style="border: none; border-radius: 4px; color: #fff; cursor: pointer; display: inline-block; font-size: 16px; 
                            padding: 15px 30px; background-color: #027EE6; text-align:center; text-decoration: none; margin: 25px 0;">${emailText.REGISTERED[lang].TEXT3_LINK_TEXT_TITLE}</a> <br></div>
                    <p style="margin: 0px 0px 30px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px 0px 30px; 
                        line-height: 22px;">${emailText.REGISTERED[lang].QUESTION}</span></span><br>
                    </p>
                    <p style="margin: 0px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">
                        ${emailText.REGISTERED[lang].SIGNOFF} </span></span><br>
                    </p>
                    <p style="margin: 0px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">
                        Pebbles Community Team</span></span><br>
                    </p>
                </div>
            </td>
        </tr>
    </tbody>
</table>
<div><br></div>`
    )
    console.log(x)
    return x
}

function resetPassword(to, name, type, lang, link, ...extras) {


    const x = (`
        <table cellspacing="0" cellpadding="0" style="background-color: #F2F2F2; border: 1px solid #eee; width: 100%;">
    <tbody>
        <tr>
            <td>
                <div
                    style="background-color: #fff; border: 1px solid #eee; border-bottom: 4px solid #027EE6; box-sizing: border-box; 
                    font-family: Lato, Helvetica, 'Helvetica Neue', Arial, 'sans-serif'; padding: 40px ; margin: 0px auto; max-width: 600px; 
                    overflow: hidden; width: 600px;">
                    <div
                        style="display: flex; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">
                        <div style="height: 40px; "><br></div>
                        <h4 style="font-weight: normal; font-size: 24px; margin: 0;">Pebbles Community<br></h4>
                    </div>
                    <h2 style="color: #253745; font-size: 20px; font-weight: normal; margin: 0; margin-bottom: 30px;">Hi
                        ${name},<br></h2>
                    <p style="margin: 0px 0px 30px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px 0px 30px; 
                        line-height: 22px;">You have requested for a password reset for your Pebbles Community account with the login 
                        <b>${name}.</b></span></span><br>
                    </p>
                    <p style="margin: 0px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">
                        Click on the below link to reset your password.</span></span><br>
                    </p>
                    <div><a href=${link}
                            style="border: none; border-radius: 4px; color: #fff; cursor: pointer; display: inline-block; font-size: 16px; padding: 15px 30px; background-color: #027EE6; text-decoration: none; margin: 25px 0;">Password
                            Reset</a> <br></div>
                    <p style="margin: 0px 0px 30px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px 0px 30px; 
                        line-height: 22px;">This link will only be valid for the next <b>15 minutes.</b> 
                        If you did not initiate the password reset, ignore this email.</span></span><br>
                    </p>
                    <p style="margin: 0px 0px 30px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px 0px 30px; 
                        line-height: 22px;">If you need additional support, please reply to this email.</span></span><br>
                    </p>
                    <p style="margin: 0px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">
                        Thank you,</span></span><br>
                    </p>
                    <p style="margin: 0px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">
                        Pebbles Community Team</span></span><br>
                    </p>
                </div>
            </td>
        </tr>
    </tbody>
</table>
<div><br></div>`
    )
    console.log(x)
    return x
}

function contactUs(to, name, subject, email, msg) {

    const x = (`
        <table cellspacing="0" cellpadding="0" style="background-color: #F2F2F2; border: 1px solid #eee; width: 100%;">
    <tbody>
        <tr>
            <td>
                <div
                    style="background-color: #fff; border: 1px solid #eee; border-bottom: 4px solid #027EE6; box-sizing: border-box; 
                    font-family: Lato, Helvetica, 'Helvetica Neue', Arial, 'sans-serif'; padding: 40px ; margin: 0px auto; max-width: 600px; 
                    overflow: hidden; width: 600px;">
                    <div
                        style="display: flex; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">
                        <div style="height: 40px; "><br></div>
                        <h4 style="font-weight: normal; font-size: 24px; margin: 0;">Pebbles Community<br></h4>
                    </div>
                    <h2 style="color: #253745; font-size: 20px; font-weight: normal; margin: 0; margin-bottom: 30px;">Hi
                        Karmen,<br></h2>
                    <p style="margin: 0px 0px 30px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px 0px 30px; 
                        line-height: 22px;">You have a comment from 
                        <b>${name}.</b></span></span><br>
                    </p>
                    <p style="margin: 0px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">
                        Their email is: ${email}</span></span><br>
                    </p>
                    <p style="margin: 0px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">
                        Subject: ${subject}</span></span><br>
                    </p>
                    <p style="margin: 0px; line-height: 22px;">
                    <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">
                    Message: ${msg}</span></span><br>
                </p>
                    <p style="margin: 0px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">
                        Reply soon!</span></span><br>
                    </p>
                    
                    <p style="margin: 0px; margin-top:22px; line-height: 22px;">
                        <span class="colour" style="color:rgb(37, 55, 69)"><span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">
                        Me</span></span><br>
                    </p>
                </div>
            </td>
        </tr>
    </tbody>
</table>
<div><br></div>`
    )
    console.log(x)
    return x
}

module.exports = { resetPassword, contactUs, register } 