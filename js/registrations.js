'use strict';
module.exports = function (pool) {

  var VALID_TAGS = ['all', 'CA', 'CL', 'CJ', 'CAW'];

  async function setReg(num) {
    // validate input
    num = num.toUpperCase();
    let townTag = num.substring(0, 3).trim();
    if (!num || num === '' || !VALID_TAGS.includes(townTag)) {
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
    let regs = await pool.query('SELECT reg_number FROM reg_numbers');
    return regs.rows;
  }

  async function getAllTags(tag) {
    let towns = await pool.query('SELECT town_name, town_tag FROM towns');
 
    for (let i = 0; i < towns.rowCount; i++) {
      let current = towns.rows[i];
      if (current.town_tag === tag) {
        current.selected = true;
      }
    }
    return towns.rows;
  }

  async function addNewTown(newTown) {

    if (VALID_TAGS.includes(newTown.tag)) {
      return false;
    }

    VALID_TAGS.push(newTown.tag);
    // see if it doesn't already exist in databse
    let result = await pool.query('SELECT id FROM towns WHERE town_tag=$1', [newTown.tag]);
    if (result.rowCount === 0) {
      await pool.query('INSERT INTO towns (town_name, town_tag) VALUES ($1, $2)', [
        newTown.name, newTown.tag
      ]);
      return true;
    }
    return false;
  }

  async function filterByTown(town) {

    if (!VALID_TAGS.includes(town)) {
      return false;
    }

    let result = await pool.query('SELECT reg_number, town FROM reg_numbers');
    if (town !== 'all') {
      console.log(result.rows);
      let foundTAG = await pool.query('SELECT id FROM towns WHERE town_tag=$1 limit 1', [town]);
      return result.rows.filter(current => current.town == foundTAG.rows[0].id);
    }
    return result.rows;
  }

  return {
    add: setReg,
    all: getRegMap,
    tags: getAllTags,
    addTown: addNewTown,
    filterBy: filterByTown
  }
}

