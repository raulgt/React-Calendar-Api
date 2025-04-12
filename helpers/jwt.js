const jwt = require('jsonwebtoken');

// uid and name of the user
const generarJWT = (uid, name) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, name };

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se puedo generar el token.');
            }
            resolve(token);
        });
    })
}

const revalidarJWT = (token) => {
    return new Promise((resolve, reject) => {
        try {
            const payload =  jwt.verify(token, process.env.SECRET_JWT_SEED);
            resolve(payload);
        } catch (error) {
            reject('No se puedo validar el token.');
        }     
    });
}

module.exports = {
    generarJWT,
    revalidarJWT
}