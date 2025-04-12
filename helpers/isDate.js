const moment = require('moment');

const isDate = (value) => {
    //console.log(value);
    if (!value) {
        return false;
    }

     const fecha = moment(value, 'YYYY-MM-DD', true);
    //const fecha = moment(value);

    if (fecha.isValid()) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    isDate
}