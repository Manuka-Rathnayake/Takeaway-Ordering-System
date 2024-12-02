import { Router } from "express";

const ingredientsRoute = Router();

ingredientsRoute.get('all');
ingredientsRoute.post('add'); // add one ingredient
ingredientsRoute.get('/:id'); // get one ingredient
ingredientsRoute.put('/:id'); // update one ingredient
ingredientsRoute.delete('/:id'); // delete one ingredient
ingredientsRoute.get('table');

export default ingredientsRoute;
