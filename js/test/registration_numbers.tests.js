"use strict";
const assert = require('assert');
const pg = require('pg');
const Pool = pg.Pool;

let connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/registrations';
let useSSL = process.env.DATABASE_URL ? true : false;
const pool = new Pool({
  connectionString,
  ssl: useSSL
});


describe('Tests Registration Numbers application', function(){
  beforeEach(async function () {
    await pool.query('TRUNCATE reg_numbers');
  });
  it ('Should return true if the set registration number matches the expected (CA12312)', function(){
    let registr = Registration();
    await registr.reg('CA 12312');
    assert.equal(registr.regNumber(), 'CA 12312');
  });
  it ('Should return true if the set registration number matches the expected (CJ12312)', function(){
    let registration = Registration();
    await registration.reg('CJ 12312');
    assert.equal(registration.regNumber(), 'CJ 12312');
  });
  it ('Should return true if the set registration number matches the expected (CAW12312)', function(){
    let registration = Registration();
    registration.reg('CAW 12312');
    assert.equal(registration.regNumber(), 'CAW 12312');
  });
  it ('Should return true if the set registration number matches the expected (CL12312)', function(){
    let registration = Registration();
    registration.reg('CL 12312');
    assert.equal(registration.regNumber(), 'CL 12312');
  });
  it ('Should return false if the set registration number does not start with "CA", "CJ", "CAW" or "CL"', function(){
    // This should be false because the function will not record a (CG) registration
    let registration = Registration();
    registration.reg('CG12312');
    assert.notEqual(registration.regNumber(), 'CG12312');
  });
  it ('Should return the map with 2 set registration numbers ([CA12312, CAW12312])', function(){
    // This should be false because the function will not record a (CG) registration
    let registration = Registration();
    registration.reg('CA12312');
    registration.reg('CAW12312');
    assert.deepEqual(registration.registrations(), ['CA12312', 'CAW12312']);
  });
  it ('Should return the map with 2 set registration numbers; skips duplicates ([CA12312:0, CAW12312])', function(){
    let registration = Registration();
    registration.reg('CA12312');
    registration.reg('CA12312');
    registration.reg('CAW12312');
    console.log();
    assert.deepEqual(registration.registrations(), ['CA12312', 'CAW12312']);
  });
  it ('Should return the map with 3 registration numbers from external source ([CA 7234, CAW 0923, CL 2342])', function(){
    let externalData = ['CA 7234', 'CAW 0923', 'CL 2342'];
    //console.log(externalData);
    let registration = Registration(externalData);
    console.log(registration.registrations());
    assert.deepEqual(registration.registrations(), ['CA 7234', 'CAW 0923', 'CL 2342']);
  });

});
