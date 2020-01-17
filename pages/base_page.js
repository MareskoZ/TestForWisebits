const {By, until} = require('selenium-webdriver');
const data = require('../data/data');

waitTime = 150000;

const queryButtonXpath = '//button';

const Page = function (driver) {

    this.click = async (xpath) => {
        await driver.wait(until.elementLocated(By.xpath(xpath)), waitTime);
        await driver.findElement(By.xpath(xpath)).click();
    };

    this.openPageWaiter = async (url) => {
        await driver.wait(until.urlIs(url), waitTime);
    };

    this.openQueryPage = async () => {
        await driver.get(data.Url.queryPage);
        await this.openPageWaiter(data.Url.queryPage);
    };

    this.makeQueryWithResult = async (query) => {
        await driver.executeScript('window.editor.setValue("' + query + '")');
        await this.click(queryButtonXpath);
        await driver.wait(until.elementLocated(By.xpath('//table[@class="w3-table-all notranslate"]')), waitTime);
    };

    this.makeQueryWithOutResult = async (query) => {
        await driver.executeScript('window.editor.setValue("' + query + '")');
        await this.click(queryButtonXpath);
        await driver.sleep(1500); // coz if make query immediately row will not as added
    };

    this.page


};

module.exports = Page;
