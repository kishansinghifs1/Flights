const express=require('express');
const { CityController }=require('../../controllers');
const { CityMiddlewares }=require('../../middleware');
const router=express.Router();


// /api/v1/City POST
router.post('/',
    CityMiddlewares.validateCreateCityRequest,
    CityController.createCity);
// /api/v1/City/:id DELETE
 router.delete('/:id', CityController.deleteCity);
// /api/v1/City/:id PUT
router.put('/:id', CityController.updateCity);
// /api/v1/City GET
router.get('/', CityController.getCities);

module.exports=router;