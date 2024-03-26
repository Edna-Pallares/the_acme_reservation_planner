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
};

init();