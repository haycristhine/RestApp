var db;
var idTable = getUrlVars()["id"];
var allorders = [];

function init() {
    db = window.openDatabase("appDB", "1.0", "appDB", 200000);
    document.addEventListener("backbutton", show_MainPage, true);
    db.transaction(getTableName, transaction_error);
    db.transaction(getOrders, transaction_error);
}

function getOrders(tx) {
    var sql = "SELECT o.id, o.idTable, o.idMeal, o.amount, o.delivered, m.price, m.name FROM orders as o inner join meals as m on o.idMeal = m.id WHERE o.idTable = " + idTable;
    tx.executeSql(sql, [], getOrders_success);
}

function getOrders_success(tx, results) {
    var len = results.rows.length;
    for (var i=0; i < len; i++) {
    	var order = results.rows.item(i);
		$('#ordersList').append('<li id="' + order.id +'">' +
				'<img src=" ' + (order.delivered == 1 ? "img/checked.png" : "img/waiting.png") + '" class="list-icon"/>' +
				'<p class="line1">' + ("(" + order.amount.toString() + ") " + order.name) + '</p>' +
				'<p class="line2">' + ("Valor unitário: R$ " + parseFloat(order.price).toFixed(2).toString()) + '</p>' +
                '</li>');
        
        var obj = {
            id: order.id,
            status: order.delivered
        };
        
        allorders.push(obj);
    }
    
    updateButton();
	setOrderEvents();
}

    
function setOrderEvents() {
    
    $('#ordersList li').click(function(e) 
    { 
         e.preventDefault();
         var id = $(this).attr('id');
         db.transaction(function(tx){ updateOrder(tx,id) },transaction_error);
    });
    
    $('#ordersList li').bind('swiperight',function(){
        var idOrder = $(this).attr('id');
        navigator.notification.confirm(
        'Cancelar Pedido?',  
        function(button){onConfirm(button,idOrder)},             
        'Opções',            
        'Sim,Não'          
        );
    });
       
}


function onConfirm(button, idOrder){
    if (button == 1) {
        db.transaction(function(tx){cancel_order(tx,idOrder)}, transaction_error);
    }
}

function cancel_order(tx, idOrder) {
    var sql = "DELETE FROM orders WHERE orders.id = " + idOrder;
    var idNode = "#" + idOrder;
    tx.executeSql(sql);
    $(idNode).remove();
}


function updateOrder(tx, id) {
    
    var sql = "UPDATE orders SET delivered = CASE WHEN delivered = 0 THEN 1 ELSE 0 END WHERE id = " + id;
    
    var nodeId = "#" + id + " > img";
    var src = $(nodeId).attr('src').split('/')[1];
    
    switch(src.toString()) {
        case 'checked.png':
            $(nodeId).attr('src','img/waiting.png');
            updateOrder_local(id,0);
            break;
        case 'waiting.png':
            $(nodeId).attr('src','img/checked.png');
            updateOrder_local(id,1);
            break;
    } 
  
    updateButton();
    tx.executeSql(sql);

}

function getTableName(tx) {
    var sql = "SELECT * FROM tables WHERE id = " + idTable;
    tx.executeSql(sql, [], getTableName_success);
}

function getTableName_success(tx,results) {
    var table = results.rows.item(0);
    
    $('#tablename').html(table.name);
    
    $('#button1').click(function(e){
        e.preventDefault();
        window.location.replace(("newOrder.html?id=" + idTable));
    });
       
}

function show_MainPage() {
    window.location.replace("index.html");   
}

function transaction_error(tx, error) {
    alert("Ocorreu um erro inesperado");
}


function updateButton(){
    var button = $('#button2');
    button.unbind();
    
    if (canCheckout()) {
        button.attr('class','button');
        button.click(function(e){
            e.preventDefault();
            window.location.replace(("checkout.html?id=" + idTable));
        });
    } else {
        button.attr('class','button_disabled');
        button.click(function(e){
            e.preventDefault();
            navigator.notification.alert(
            'A mesa ainda não está pronta para checkout!',  
            '',
            'Atenção',
            'Ok'
            );
        });
    }
}


function updateOrder_local(id,value) {
   allorders.forEach(function(order){
        if (order.id == id) {
            order.status = value;
        }    
    }); 
}

function canCheckout() {
    var can = (allorders.length == 0 ? false:true);
    allorders.forEach(function(order){
        if (order.status == 0) {
            can = false;
        }    
    });
    return can;
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