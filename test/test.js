const base_page = require('../pages/base_page');
const {By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver');

const findAllQuery = "SELECT * FROM Customers;";
const findLondonQuery = "SELECT * FROM Customers WHERE city = 'London';";
const createRowQuery = "INSERT INTO Customers VALUES ('1111', '2222', '3333', '4444', '5555', '6666', '7777');";
const updateRowQuery = "UPDATE Customers SET CustomerName = 'new', ContactName = 'new', Address = 'new', City= 'new', PostalCode = 'new', Country = 'new' WHERE CustomerID = 1;"
const delete1stRowQuery = "DELETE FROM Customers WHERE CustomerID = 1;";
const get1stRowQuery = "SELECT * FROM Customers WHERE CustomerID = 1;";

describe('Test task', function() {
    let Page;
    let driver;
    this.timeout(200000);

    before(() => {
        let webdriver = require('selenium-webdriver');
        driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();
        Page = new base_page(driver);
    });

    after(() =>{
        driver.quit();
    })

    afterEach(() => {
        driver.manage().deleteAllCookies();
    })

    it('1. Вывести все строки таблицы *Customers* и убедиться, что запись с ContactName равной \'СGiovanni Rovelli\' имеет Address = \'Via Ludovico il Moro 22\'.\n', async () => {
        await Page.openQueryPage();
        await Page.makeQueryWithResult(findAllQuery);
        await driver.findElement(By.xpath("//td[contains(text(), 'Giovanni Rovelli')]"));
        let equalText = await driver.findElement(By.xpath("//td[contains(text(), 'Giovanni Rovelli')]/../td[4]")).getText();
        assert.equal(equalText, "Via Ludovico il Moro 22");
        console.log(equalText);
    });


    it('2. Вывести только те строки таблицы *Customers*, где city=\'London\'. Проверить, что в таблице ровно 6 записей.\n', async () => {
        await Page.openQueryPage();
        await Page.makeQueryWithResult(findLondonQuery);
        await driver.findElements(By.xpath('//table[@class="w3-table-all notranslate"]/tbody/tr')).then((vals) => {
            assert.equal(vals.length - 1, 6);
        });
        let scoreText = await driver.findElement(By.xpath('//div[@id="divResultSQL"]/div/div')).getText();
        assert(scoreText.includes("6"));
    });


    it('3. Добавить новую запись в таблицу *Customers* и проверить, что эта запись добавилась.\n', async () => {
        await Page.openQueryPage();
        await Page.makeQueryWithOutResult(createRowQuery);
        await Page.makeQueryWithResult(findAllQuery);

        await driver.findElement(By.xpath("//td[contains(text(), '1111')]"));
        await driver.findElement(By.xpath("//td[contains(text(), '2222')]"));
        await driver.findElement(By.xpath("//td[contains(text(), '3333')]"));
        await driver.findElement(By.xpath("//td[contains(text(), '4444')]"));
        await driver.findElement(By.xpath("//td[contains(text(), '5555')]"));
        await driver.findElement(By.xpath("//td[contains(text(), '6666')]"));
        await driver.findElement(By.xpath("//td[contains(text(), '7777')]"));
    });

    it('4. Обновить все поля (кроме CustomerID) в любой записи таблицы *Customers*и проверить, что изменения записались в базу.\n', async () => {

        await Page.openQueryPage();
        await Page.makeQueryWithOutResult(updateRowQuery);
        await Page.makeQueryWithResult(findAllQuery);

        await driver.wait(until.elementLocated(By.xpath('//table[@class="w3-table-all notranslate"]')), waitTime);
        await driver.sleep(1500);
        for(let i = 2; i < 7; i++){
            let text = await driver.findElement(By.xpath('//table[@class="w3-table-all notranslate"]/tbody/tr[2]/td['+ i +']')).getText()
            assert.equal(text, "new");
        }


    });

    it('5. Придумать собственный автотест и реализовать (тут все ограничивается только вашей фантазией).\n', async () => {
        await Page.openQueryPage();
        await Page.makeQueryWithOutResult(delete1stRowQuery);
        await Page.makeQueryWithOutResult(get1stRowQuery);

        await driver.findElement(By.xpath('//div[contains(text(), \'No result.\')]'))
    });
});

