var db;

function init() {
    db = window.openDatabase("appDB", "1.0", "appDB", 200000);
    document.getElementById("btnNewTable").addEventListener("click", addTable, false);
    document.addEventListener("backbutton", show_MainPage, true);
}

function addTable () {
    db.transaction(insertTable, transaction_error);
}

function insertTable(tx) {
    var name = $('#nameInput').val();
    var description = $('#descriptionInput').val();
    
    if (name == '') {
        navigator.notification.alert(
            'Insira um nome para a mesa!',  
            '',
            'Atenção',
            'Ok'
        );
    } else { 
        var sql = "INSERT INTO tables (name,description) VALUES ('" + name + "','" + description + "')";
        tx.executeSql(sql, [] , show_MainPage);  
    }
}

function show_MainPage() {
    window.location.replace("index.html");   
}

function transaction_error(tx, error) {
    alert("Ocorreu um erro inesperado");
}


