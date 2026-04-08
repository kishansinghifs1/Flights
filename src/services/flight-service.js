const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");
const { FlightRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { compareTimes } = require("../utils/helpers/datetime-helpers");

const flightRepository = new FlightRepository();

async function createFlight(data) {
  try {
    // validation: arrival must be AFTER departure
    if (!compareTimes(data.arrivalTime, data.departureTime)) {
      throw new AppError(
        ["Arrival time must be greater than departure time"],
        StatusCodes.BAD_REQUEST,
      );
    }
    const flight = await flightRepository.create(data);
    return flight;
  } catch (error) {
    if (error.name == "SequelizeValidationError") {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });

      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Cannot create a flight object",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
async function getAllFlights(query) {
  let customerFilters = {};
  let sortFilter= [];
  const endingTriptime = "23:59:00";
  //trips=MUM_DEL
  if (query.trips) {
    const [departureAirportId, arrivalAirportId] = query.trips.split("-");
    // check if both airports are same
    if (departureAirportId === arrivalAirportId) {
      throw new AppError(
        ["Departure and arrival airports cannot be the same"],
        StatusCodes.BAD_REQUEST,
      );
    }
    customerFilters.departureAirportId = departureAirportId;
    customerFilters.arrivalAirportId = arrivalAirportId;
  }
  if (query.price) {
    [minPrice, maxPrice] = query.price.split("-");
    customerFilters.price = {
      [Op.between]: [
        minPrice,
        maxPrice == undefined ? Number.MAX_VALUE : maxPrice,
      ],
    };
  }
  if (query.travellers) {
    customerFilters.totalSeats = {
      [Op.gte]: query.travellers,
    };
  }
  if(query.tripDate){
    customerFilters.departureTime={
        [Op.between]: [query.tripDate, query.tripDate + " " + endingTriptime]
    };
}
if(query.sort){
   const params=query.sort.split(',');
   const sortFilters=params.map((param)=> param.split('_'));
    sortFilter=sortFilters;
}
  try {
    const flights = await flightRepository.getAllFlights(customerFilters);
    return flights;
  } catch (error) {
    throw new AppError(
      "Cannot fetch data of all the flights",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
async function getFlight(id){
    try{
        const flight=await flightRepository.get(id);
        return flight;
    } catch(error){
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('The flight you requested is not found',error.statusCode);
        }
        throw new AppError('Cannot fetch an flight with given id', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function updateSeats(data){
  try{
    const response=await flightRepository.updateRemainingSeats(data.flightId,data.seats,data.dec);
    return response;
  }catch(error){
    console.log(error);
    throw new AppError('Cannot update data of the flight', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function updateFlight(id, data) {
    try {
        const response = await flightRepository.update(id, data);
        return response;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('The flight you requested is not found',error.statusCode);
        }
        throw new AppError('Cannot update data of the flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
  createFlight,
  getAllFlights,
  getFlight,
  updateSeats,
  updateFlight
};
