'use strict';
module.exports = function (pool) {

  var VALID_TAGS = ['CA', 'CL', 'CJ', 'CAW'];

  async function setReg(num) {
    // validate input
    num = num.toUpperCase();
    let townTag = num.substring(0, 2).trim();
    if (!num || num === '' || !VALID_TAGS.contains(townTag)) {
      return false;
    }

    let result = await pool.query('SELECT * FROM reg_numbers WHERE reg_number=$1', [num])
    if (result.rowCount === 0) {
      let townID = await pool.query('SELECT id FROM towns WHERE town_tag=$1', [townTag]);
      result = await pool.query('INSERT INTO reg_numbers (reg_number, town) VALUES ($1, $2)', [num, townID.rows[0].id]);
      return true;
    }
  }

  async function getRegMap() {
    let result = await pool.query('SELECT reg_number FROM reg_numbers');
    return result.rows;
  }

  async function filterByTown(town) {

    // if (!VALID_TAGS.contains(town)){
    //   return;
    // }
          
    let result = await pool.query('SELECT reg_number, town FROM reg_numbers');

    if (town !== 'all'){
      console.log(result.rows);
      let foundTAG = await pool.query('SELECT id FROM towns WHERE town_tag=$1', [town]);
      return result.rows.filter(current => current.town == foundTAG.rows[0].id);
    }
    
    return result.rows;
  }

  return {
    add: setReg,
    all: getRegMap,
    filterBy: filterByTown
  }
}

