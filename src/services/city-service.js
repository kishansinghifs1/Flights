const { StatusCodes } = require('http-status-codes');
const {CityRepository}= require('../repositories');
const AppError = require('../utils/errors/app-error');


const cityRepository = new CityRepository();

async function createCity(data){
try {
        const city = await cityRepository.create(data);
        return city;
    } catch (error) {
        if(error.name == 'SequelizeValidationError'||error.name == 'SequelizeUniqueConstraintError'){
            let explanation = [];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a city object', StatusCodes.INTERNAL_SERVER_ERROR);
    }

}
async function deleteCity(cityId){
    try {
        const city = await cityRepository.destroy(cityId);
        return city;
    } catch (error) {
        throw new AppError('Cannot delete a city object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function updateCity(cityId, data){
    try {
        const city = await cityRepository.update(cityId, data);
        return city;
    } catch (error) {
        if(error.name == 'SequelizeValidationError'||error.name == 'SequelizeUniqueConstraintError'){
            let explanation = [];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot update a city object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getCities() {
    try {
        const cities = await cityRepository.getAll();
        return cities;
    } catch (error) {
        throw new AppError('Cannot fetch cities', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createCity,
    deleteCity,
    updateCity,
    getCities
};