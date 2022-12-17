const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users refactored to use lightbnb database and SQL queries

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then(res => res.rows[0])
    .catch(err => null);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then(res => res.rows[0])
    .catch(err => null);
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *`, [user.name, user.email, user.password])
    .then(res => res.rows[0]);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
  SELECT reservations. *, properties. *, AVG(property_reviews.rating) as average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE end_date < now()::date
  AND reservations.guest_id = $1
  GROUP BY reservations.id, properties.id
  ORDER BY start_date
  LIMIT $2
  `, [guest_id, limit])
    .then(res => res.rows)
    .catch(err => {
      return null;
    });
};
exports.getAllReservations = getAllReservations;
  
// Properties refactored to use lightbnb database and SQL queries

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  // setup an array to hold any parameters that may be available for the query
  const queryParams = [];
  // start the query with all information that comes before the WHERE clause
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // make city dynamic
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  // if owner_id return properties beloning to that owner
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    if (queryParams.length > 0) {
      queryString += `AND owner_id LIKE $${queryParams.length} `;
    } else {
      queryString += `WHERE owner_id LIKE $${queryParams.length} `;
    }
  }

  // if minimum_price_per_night and maximum_price_per_night return properties within that price range
  if (options.minimum_price_per_night) {
    queryParams.push(parseInt(options.minimum_price_per_night) / 0.01);
    if (queryParams.length > 0) {
      queryString += `AND minimum_price_per_night >= $${queryParams.length} `;
    } else {
      queryString += `WHERE minimum_price_per_night >= $${queryParams.length} `;
    }
  }

  if (options.maximum_price_per_night) {
    queryParams.push(parseInt(options.maximum_price_per_night) / 0.01);
    if (queryParams.length > 0) {
      queryString += `AND maximum_price_per_night <= $${queryParams.length} `;
    } else {
      queryString += `WHERE maximum_price_per_night <= $${queryParams.length} `;
    }
  }

  // if minimum_rating return properties with rating equal or higher
  if (options.minimum_rating) {
    queryParams.push(parseFloat(options.minimum_rating) / 0.01);
    if (queryParams.length > 0) {
      queryString += `AND minimum_rating >= $${queryParams.length} `;
    } else {
      queryString += `WHERE minimum_rating >= $${queryParams.length} `;
    }
  }

  // query comes after WHERE clause
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // check to see if working
  console.log(queryString, queryParams);
  
  return pool.query(queryString, queryParams).then((res) => {
    return Promise.resolve(res.rows);
  });
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;