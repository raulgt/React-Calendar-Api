const { Request, Response } = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = Response) => {
    try {
        const { email, password } = req.body;
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario asociado a ese correo.'
            })
        }

        // Encriptar contraseña

        usuario = new Usuario(req.body);
        const salt = await bcrypt.genSaltSync(12);
        usuario.password = await bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        return res.status(201).json(
            {
                ok: true,
                uid: usuario.id,
                name: usuario.name,
                token
            }
        )

    } catch (error) {
        console.log('CrearUsuario Error: ', error);
        return res.status(403).json(
            {
                ok: false,
                msg: 'Error: comuniquese con el administrador de la aplicacion.',
            }
        );
    }

}

const loginUsuario = async (req, res = Response) => {
    try {
        const { email, password } = req.body;
        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email.',
            })
        }

        const isCorrectPass = await bcrypt.compareSync(password, usuario.password);

        if (!isCorrectPass) {
            return res.status(400).json({
                ok: false,
                msg: 'email o password incorrecto, revise sus credenciales.',
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(200).json({
            ok: true,
            msg: 'Usuario validado..',
            token
        })

    } catch (error) {
        console.log('Login Error: ', error);
        return res.status(403).json(
            {
                ok: false,
                msg: 'Error: comuniquese con el administrador de la aplicacion.',
            }
        );
    }
}

const revalidarToken = async (req, res = Response) => {

    const uid = req.uid;
    const name = req.name;

    // Generar un nuevo JWT y retornarlo en esta peticion
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,       
        msg: 'renew',        
        token
    })
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};