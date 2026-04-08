const {Sequelize}= require('sequelize')

const CrudRepository = require('./crud-repository');
const { flight,Airplane,Airport,City }=require('../models');
const db =require('../models');
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
        const flightRow = await flight.findByPk(flightId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!flightRow) {
            throw new Error('Flight not found');
        }

        if (+dec) {
            await flightRow.decrement('totalSeats', { by: seats, transaction });
        } else {
            await flightRow.increment('totalSeats', { by: seats, transaction });
        }

        await transaction.commit();
        return flightRow;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        
    }
}
module.exports = FlightRepository;
