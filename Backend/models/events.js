const Event = require('../schemas/events');


const getAllEvents = (callback) => { 
    return Event.findAllEvents(callback);
}

const getEventById = (id, callback) => {
    return Event.findEventById(id, callback);
}

const saveEvent = (event, callback) => {
    return Event.saveEvent(event, callback);
}

const updateEvent = (id, event, callback) => {
    return Event.updateEvent(id, event, callback);
}
const deleteEvent = (id, callback) => {
  return Event.deleteEvent(id, callback);
};

module.exports = {
    getAllEvents,
    getEventById,
    saveEvent,
    deleteEvent,
    updateEvent
}