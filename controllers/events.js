const { Response, Request } = require('express');
const Evento = require('../models/Evento');


const getEventos = async (req, res = Response) => {
    try {
        let events = await Evento.find({})
            .populate('user', 'name');
        res.status(200).json({
            ok: true,
            events,
            msg: 'getEventos.'
        })
    } catch (error) {

    }
}


const crearEvento = async (req, res = Response) => {
    const evento = new Evento(req.body);
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();

        res.status(200).json({
            ok: true,
            evento: eventoGuardado,
            msg: 'Evento fue guardado.'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador.'
        })
    }
}


const actualizarEvento = async (req, res = Response) => {
    try {
        const { id } = req.params;
        const eventToUpdate = await Evento.findById(id);

        if (!eventToUpdate) {
            return res.status(404).json({
                id: id,
                ok: false,
                msg: 'Evento no encontrado.'
            })
        }

        if (eventToUpdate.user.toString() !== req.uid) {
            return res.status(401).json({
                id: id,
                ok: false,
                msg: 'No tiene privilegio de editar este evento.'
            })
        }

        /*
        // One way to update using save()

        const { start, end, title } = req.body;
        eventToUpdate.start = start;
        eventToUpdate.end = end;
        eventToUpdate.title = title;
        await eventToUpdate.save();    
        */

        // Other way to update using findByIdAndUpdate

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(id, nuevoEvento, { new: true });

        res.status(200).json({
            id: id,
            ok: true,
            eventoActualizado,
            msg: 'Evento actualizado.'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador.'
        })
    }
}


const eliminarEvento = async (req, res = Response) => {

    try {
        const id = req.params?.id;

        if (!id) {
            return res.status(400).json({
                id,
                ok: false,
                msg: 'Error en parametro.'
            })
        }
  
        const exists = await Evento.exists({ _id: id });

        if (!exists) {
            return res.status(404).json({
                id,
                ok: false,
                msg: 'Evento no encontrado.'
            })
        }

        const eventoBorrado = await Evento.findByIdAndDelete(id);

        res.status(200).json({
            id,
            ok: true,
            evento: eventoBorrado,
            msg: 'eliminarEvento.'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            id,
            ok: false,
            msg: 'Contacte al administrator.'
        })
    }
}


module.exports = {
    actualizarEvento,
    crearEvento,
    eliminarEvento,
    getEventos
}








// {
//     ok: true,
//     msg: 'obtener eventos'
// }