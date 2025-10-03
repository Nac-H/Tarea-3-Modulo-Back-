/**let users = [{
    id: 1,
    name: 'Carlos',
    email: 'carlos@gmail.com',
    age: 20
}];
**/
    const { v4: uuidv4 } = require('uuid');
    const mongoose = require('mongoose');

    const eventSchema = new mongoose.Schema({
        id: {
            type: String,
            required: true,
            unique: true,
            default: uuidv4
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        Cantidad: {
            type: Number,
            required: true,
            min: 0.1,
            trim: true
        },
        Tipo: {
            type: String,
            required: true,
            enum: ['Ingreso', 'Egreso']
        },
        Fecha: {
            type: Date,
            required: true
        },
        description: {
            type: String,
            trim: true
        }
    });

    const Event = mongoose.model('event', eventSchema);

    const saveEvent = (event, callback) => {
        const {  name, Cantidad, Tipo, Fecha, description } = event;
        const newEvent = new Event({ name, Cantidad, Tipo, Fecha, description });
        // Guardamos en MongoDB
        newEvent.save()
        .then(() => {
            console.log('✅ Nuevo event creado!');
            return callback(null, newEvent);
        })
        .catch(err => {
            console.error(err);
            return callback(err);
        });
    }

    const findAllEvents = (callback) => {
        Event.find()
        .then(results => {
            console.log('📋 Todos los events:', results);
            return callback(null, results);
        })
        .catch(err => {
            console.error(err);
            return callback(err);
        });
    }

    const findEventById = (id, callback) => {
        Event.findOne({ id })
    .then(result => {
        console.log('🔍 Encontrado:', result);
        return callback(null, result);
    })
    .catch(err => {
        console.error(err);
        console.log('🔍 Error:', err);
        return callback(err);
    });
    }

    const updateEvent = (id, event, callback) => {
        Event.findOneAndUpdate({ id }, event, { new: true })
        .then(result => {
            console.log('🔍 Actualizado:', result);
            return callback(null, result);
        })
        .catch(err => {
            console.error(err);
            return callback(err);
        });
    }

const deleteEvent = (id, callback) => {
  Event.findOneAndDelete({ id })
    .then(result => callback(null, result))
    .catch(err => callback(err));
};
    module.exports = {
        Event,
        saveEvent,
        findAllEvents,
        findEventById,
        updateEvent,
        deleteEvent
    };
