var db;
var idMeal = getUrlVars()["id"];

function init() {
    db = window.openDatabase("appDB", "1.0", "appDB", 200000);
    document.addEventListener("backbutton", show_MainPage, true);
    db.transaction(getMealInfo, transaction_error);
}

function getMealInfo(tx) {
    var sql = "SELECT * FROM meals WHERE id = " + idMeal;
    tx.executeSql(sql, [], getMealInfo_success);
}

function getMealInfo_success(tx,results) {
    var meal = results.rows.item(0);
    
    $('#nameInput').val(meal.name);
    $('#priceinput').val(meal.price);
    
    $('#btnEditMeal').click(function(e){
        e.preventDefault();
        db.transaction(edit_Meal, transaction_error);
    });
       
}

function edit_Meal(tx) {
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
        var sql = 'UPDATE meals SET name="' + name + '", price="' + price + '" WHERE id =' + idMeal;
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