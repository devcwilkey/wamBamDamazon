var mysql = require('mysql');
var inquirer = require('inquirer');
var badProductMax = 5;

var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "nodeuser",
    password: "FSFW3BFSF",
    database: "wambamdam_db"
});

function clearScreen(){
    process.stdout.write('\033c')
    console.log("\n\n");
};

function searchAllProducts(){
    var products = [];
    var query = connection.query(
        "SELECT product_id,product_name, department_name, stock_quantity, product_price FROM products ORDER BY department_name, product_id",function(err,res){
            if(err) throw err;
            for(i=0;i<res.length; i++){
                var tempObj = {
                    product_id: res[i]["product_id"],
                    product_name : res[i]["product_name"],
                    department_name : res[i]["department_name"],
                    stock_quantity : res[i]["stock_quantity"],
                    product_price : res[i]["product_price"]
                };
                products.push(tempObj);
                //console.log("product_id: "+ tempObj["item_id"] + " Product Name: " + tempObj["product_name"]+ " Department Name: " + tempObj["department_name"] + " Stock Quantity: " + tempObj["stock_quantity"] + "Product Price: " + tempObj["product_price"]);
            }
            
            var wamBamDamazonLogo = " ...............................................................................................................................................\n"+
            " :'##:::::'##::::'###::::'##::::'##:'########:::::'###::::'##::::'##:'########:::::'###::::'##::::'##::::'###::::'########::'#######::'##::: ##:\n"+
            " : ##:'##: ##:::'## ##::: ###::'###: ##.... ##:::'## ##::: ###::'###: ##.... ##:::'## ##::: ###::'###:::'## ##:::..... ##::'##.... ##: ###:: ##:\n"+
            " : ##: ##: ##::'##:. ##:: ####'####: ##:::: ##::'##:. ##:: ####'####: ##:::: ##::'##:. ##:: ####'####::'##:. ##:::::: ##::: ##:::: ##: ####: ##:\n"+
            " : ##: ##: ##:'##:::. ##: ## ### ##: ########::'##:::. ##: ## ### ##: ##:::: ##:'##:::. ##: ## ### ##:'##:::. ##:::: ##:::: ##:::: ##: ## ## ##:\n"+
            " : ##: ##: ##: #########: ##. #: ##: ##.... ##: #########: ##. #: ##: ##:::: ##: #########: ##. #: ##: #########::: ##::::: ##:::: ##: ##. ####:\n"+
            " : ##: ##: ##: ##.... ##: ##:.:: ##: ##:::: ##: ##.... ##: ##:.:: ##: ##:::: ##: ##.... ##: ##:.:: ##: ##.... ##:: ##:::::: ##:::: ##: ##:. ###:\n"+
            " :. ###. ###:: ##:::: ##: ##:::: ##: ########:: ##:::: ##: ##:::: ##: ########:: ##:::: ##: ##:::: ##: ##:::: ##: ########:. #######:: ##::. ##:\n"+
            " :...::...:::..:::::..::..:::::..::........:::..:::::..::..:::::..::........:::..:::::..::..:::::..::..:::::..::........:::.......:::..::::..:::";

            console.log(wamBamDamazonLogo);
            console.log("\n")
            console.table(products);
            console.log("\n\n")
            purchaseQuestions(products);
        }
    );
    connection.end();
    return;
}

function purchaseQuestions(products){
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Using the Table Above, type the full 'product_id' including zero's of the item you would like to purchase?",
            validate : function(input){
                var verifyProduct = findObjectByKey(products,'product_id', input);
                if(verifyProduct){
                    return true;
                } else {
                    return "Invalid 'product_id' provided, please enter a valid one from the Table above";
                }
            }
        }
    ]).then(
        function(answers){
            var staleProductInfo = findObjectByKey(products,'product_id', answers.item);
            var cleanProductInfo = staleProductInfo.product_id + " - " + staleProductInfo.product_name;
            //stockpurchaseQuestions(cleanProductInfo);
            console.log("Broken");
            inquirer.prompt([
                {
                    name: "stockQTY",
                    type: "number",
                    message: "Please enter the total Number of Items you would like to purcahse: ",
                    validate : function (fixMyBrokenValue){
                        console.log(fixMyBrokenValue)
                        if(!fixMyBrokenValue){
                            return "Blank - Please input a Valid Number";
                        } else {
                            if(isNaN(fixMyBrokenValue)){
                                return "Letter - Please input a Valid Number...";
                            } else {
                                return true;
                            }
                        }
                    },
                    keepAnswerOnValidationError : true
                }
            ]).then(
                function(answers){
                    console.log(answers.stockQTY);
                }
            )
        }
    );
}

function stockpurchaseQuestions(productInfo){
    inquirer.prompt([
        {
            name: "purchaseCount",
            type: "number",
            message: "How many " + productInfo + " would you like to purchase?"
        }
    ]).then(function(answers){
            var verifyPurchaseCount = areYouSureQuestions("stock",answers.purchaseCount);
            console.log(verifyPurchaseCount);
        }
    );
}

function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
};

function areYouSureQuestions(type, info){
    var userMessage = "";
    switch(type){
        case "purchase":
            userMessage = "Are you sure '" + info + "' is the item you want to purchase?";
            break;
        case "stock":
            userMessage = "Are you sure you would like to purchase " + info + "item(s)?";
            break;
    }
    inquirer.prompt([
        {
            name: "simpleRUSure",
            type: "confirm",
            message: userMessage,
            default: true
        }
    ]).then(
        function(answers){
            return answers.simpleRUSure;
        }
    );
}

//Start of Actual Customer Application
clearScreen()
searchAllProducts();

