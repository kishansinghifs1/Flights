const express=require('express');
const { FlightController }=require('../../controllers');
const { FlightMiddlewares }=require('../../middleware');

const router=express.Router();


// /api/v1/flights POST
router.post('/',
    FlightMiddlewares.validateCreateFlightRequest,
    FlightController.createFlight);
// /api/v1/flights?trips=MUM-DEL GET
router.get('/',
    FlightController.getAllFlights);
// /api/v1/flights/:id GET
router.get('/:id',FlightController.getFlight);
// /api/v1/flights/:id/seats PATCH
router.patch('/:id/seats',FlightMiddlewares.validateUpdateSeatsRequest,FlightController.updateSeats);
// /api/v1/flights/:id PATCH
router.patch('/:id',FlightController.updateFlight);
module.exports=router;