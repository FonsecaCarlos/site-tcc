const helper = require('sendgrid').mail
const from_email = new helper.Email('carlos.fonseca@novaandradina.org')
const subject = 'Recuperar Senha'
const env = require('../../.env')

const emailService = (to, token) => {
    const to_email = new helper.Email(to)
    const content = new helper.Content('text/plain',
        `Seu Token para alterar sua senha é: ${token}`)
    const mail = new helper.Mail(from_email, subject, to_email, content)
    
    const sg = require('sendgrid')(env.SENDGRID_API_KEY)
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    })
    
    sg.API(request, function(error, response) {
      /*console.log(response.statusCode)
      console.log(response.body)
      console.log(response.headers)*/
    })
}

module.exports = emailService 