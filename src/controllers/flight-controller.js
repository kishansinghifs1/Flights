const {StatusCodes}=require('http-status-codes');
const{FlightService}=require('../services');

const {ErrorResponse, SuccessResponse}=require('../utils/common');

/*
POST -> /flights -> createFlight
request body -> {flightNumber, airplaneId, departureAirportId, arrivalAirportId, departureTime, arrivalTime, price, boardingGate, totalSeats}
example request body -> {
    "flightNumber": "AI-202",
    "airplaneId": 1,
    "departureAirportId": 1,
    "arrivalAirportId": 2,
    "departureTime": "2023-12-01T10:00:00Z",
    "arrivalTime": "2023-12-01T14:00:00Z",
    "price": 5000,
    "boardingGate": "A1",
    "totalSeats": 180
 */
async function createFlight(req, res){
    try {
        const flight = await FlightService.createFlight({
              flightNumber:req.body.flightNumber,
                airplaneId:req.body.airplaneId,
                departureAirportId:req.body.departureAirportId,
                arrivalAirportId:req.body.arrivalAirportId,
                departureTime:req.body.departureTime,
                arrivalTime:req.body.arrivalTime,
                price:req.body.price,
                boardingGate:req.body.boardingGate,
                totalSeats:req.body.totalSeats
                });
        SuccessResponse.data = flight;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}
async function getAllFlights(req, res){
    try {
         console.log(req.query);
        const flights = await FlightService.getAllFlights(req.query);
        SuccessResponse.data = flights;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}
async function getFlight(req, res){
    try {
        const  flight= await FlightService.getFlight(req.params.id);
        SuccessResponse.data = flight;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}
async function updateSeats(req,res){
    try{
        const response =await FlightService.updateSeats({
            flightId: req.params.id,
            seats:req.body.seats,
            dec:req.body.dec
        });
         SuccessResponse.data = response;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    }catch(error){
        ErrorResponse.error = error;
        return res
        .status(error.statusCode)
        .json(ErrorResponse);
    }
}
async function updateFlight(req, res){
    try {
        const flight = await FlightService.updateFlight(req.params.id, req.body);
        SuccessResponse.data = flight;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}
async function destroyFlight(req, res){
    try {
        const response = await FlightService.destroyFlight(req.params.id);
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

module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateSeats,
    updateFlight,
    destroyFlight
}