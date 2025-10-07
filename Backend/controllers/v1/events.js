const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const validateEvent = require('../../middlewares/Validator');
const apiKeyAuth = require('../../middlewares/apiKey');
const jwtAuth = require('../../middlewares/jwtAuth'); 
const basicAuth = require('../../middlewares/basicAuth'); 


const Event = require('../../models/events');

function paginate(results, { page, limit }) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return {
        total: results.length,
        page,
        limit,
        data: results.slice(startIndex, endIndex)
    };
}


router.post('/', jwtAuth, validateEvent, (req, res) => { 
    Event.saveEvent({ id: uuidv4(), ...req.body }, (err, newEvent) => {
        if (err) {
            return res.status(500).json({ code: "500", message: "Error al crear evento" });
        }
        res.status(201).json({ code: "201", message: "Evento creado", data: { event: newEvent } });
    });
});


router.get('/', jwtAuth, (req, res) => { 
    Event.getAllEvents((err, events) => {
        if (err) {
            return res.status(500).json({ code: "500", message: "Error al listar eventos" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const paginated = paginate(events, { page, limit });
        res.status(200).json({ code: "200", message: "Eventos obtenidos", ...paginated });
    });
});


router.get('/:id', jwtAuth, (req, res) => { 
    Event.getEventById(req.params.id, (err, event) => {
        if (err) {
            return res.status(500).json({ code: "500", message: "Error al obtener evento" });
        }
        if (!event) {
            return res.status(404).json({ code: "404", message: "Evento no encontrado" });
        }
        res.status(200).json({ code: "200", message: "Evento obtenido", data: { event } });
    });
});


router.put('/:id', jwtAuth, validateEvent, (req, res) => { 
    Event.updateEvent(req.params.id, req.body, (err, updated) => {
        if (err) {
            return res.status(500).json({ code: "500", message: "Error al actualizar evento" });
        }
        if (!updated) {
            return res.status(404).json({ code: "404", message: "Evento no encontrado" });
        }
        res.status(200).json({ code: "200", message: "Evento actualizado", data: { event: updated } });
    });
});


router.delete('/:id', jwtAuth, (req, res) => { 
    Event.deleteEvent(req.params.id, (err, deleted) => {
        if (err) {
            return res.status(500).json({ code: "500", message: "Error al eliminar evento" });
        }
        if (!deleted) {
            return res.status(404).json({ code: "404", message: "Evento no encontrado" });
        }
        res.status(200).json({ code: "200", message: "Evento eliminado", data: { event: deleted } });
    });
});

module.exports = router;
