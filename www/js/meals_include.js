var db;

function init() {
    db = window.openDatabase("appDB", "1.0", "appDB", 200000);
    document.getElementById("btnNewTable").addEventListener("click", addMeal, false);
    document.addEventListener("backbutton", show_MainPage, true);
}

function addMeal () {
    db.transaction(insertMeal, transaction_error);
}

function insertMeal(tx) {
    var name = $('#nameInput').val();
    var price = $('#priceinput').val();
  
    if (name == '') {
        navigator.notification.alert(
            'Insira um nome para o prato!',  
            '',
            'Atenção',
            'Ok'
        );

    } else if(price == '') {
        navigator.notification.alert(
            'Insira um preço válido para o prato',  
            '',
            'Atenção',
            'Ok'
        );
    } else {
        var sql = "INSERT INTO meals (name,price) VALUES ('" + name + "','" + price + "')";
        tx.executeSql(sql, [] , show_MainPage);  
    }
}

function show_MainPage() {
    window.location.replace("index.html");   
}

function transaction_error(tx, error) {
	alert("Ocorreu um erro inesperado");
}

function validateQty(el, evt) {
   var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode == 45) return false;
    if (charCode != 45 && charCode != 8 && (charCode != 44) && (charCode < 48 || charCode > 57))
        return false;
    if (charCode == 44) {
        if ((el.value) && (el.value.indexOf('.') >= 0))
            return false;
        else
            return true;
    }
    return true;
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var number = evt.value.split('.');
    if (charCode != 44 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
};

