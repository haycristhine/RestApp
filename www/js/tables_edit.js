var db;
var idTable = getUrlVars()["id"];

function init() {
    db = window.openDatabase("appDB", "1.0", "appDB", 200000);
    document.addEventListener("backbutton", show_MainPage, true);
    db.transaction(getTableInfo, transaction_error);
}
  
function getTableInfo(tx) {
    var sql = "SELECT * FROM tables WHERE id = " + idTable;
    tx.executeSql(sql, [], getTableName_success);
}

function getTableName_success(tx,results) {
    var table = results.rows.item(0);
    
    $('#nameInput').val(table.name);
    $('#descriptionInput').html(table.description);
    
    $('#btnEditTable').click(function(e){
        e.preventDefault();
        db.transaction(edit_Table, transaction_error);
    });
       
}

function edit_Table(tx) {
    var sql = 'UPDATE tables SET name = "' + $('#nameInput').val() + '", description="' + $('#descriptionInput').val() +
        '" WHERE id =' + idTable;
    
    if ($('#nameInput').val() == '') {
        navigator.notification.alert(
            'Insira um nome para a mesa!',  
            '',
            'Atenção',
            'Ok'
        );
    } else {
        tx.executeSql(sql);
        show_MainPage();  
    }
}

function show_MainPage() {
    window.location.replace("index.html");   
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