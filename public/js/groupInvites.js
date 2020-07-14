$(document).ready(function () {
    if(isLogged()){
        _NUser = getCookie("_NUser")
        getGroupInvites(_NUser);
    }
});

function getGroupInvites(_NUser){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NUser":_NUser};
    xhr.open("POST", document.location.origin + "/getGroupInvites", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById("div_myGroupInvites").style.display="block";
            if(xhr.response.groups.length==1){
                document.getElementById("numberOfInvites").textContent=xhr.response.groups.length+" Convite"
            }else{
                document.getElementById("numberOfInvites").textContent=xhr.response.groups.length+" Convites"
            }
            i=0;
            var tbody = document.getElementById("tbody_myGroupInvites");
            tbody.innerHTML = "";
            if(xhr.response.groups==0){
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


                /* Row */
                var td = document.createElement("td");
                td.title = "Acções de utilizador";
                tr.appendChild(td);
                var icon = document.createElement("i"); 
                icon.style.cursor="pointer";
                icon.className="material-icons clickableIcon";
                icon.textContent="check";
                icon.title = "Aceitar grupo";
                icon.addEventListener("click", function () {
                    acceptGroupInvite(_NUser,group._NGroup,true);
                });
                td.appendChild(icon);

                var icon = document.createElement("i"); 
                icon.style.cursor="pointer";
                icon.className="material-icons clickableIcon";
                icon.textContent="cancel";
                icon.title = "Recusar grupo";
                icon.addEventListener("click", function () {
                    acceptGroupInvite(_NUser,group._NGroup,false);
                });
                td.appendChild(icon);

                tr.appendChild(td);
                tbody.appendChild(tr);
                i++;
            });
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}


function acceptGroupInvite(_NUser,_NGroup,acceptOrNot){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NUser":_NUser,"_NGroup":_NGroup,"acceptOrNot":acceptOrNot};
    xhr.open("POST", document.location.origin + "/acceptGroupInvite", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            location.reload();
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}