import jwt from "jsonwebtoken"

const secret = "Resilient1804"
const command = process.argv[2]

if(command === 'create'){
    const expiresIn = {expiresIn: 60 * 60}
const payload = {
    id: 18,
    name: "Mukhtasar",
    role: "Student",
    studentId: 35533
}
const token = jwt.sign(payload,secret, expiresIn)
console.log({token})
}
else if (command === 'verify'){
    const token = process.argv[3]
    const decoded = jwt.verify(token, secret)
    console.log(decoded);
}
const expiresIn = {expiresIn: 60 * 60}
const payload = {
    id: 18,
    name: "Mukhtasar",
    role: "Student",
    studentId: 35533
}
const token = jwt.sign(payload,secret, expiresIn)

console.log({token});

function checkToken(token){
    const decoded = jwt.verify(token, secret)
    console.log(decoded);
    
}

setTimeout(() => {
    checkToken(token)
}, 5000);