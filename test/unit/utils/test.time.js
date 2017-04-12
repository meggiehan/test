"use strict";
import 'babel-polyfill';
import mocha from 'mocha';
import {
    getBeforedawnTime,
    timeDifference,
    centerShowTime,
    getDate,
    getDealTime,
    fishCarActiveTime
} from '../../../src/utils/time';
import chai from 'chai';

const {expect} = chai;
const Mocha = new mocha();
var suite = Mocha.suite;
var setup = Mocha.setup;
var suiteSetup = Mocha.suiteSetup;
var test = Mocha.test;
var teardown = Mocha.teardown;
var suiteTeardown = Mocha.suiteTeardown;

describe('时间工具模块测试', function() {

    /**
     * [最初始的显示多久前 几分钟之前/几小时之前/昨天/前天/x月x日]
     * @param  {Function} done [description]
     * @return {[string]}        [几分钟之前/几小时之前/昨天/前天/x月x日]
     */
    it('获取多久之前的文案方法测试:几分钟之前/几小时之前/昨天/前天/x月x日', function(done) {
        expect(timeDifference(new Date('2017/04/01').getTime() / 1000)).to.be.equal('4月1日');
        done();
    });

    /**
     * [多久前来过 刚刚来过/几小时之前/几天之前/一周前来过]
     * @param  {Function} done []
     * @return {[string]}      [刚刚来过/几小时之前/几天之前/一周前来过]
     */
    it('获取多久之前的文案方法测试:刚刚来过/几小时之前/几天之前/一周前来过', function(done) {
        expect(centerShowTime(new Date().getTime() / 1000)).to.be.equal('刚刚来过');
        done();
    });

    /**
     * [获取时间戳格式化后的时间 x年x月x日/x月x日 2:30]
     * @param  {Function} done [description]
     * @return {[string]}        [x年x月x日/x月x日 2:30]
     */
    it('获取格式化后的时间方法测试:x年x月x日', function(done) {
        expect(getDate(new Date('2017-03-20').getTime() / 1000)).to.be.equal('2017年3月20日');
        done();
    });

    it('获取多久之前的文案方法测试:x月x日 2:30', function(done) {
        expect(getDate(new Date('2017-03-20').getTime() / 1000, true)).to.be.equal('3月20日8:00');
        done();
    });

    /**
     * [根据时间戳获取距当前时间的活跃时间]
     * @param  {Function} done [description]
     * @return {[string]}        [刚刚活跃/今天活跃/昨天活跃/几天活跃/7天前活跃]
     */
    it('获取多久之前活跃的文案方法测试:刚刚活跃/今天活跃/昨天活跃/几天活跃/7天前活跃', function(done) {
        expect(fishCarActiveTime(new Date('2017-04-11').getTime() / 1000)).to.be.equal('昨天活跃');
        done();
    });

    /**
     * [获取当前时间的日期格式 x/x/x]
     * @param  {Function} done [description]
     * @return {[string]}        [2017/1/6]
     */
    it('获取当前时间的日期格式方法测试: 2017/1/6', function(done) {
        expect(getBeforedawnTime()).to.be.equal('2017/4/12');
        done();
    });

});
