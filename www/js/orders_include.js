var db;
var idTable = getUrlVars()["id"];

function init() {
    db = window.openDatabase("appDB", "1.0", "appDB", 200000);
    document.addEventListener("backbutton", show_PreviousPage, true);
    document.getElementById("btnNewTable").addEventListener("click", addOrder, false);
    db.transaction(get_Meals,transaction_error);
}

function get_Meals(tx) {
    var sql = "SELECT * FROM meals";
    tx.executeSql(sql, [], populate_Select);
}

function populate_Select(tx,results) {
    var len = results.rows.length;
    for (var i=0; i < len; i++) {
    	var meal = results.rows.item(i);
        var option = '<option value="' + meal.id + '">' + meal.name + ' (R$ ' + meal.price.toFixed(2) + ')</option>';
        $('#mealinput').append(option);
    }
}

function addOrder() {
    db.transaction(newOrder,transaction_error);
}

function newOrder(tx) {
    var idMeal = $('#mealinput option:selected').val();
    var amount = $('#amountinput').val();
    
    if (idMeal == "placeholder") {
        navigator.notification.alert(
            'Selecione um prato',  
            '',
            'Atenção',
            'Ok'
        );
    } else if (amount == "") {
        navigator.notification.alert(
            'Indique a quantidade de pratos',  
            '',
            'Atenção',
            'Ok'
        );
    } else {
        var sql = 'INSERT INTO orders (idTable,idMeal,amount,delivered) VALUES (' + idTable + ',' + idMeal + ',' + amount + ',0)';
        tx.executeSql(sql);
        show_PreviousPage();
    }
    
}


function show_PreviousPage(){
    window.location.replace(("tableDetails.html?id=" + idTable));  
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function transaction_error(tx, error) {
    alert("Ocorreu um erro inesperado");
}