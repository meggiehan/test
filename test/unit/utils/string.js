import 'babel-polyfill';
import mocha from 'mocha';
import {
    getBeforedawnTime
} from'../../../src/utils/time';
import chai from 'chai';

const {
    expect,
} = chai;
const Mocha = new mocha();
var suite = Mocha.suite;
var setup = Mocha.setup;
var suiteSetup = Mocha.suiteSetup;
var test = Mocha.test;
var teardown = Mocha.teardown;
var suiteTeardown = Mocha.suiteTeardown;

// suite('Array', function () {
//     "use strict";
//     console.lo(12)
//
// });


describe('大模块测试1', function() {
    it('模块1', function() {
        expect(getBeforedawnTime()).to.be.equal('2017/3/22');
    });
});

describe('大模块测试2', function() {
    it('模块1', function() {
        expect(getBeforedawnTime()).to.be.equal('2017/3、22');
    });
});