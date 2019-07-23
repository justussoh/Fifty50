const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const firebase = require('firebase');
const express =require('express');
const bodyParser =require('body-parser');
const nodemailer =require('nodemailer');

// load values from the .env file in this directory into process.env
dotenv.config({ path: 'process.env' });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('/api/share', (req, res)=>{
    const htmlEmail = `
        <h3>Dear Friend</h3><br/>
        <p>You have been invited to answer the following poll</p>
        <p>Poll Link: <a href=${req.body.url}>${req.body.url}</a>></p><br/>
        <h4>Message</h4>
        <p>${req.body.message}</p>
        <h4>Thank You!</h4><br />
        <br/>
        <h3>Best Regards</h3>
        <h3>Fifty50</h3>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_GOOGLE,
            pass: process.env.GOOGLE_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_GOOGLE,
        to: req.body.emailList,
        subject: "Help us to answer this poll",
        html: htmlEmail,
    };

    transporter.sendMail(mailOptions, (err,info)=>{
        if(err){
            console.log(err)
        }
        console.log('Message has been sent.', info)
    })
});

app.post('/api/contact', (req, res)=>{
    const htmlEmail = `
        <h3>Dear Clara/Justus</h3><br/>
        <p>Someone has contacted you</p>
        <p>The details are as follows:</p><br/>
        <h4>Name</h4>
        <p>${req.body.name}</p>
        <h4>Email</h4>
        <p>${req.body.email}</p>
        <h4>Contact</h4>
        <p>${req.body.contact}</p>
        <h4>Message</h4>
        <p>${req.body.message}</p>
        <h4>Thank You!</h4><br />
        <br/>
        <h3>Best Regards</h3>
        <h3>Fifty50</h3>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_GOOGLE,
            pass: process.env.GOOGLE_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_GOOGLE,
        to: process.env.EMAIL_GOOGLE,
        subject: "Someone Contacted You",
        html: htmlEmail,
    };

    transporter.sendMail(mailOptions, (err,info)=>{
        if(err){
            console.log(err)
        }
        console.log('Message has been sent.', info)
    })
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
   console.log(`Server listening on port ${PORT}`)
});

// configure firebase
firebase.initializeApp({
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const database = firebase.database();

// configure algolia
const algolia = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
);
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);

const contactsRef = database.ref('polls');
contactsRef.on('child_added', addOrUpdateIndexRecord);
contactsRef.on('child_changed', addOrUpdateIndexRecord);
contactsRef.on('child_removed', deleteIndexRecord);

function addOrUpdateIndexRecord(contact) {
    // Get Firebase object
    const record = contact.val();
    if (record.hasOwnProperty('imgSrc')){
        record.imgSrc = '';
    }
    // Specify Algolia's objectID using the Firebase object key
    record.objectID = contact.key;
    // Add or update object
    index
        .saveObject(record)
        .then(() => {
            console.log('Firebase object indexed in Algolia', record.objectID);
        })
        .catch(error => {
            console.error('Error when indexing contact into Algolia', error);
            process.exit(1);
        });
}

function deleteIndexRecord({key}) {
    // Get Algolia's objectID from the Firebase object key
    const objectID = key;
    // Remove the object from Algolia
    index
        .deleteObject(objectID)
        .then(() => {
            console.log('Firebase object deleted from Algolia', objectID);
        })
        .catch(error => {
            console.error('Error when deleting contact from Algolia', error);
            process.exit(1);
        });
}

