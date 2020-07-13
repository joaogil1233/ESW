
// Add the following code if you want the name of the file appear on select
$(".custom-file-input").on("change", function() {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

/*
var form = document.forms.namedItem("fileinfo");
form.addEventListener('submit', function(ev) {
    doRegister();
});*/





function doRegister(){
    _Name = document.getElementById("registerName").value;
    _Email = document.getElementById("registerEmail").value;
    _Password = document.getElementById("registerPassword").value;
    _RePassword = document.getElementById("registerRePassword").value;
    
    if(_Name=="" ||_Email=="" ||_Password=="" ||_RePassword=="" ){
        $("#waitingModal").modal('show');
        document.getElementById("waitingModal-Title").innerHTML="Erro !";
        document.getElementById("waitingModal-Message").className="alert alert-warning";
        document.getElementById("waitingModal-Message").innerHTML = "Preencha todos os campos";
        return;
    }
    if(!(validateEmail(_Email))){
        $("#waitingModal").modal('show');
        document.getElementById("waitingModal-Title").innerHTML="Erro !";
        document.getElementById("waitingModal-Message").className="alert alert-danger";
        document.getElementById("waitingModal-Message").innerHTML = "Email inválido";
        return;
    }
    if(_Password!=_RePassword){
        $("#waitingModal").modal('show');
        document.getElementById("waitingModal-Title").innerHTML="Erro !";
        document.getElementById("waitingModal-Message").className="alert alert-danger";
        document.getElementById("waitingModal-Message").innerHTML = "As passwords não coincidem";
        return;
    }
    if(!document.getElementById('agree-term').checked){
        $("#waitingModal").modal('show');
        document.getElementById("waitingModal-Title").innerHTML="Erro !";
        document.getElementById("waitingModal-Message").className="alert alert-danger";
        document.getElementById("waitingModal-Message").innerHTML = "Só pode utilizar a aplicação se aceitar os termos de serviço";
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_Name":_Name,"_Email":_Email,"_Password":_Password};
    xhr.open("POST", document.location.origin + "/register", true);
    $("#waitingModal").modal('show');
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            if(xhr.response.Message == "UserAlreadyExist"){
                document.getElementById("waitingModal-Title").innerHTML="Erro ! ";
                document.getElementById("waitingModal-Message").className="alert alert-warning";
                document.getElementById("waitingModal-Message").innerHTML = "Utilizador já existente";
                setTimeout(function(){ $("#waitingModal").modal('hide'); }, 3000);
                return;
            }
            document.getElementById("waitingModal-Title").innerHTML="Concluído!";
            document.getElementById("waitingModal-Message").className="alert alert-success";
            document.getElementById("waitingModal-Message").innerHTML = "Conta criada com sucesso...";
            setTimeout(function(){window.location.replace("index.html"); }, 2000);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}
