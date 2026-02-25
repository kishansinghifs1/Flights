const {Sequelize}= require('sequelize')

const CrudRepository = require('./crud-repository');
const { flight,Airplane,Airport,City }=require('../models');
const db =require('../models');
const {addRowLockOnFlights}=require('./queries');
class FlightRepository extends CrudRepository{
    constructor(){
        super(flight);
    }
    async getAllFlights(filter,sort){
        const response=await flight.findAll({
            where:filter,
            order:sort,
            //include tells Sequelize to join 
            // another model (table) with your main query.{eager loading}
            include:[
                {
               model: Airplane,
               required :true,
               as:'airplaneDetail'
            },
            {
                model:Airport,
                required:true,
                as:'departureAirport',
                on:{
                   col1:Sequelize.where(Sequelize.col("flight.departureAirportId"),"=",Sequelize.col("departureAirport.code")) 
                },
                include:{
                    model:City,
                    required:true
                }
            },
            {
                model:Airport,
                required:true,
                as:'arrivalAirport',
                on:{
                   col1:Sequelize.where(Sequelize.col("flight.arrivalAirportId"),"=",Sequelize.col("arrivalAirport.code")) 
                },
                include:{
                    model:City,
                    required:true
                }
            }
            ]
        });
        return response;
    }
    async updateRemainingSeats(flightId,seats,dec=true){
        const transaction =await db.sequelize.transaction();
        try {
            await db.sequelize.query(addRowLockOnFlights(flightId));//row lock for us if any update we want to do
        const Flight=await flight.findByPk(flightId);
        if(+dec){
        await Flight.decrement('totalSeats',{by:seats},{transaction:transaction});          
        }else{
        await Flight.increment('totalSeats',{by:seats},{transaction:transaction});     
        }
        await transaction.commit;
         return Flight;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        
    }
}
module.exports = FlightRepository;
