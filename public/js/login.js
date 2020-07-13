
function doLogin() {
    var email = document.getElementById("loginEmail").value;
    var pw = document.getElementById("loginPassword").value;
    var json = { "email": email, "pw": pw };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", document.location.origin + "/login", true);
    $("#waitingModal").modal('show');
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            if (xhr.response.Message == "WrongCombination") {
                document.getElementById("waitingModal-Title").innerHTML="Erro ! ";
                document.getElementById("waitingModal-Message").className="alert alert-warning";
                document.getElementById("waitingModal-Message").innerHTML = "Combinação inválida";
                
            } else if (xhr.response.Message == "SystemError") {
                document.getElementById("waitingModal-Title").innerHTML="Erro ! ";
                document.getElementById("waitingModal-Message").className="alert alert-danger";
                document.getElementById("waitingModal-Message").innerHTML = "Problemas de servidor";
            }else if (xhr.response.Message == "Success") {
                setCookie("_id", xhr.response._id, 99);
                setCookie("_NUser", xhr.response._NUser, 99);
                setCookie("_Name", xhr.response._Name, 99);
                setCookie("_Email", xhr.response._Email, 99);
                setCookie("_Password", xhr.response._Password, 99);
                setCookie("_Picture", xhr.response._Picture, 99);
                document.getElementById("waitingModal-Title").innerHTML="Concluído ! ";
                document.getElementById("waitingModal-Message").className="alert alert-success";
                document.getElementById("waitingModal-Message").innerHTML = "Sucesso, a iniciar o sistema";
                setTimeout(function(){ window.location.replace("home.html"); }, 1000);
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
};

$("#loginEmail").on('keyup', function (e) {
       if (e.keyCode === 13) {
           doLogin();
       }
   });
$("#loginPassword").on('keyup', function (e) {
   if (e.keyCode === 13) {
       doLogin();
   }
});