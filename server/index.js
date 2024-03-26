const { 
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    fetchReservations,
    destroyReservation
} = require('./db');

const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/customers', async(req, res, next)=> {
    try {
      res.send(await fetchCustomers());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/restaurants', async(req, res, next)=> {
    try {
      res.send(await fetchRestaurants());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/reservations', async(req, res, next)=> {
    try {
      res.send(await fetchReservations());
    }
    catch(ex){
      next(ex);
    }
  });

  app.delete('/api/reservations/:id', async(req, res, next)=> {
    try {
      await destroyReservation(req.params.id);
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });

  app.post('/api/reservations', async(req, res, next)=> {
    try {
      res.status(201).send(await createReservation(req.body));
    }
    catch(ex){
      next(ex);
    }
  });

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables created');
  const [mike, ean, lee, tacos, burgers, pizzas, pancakes] = await Promise.all([
    createCustomer('mike'),
    createCustomer('ean'),
    createCustomer('lee'),
    createRestaurant('tacos'),
    createRestaurant('burgers'),
    createRestaurant('pizzas'),
    createRestaurant('pancakes')
  ]);
  console.log(`mike has an id of ${mike.id}`);
  console.log(`tacos has an id of ${tacos.id}`);
  console.log(await fetchCustomers());
  console.log(await fetchRestaurants());
  await Promise.all([
    createReservation({ user_id: mike.id, place_id: tacos.id, reservation_date: '04/01/2024', party_count: 4}),
    createReservation({ user_id: ean.id, place_id: burgers.id, reservation_date: '04/15/2024', party_count: 3}),
    createReservation({ user_id: ean.id, place_id: pizzas.id, reservation_date: '07/04/2024', party_count: 2}),
    createReservation({ user_id: lee.id, place_id: pancakes.id, reservation_date: '10/31/2024', party_count: 4}),
  ]);
  console.log(await fetchReservations());

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> console.log('listening on port ${port}'));

};

init();