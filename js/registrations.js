'use strict';
module.exports = function (pool) {
  var reg = "";
  var regList = {};

  async function setReg(num) {
    // validate input
    num = num.toUpperCase();
    if (!num.startsWith('CA') && !num.startsWith('CL') && !num.startsWith('CJ') && !num.startsWith('CAW')) {
      return false;
    }

    let result = await pool.query('SELECT * FROM reg_numbers WHERE reg_number=$1', [num])
    if (result.rowCount === 0) {
      let townTag = num.substring(0, 2).trim();
      let townID = await pool.query('SELECT id FROM towns WHERE town_tag=$1', [townTag]);
      result = await pool.query('INSERT INTO reg_numbers (reg_number, town) VALUES ($1, $2)', [num, townID.rows[0].id]);
      return true;
    }
  }

  async function getRegMap() {
    let result = await pool.query('SELECT reg_number FROM reg_numbers');
    return result.rows;
  }

  function filterByTown(town) {
    let regs = Object.keys(regList);

    if (town === 'all')
      return regs;

    let result = regs.filter(function (reg) {
      return reg.startsWith(town);
    });
    // location.hash = town;
    return result;
  }

  return {
    add: setReg,
    all: getRegMap,
    filterBy: filterByTown
  }
}

