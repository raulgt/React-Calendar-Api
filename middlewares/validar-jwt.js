const { response} = require('express');
const { revalidarJWT } = require('../helpers/jwt');


const validarJWT = async (req, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
      const payload = await revalidarJWT(token);

      req.uid = payload.uid;
      req.name = payload.name;  

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido.'
        })
    }
 
    next();
}

module.exports = {
    validarJWT
}