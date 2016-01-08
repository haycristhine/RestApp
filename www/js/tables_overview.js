var db;

function init() {
    $('#busy').show();
    document.addEventListener("backbutton", exit_App, true);
    db = window.openDatabase("appDB", "1.0", "appDB", 200000);    
	db.transaction(initDB, transaction_error, initDB_success);
    setMainButtonsEvents();
}

function transaction_error(tx, error) {
	$('#busy').hide();
    alert("Ocorreu um erro inesperado");
}

function initDB_success() {
    db.transaction(getTables, transaction_error);
}

function getTables(tx) {
  $('#busy').show();
  var sql = "SELECT t.id, t.name, t.description, SUM(CASE WHEN o.amount != 0 THEN o.amount ELSE 0 END) as [orders], SUM(CASE  WHEN o.delivered = 1 THEN o.amount ELSE 0 END) as [ordersdelivered] FROM tables as t left outer join orders as o on o.idTable = t.id group by t.id";
             
	tx.executeSql(sql, [], getTables_success);
}

function getMeals(tx){
  $('#busy').show();
  var sql = "SELECT * FROM meals";
  tx.executeSql(sql, [], getMeals_success);
}

function getTables_success(tx, results) {  
    $('#wrapper').empty();
    $('#wrapper').append('<ul id="tablesList" class="icon-list"></ul>');
    $('#btnmeals').attr('class','');
    $('#btntables').attr('class','selected');
    
    var len = results.rows.length;
    for (var i=0; i < len; i++) {
    	var table = results.rows.item(i);
		$('#tablesList').append('<li id="'+ table.id + '">' +
				'<img src=" ' + get_TableStatus(table.orders,table.ordersdelivered) + '" class="list-icon"/>' +
				'<p class="line1">' + table.name + '</p>' +
				'<p class="line2">' + table.description + '</p>' +
				'<span class="bubble">' + (table.orders - table.ordersdelivered) + '</span></li>');
    }
    
	setTimeout(function(){
		scroll.refresh();
	},100);
    
    setTableEvents();
    $('#busy').hide();
}

function getMeals_success(tx, results) {  
    $('#wrapper').empty();
    $('#wrapper').append('<ul id="mealsList" class="icon-list"></ul>');
    $('#btntables').attr('class','');
    $('#btnmeals').attr('class','selected');
    
    var len = results.rows.length;
    for (var i=0; i < len; i++) {
    	var meal = results.rows.item(i);
		$('#mealsList').append('<li id="'+ meal.id + '">' +
				'<p class="line1">' + meal.name + '</p>' +
				'<p class="line2">' + ("Valor unitário: R$ " + meal.price.toFixed(2)) + '</p>' +
				'</li>');
    }
    
	setTimeout(function(){
		scroll.refresh();
	},100);
    
    setMealsEvents();
    $('#busy').hide();
}

function setMealsEvents() {
    
    $('#mealsList li').bind('swiperight',function(){
        var idMeal = $(this).attr('id');
        navigator.notification.confirm(
        'Excluir Prato?',  
        function(button){onConfirm_meal(button,idMeal)},             
        'Opções',            
        'Sim,Não'          
        );
    });
    
    $('#mealsList li').bind('swipeleft',function(){
        var idMeal = $(this).attr('id');
        navigator.notification.confirm(
        'Editar Prato?',  
        function(button){edit_Meal(button,idMeal)},             
        'Opções',            
        'Sim,Não'          
        );
    });
       
}


function setTableEvents() {
    
    $('#tablesList li').click(function(e) 
    { 
         var id = $(this).attr('id');
         window.location.replace(("tableDetails.html?id=" + id));
    });
    
    $('#tablesList li').bind('swiperight',function(){
        var idTable = $(this).attr('id');
        navigator.notification.confirm(
        'Excluir Mesa?',  
        function(button){onConfirm_table(button,idTable)},             
        'Opções',            
        'Sim,Não'          
        );
    });
    
    $('#tablesList li').bind('swipeleft',function(){
        var idTable = $(this).attr('id');
        navigator.notification.confirm(
        'Editar Mesa?',  
        function(button){edit_Table(button,idTable)},             
        'Opções',            
        'Sim,Não'          
        );
    });
       
}

function edit_Table(button,idTable) {
    if (button == 1) {
        window.location.replace(("editTable.html?id=" + idTable));
    }
}

function edit_Meal(button,idMeal) {
   if (button == 1) {
        window.location.replace(("editMeal.html?id=" + idMeal));
    } 
}


function onConfirm_table(button, idTable){
    if (button == 1) {
        db.transaction(function(tx){deleteTable(tx,idTable)}, transaction_error);
    }
}

function onConfirm_meal(button, idMeal){
    if (button == 1) {
        db.transaction(function(tx){deleteMeal(tx,idMeal)}, transaction_error);
    }
}

function deleteTable(tx, idTable) {
    var sqlTable = "DELETE FROM tables WHERE tables.id = " + idTable;
    var sqlOrders = "DELETE FROM orders WHERE orders.idTable = " + idTable;
    var idNode = "#" + idTable;
    tx.executeSql(sqlTable);
    tx.executeSql(sqlOrders);
    $(idNode).remove();
}

function deleteMeal(tx,idMeal) {
    var sql = "DELETE FROM meals WHERE id NOT IN (SELECT o.idMeal FROM orders o) AND id =" + idMeal;
    var idNode = "#" + idMeal;
    tx.executeSql(sql, [], function(tx,results){deleteMeal_success(idNode,results)});
}

function deleteMeal_success(idNode,results) {
    if (results.rowsAffected < 1) {
        navigator.notification.alert(
           'Existem pedidos com esse prato e ele não pode ser excluído!',  
           '',
           'Erro',
           'Ok'
         );
    } else {
        $(idNode).remove();   
    }
}

function get_TableStatus(orders,delivered) {
    if (orders == 0) {
        return "img/available.png"; 
    } else if (orders > 0 && delivered != orders) {
        return "img/busy.png"; 
    } else {
        return "img/checkout.png";
    }   
}

function setMainButtonsEvents() {
    $('#button1').click(function(e){
        window.location.replace("newTable.html");
    });
    
    $('#button2').click(function(e){
        window.location.replace("newMeal.html"); 
    });
    
    $('#btntables').click(function(e){
        e.preventDefault(); 
        db.transaction(getTables, transaction_error);
    });
    
    $('#btnmeals').click(function(e){
        e.preventDefault(); 
        db.transaction(getMeals, transaction_error);
    });
    
}

function exit_App(){
    navigator.app.exitApp();
}

function initDB(tx) {
	var tables = 
		"CREATE TABLE IF NOT EXISTS tables ( " +
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"name VARCHAR(30)," +
        "description VARCHAR(50))";
    tx.executeSql(tables);
    
    var meals = 
        "CREATE TABLE IF NOT EXISTS meals ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "name VARCHAR(30)," +
        "price DECIMAL )";
     tx.executeSql(meals);
    
    var orders = 
        "CREATE TABLE IF NOT EXISTS orders (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "idMeal INTEGER NOT NULL, " +
        "idTable INTEGER NOT NULL, " +
        "amount INTEGER NOT NULL, " +
        "delivered BOOLEAN)";
    tx.executeSql(orders);
    
}
