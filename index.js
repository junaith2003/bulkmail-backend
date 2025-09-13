import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

const app = express()

app.use(cors({
  origin: "https://bulkmail-six.vercel.app" // frontend URL
}));

app.use(express.json())

mongoose.connect("mongodb+srv://junaithakther01_db_user:Junaith2003%40@cluster0.ojdsro3.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("Success")
}).catch(() => { console.log("Failed") })

const credential = mongoose.model("credential", {}, "bulkmail")

app.post("/sendemail", (req, res) => {

    const msg = req.body.msg
    const emaillist = req.body.emailList

    credential.find().then((data) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });
        new Promise(async (resolve, reject) => {
            try {
                for (let i = 0; i < emaillist.length; i++) {
                    await transporter.sendMail({
                        from: "ngkjunaith@gmail.com",
                        to: emaillist[i],
                        subject: "A message from bulkmail app",
                        text: msg
                    })
                    console.log("Email sent to:" + emaillist[i])

                }
                resolve("Success")
            }
            catch (error) {
                reject("Failed")
            }

        }).then(() => {
            res.send(true)
        }).catch(() => {
            res.send(false)
        })
    }).catch((error) => { console.log(error) })


})

app.listen(8080, (req, res) => {
    console.log("Server Started...!")
})
