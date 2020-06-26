const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');//juice permet de faire fonctionner notre email sur n'importe quelle plateforme
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
const options  = require('../routes');
const transport = nodemailer.createTransport({// on récupère les informations de connexion a mailtrap via le fichier .env
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});
const generateHTML = (filename,options = {})=>{
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);// on crée l'html a partir de notre fichier pug 
    return html;
}
exports.send= async (options)=>{
    const html = generateHTML(options.filename, options);
    const mailOptions = {//on rentre les Options du mail 
    from:'Chris <chris@hotmail.fr>',// il s'agit de mon email ps: elle n'existe pas réelement 
    to: options.user.email,// ceci est l'email de l'utilisateur 
    subject: options.subject,
    html,
    text:'hey'
};
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
};