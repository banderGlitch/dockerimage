import fs from 'fs';
import { resolve } from 'path';

// callback hell 
fs.readFile('file1.txt', 'utf8', (err, data1) => {
    if (err) return console.error(err);

    fs.readFile('file2.txt', 'utf8', (err, data2) => {
        if (err) return console.error(err);

        fs.readFile('file3.txt', 'utf8', (err, data3) => {
            if (err) return console.error(err);

            console.log(data1, data2, data3);
        });
    });
});

// We can fix it by using something called as
// Promises 
// async/await 


// validate my user
function validateUser(user) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("User validated");
            resolve(user)
        }, 1000)
    })
}


// saving the user to database

function saveToDatabase(user) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("User saved to DB");
            resolve({ id: 1, ...user });
        }, 1000);
    })
}


// Sending the confirmation emial to the user


function sendEmail(user) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Email sent to", user.name);
            resolve(true);
        }, 1000);
    });
}



// cleaner with Promises

validateUser({ name: 'Deori' })
    .then(saveToDatabase)
    .then(sendEmail)
    .then(() => console.log("All done"))
    .catch((err) => console.error(err));

// More advance technique async await

async function handleSignup() {
    try {

        const user = await validateUser({name: 'Deori'})
        const savedUser = await saveToDatabase(user)
        await sendEmail(savedUser);
        console.log("All done 🎉");
    } catch(err) {
        console.log("err",err)
    }
}


handleSignup()



