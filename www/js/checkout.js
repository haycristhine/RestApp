var db;
var idTable = getUrlVars()["id"];

function init() {
    db = window.openDatabase("appDB", "1.0", "appDB", 200000);
    document.addEventListener("backbutton", show_TablePage, true);
    db.transaction(getTableName, transaction_error);
    db.transaction(getOrders, transaction_error);
}

function getOrders(tx) {
    var sql = "SELECT o.id, o.idTable, o.idMeal, o.amount, o.delivered, m.price, m.name FROM orders as o inner join meals as m on o.idMeal = m.id WHERE o.idTable = " + idTable;
    tx.executeSql(sql, [], getOrders_success);
}

function getOrders_success(tx, results) {
    var len = results.rows.length;
    var total = 0;
    for (var i=0; i < len; i++) {
    	var order = results.rows.item(i);
		$('#ordersList').append('<li id="' + order.id +'">' +
				'<p class="checkout1">' + ("(" + order.amount.toString() + ") " + order.name) + 
				'<spam class="checkout2">' + (" R$ " + (order.amount * parseFloat(order.price)).toFixed(2).toString()) + '</spam>' +
                '</p></li>');
        total += (order.amount * parseFloat(order.price));
    }
    
    $('#labeltotal').html("R$ " + total.toFixed(2).toString());
    
    $('#btnCheckout').click(function(e){
        e.preventDefault();
        navigator.notification.confirm(
        'Fazer Checkout?',  
         checkout,             
        'Checkout',            
        'Sim,Não'          
        );
    });
    
}

function checkout(button) {
    if (button == 1) {
        db.transaction(delete_orders,transaction_error);
    }
}

function delete_orders(tx) {
    var sql = "DELETE FROM orders WHERE idTable = " + idTable;
    tx.executeSql(sql);
    window.location.replace("index.html");
}

function getTableName(tx) {
    var sql = "SELECT * FROM tables WHERE id = " + idTable;
    tx.executeSql(sql, [], getTableName_success);
}

function getTableName_success(tx,results) {
    var table = results.rows.item(0);
    var href = "newOrder.html?id=" + table.id;
    
    $('#tablename').html(("Checkout " + table.name));
   
}

function show_TablePage() {
    window.location.replace(("tableDetails.html?id=" + idTable));   
}

function transaction_error(tx, error) {
	alert("Ocorreu um erro inesperado");
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