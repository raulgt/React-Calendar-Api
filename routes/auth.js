/*
 Rutas de Usuarios
 host + api/auth
 */
const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


router.post(
   '/new',
   [ // middlewares
      check('name', 'El nombre es obligatorio').notEmpty(),
      check('email', 'El email es obligatorio').isEmail(),
      check('password', 'El password es obligatorio y debe ser de 6 caracteres').isLength({ min: 6 }).isNumeric(),
      validarCampos
   ],
   crearUsuario);

router.post(
   '/',
   [
   check('email', 'El email es obligatorio').isEmail(),
   check('password', 'El password es obligatorio y debe ser de 6 caracteres').isLength({ min: 6 }).isNumeric(),
   validarCampos
   ],
   loginUsuario);

router.get(
   '/renew',
   [
      validarJWT
   ],
   revalidarToken   
);


module.exports = router;