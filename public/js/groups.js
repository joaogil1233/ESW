$(document).ready(function () {
    //$("#waitingModal").modal('show');
    getGroups();
    //setTimeout(function(){ $("#waitingModal").modal('hide'); }, 1000);
});


function getGroups(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NUser":getCookie("_NUser")};
    xhr.open("POST", document.location.origin + "/getGroups", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById("div_myGroups").style.display="block";
            if(xhr.response.groups.length==1){
                document.getElementById("numberOfGroups").textContent=xhr.response.groups.length+" Grupo"
            }else{
                document.getElementById("numberOfGroups").textContent=xhr.response.groups.length+" Grupos"
            }
            i=0;
            var tbody = document.getElementById("tbody_myGroups");
            tbody.innerHTML = "";
            if(xhr.response.groups==0){
                var tbody = document.getElementById("tbody_myGroups");
                tbody.innerHTML = "";
                var tr = document.createElement("tr");
                /* Row */
                var td = document.createElement("td");
                td.textContent = "Não existem registos";
                td.colSpan=2;
                td.className="alert-warning center";
                tr.appendChild(td);
                tbody.appendChild(tr);
                return;
            }
            xhr.response.groups.forEach(function (group) {
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.style.display="none";
                td.textContent = group._NGroup;
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                td.textContent = group._Name;
                td.id = "Nome"
                td.className="clickable";
                td.addEventListener("click", function () {
                    window.location.href = "group.html?ngroup="+group._NGroup;
                });
                td.title = "Nome do grupo";
                tr.appendChild(td);

                tbody.appendChild(tr);
                i++;
            });
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}


function openCreateGroup(){
    $("#formModal").modal('show');
}

function createGroup(){
    $("#formModal").modal('hide');
    $("#waitingModal").modal('show');
    _Name = document.getElementById("createGroup_Name").value;
    if(_Name=="" ){
        document.getElementById("waitingModal-Title").innerHTML="Erro ! ";
        document.getElementById("waitingModal-Message").className="alert alert-warning";
        document.getElementById("waitingModal-Message").innerHTML = "Necessita de preencher o nome do grupo";
        return;
    }
    _NUserCreater = getCookie("_NUser");
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_Name":_Name,"_NUserCreater":_NUserCreater};
    xhr.open("POST", document.location.origin + "/createGroup", true);
    $("#formModal").modal('hide');
    $("#waitingModal").modal('show');
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById("waitingModal-Title").innerHTML="Concluído ! ";
            document.getElementById("waitingModal-Message").className="alert alert-success";
            document.getElementById("waitingModal-Message").innerHTML = "A atualizar sistema...";
            setTimeout(function(){ getGroups(); }, 1000);
            setTimeout(function(){ $("#waitingModal").modal('hide'); }, 1000);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));

}