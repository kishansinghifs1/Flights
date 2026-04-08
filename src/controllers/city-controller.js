const {StatusCodes}=require('http-status-codes');
const{CityService}=require('../services');

const {ErrorResponse, SuccessResponse}=require('../utils/common');

/*
POST -> /cities -> createCity
request body -> {name: 'London'}
 */
async function createCity(req, res){
    try {
        const city = await CityService.createCity({
            name: req.body.name
        });
        SuccessResponse.data = city;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}
async function getCities(req, res){
    try {
        const cities = await CityService.getCities();
        SuccessResponse.data = cities;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}
async function deleteCity(req, res){
    try {
        const response = await CityService.deleteCity(req.params.id);
        SuccessResponse.data = response;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}
async function updateCity(req, res){
    try {
        const city = await CityService.updateCity(req.params.id, req.body);
        SuccessResponse.data = city;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}



module.exports = {
    createCity,
    deleteCity,
    updateCity,
    getCities
}