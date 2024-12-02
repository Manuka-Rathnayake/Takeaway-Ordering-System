import { Router } from "express";

const menuItemRoute = Router();

menuItemRoute.get('/all');
menuItemRoute.get('/:id');
menuItemRoute.post('/add');
menuItemRoute.put('/:id');
menuItemRoute.delete('/:id');
menuItemRoute.put('/addItem/:id'); // add ingredient to menu
menuItemRoute.put('/delItem/:id'); // delete ingredient from menu

menuItemRoute.get('table');
