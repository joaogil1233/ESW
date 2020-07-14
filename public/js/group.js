$(document).ready(function () {
    if(isLogged()){
        _NGroup = getParameter("ngroup");
        checkUserPermissionToAcessGroup(_NGroup);
    }
});
function checkUserPermissionToAcessGroup(_NGroup){
    _NUser = getCookie("_NUser");
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NGroup":_NGroup,"_NUser":_NUser};
    xhr.open("POST", document.location.origin + "/checkUserPermissionToAcessGroup", true);
    $("#waitingModal").modal('show');
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            if(xhr.response.Message=="Denied"){
                document.getElementById("waitingModal-Title").innerHTML="Erro ! ";
                document.getElementById("waitingModal-Message").className="alert alert-danger";
                document.getElementById("waitingModal-Message").innerHTML = "Não tem acesso a este grupo";
                setTimeout(function(){window.location.replace("groups.html"); }, 1000);
                return;
            }else{
                getGroup(_NGroup);
                getUserRoles(_NGroup);
                //document.getElementById("groupName").innerHTML="Grupo "+
                //alert("have rights");
                setTimeout(function(){ $("#waitingModal").modal('hide'); }, 1000);
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}



function inviteUser(_NGroup){
    $("#formModal").modal('hide');
    $("#waitingModal").modal('show');
    _Email = document.getElementById("inviteUser_email").value;
    if(_Email=="" ){
        document.getElementById("waitingModal-Title").innerHTML="Erro ! ";
        document.getElementById("waitingModal-Message").className="alert alert-warning";
        document.getElementById("waitingModal-Message").innerHTML = "Necessita de preencher o email do utilizador";
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NGroup":_NGroup,"_Email":_Email};
    xhr.open("POST", document.location.origin + "/inviteUser", true);
    $("#formModal").modal('hide');
    $("#waitingModal").modal('show');
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            if(xhr.response.Message == "EmailNotFound"){
                document.getElementById("waitingModal-Title").innerHTML="Erro ! ";
                document.getElementById("waitingModal-Message").className="alert alert-warning";
                document.getElementById("waitingModal-Message").innerHTML = "O email não está registado no sistema";
                setTimeout(function(){ $("#waitingModal").modal('hide'); }, 3000);

            }else if(xhr.response.Message == "UserAlreadyInvited"){
                document.getElementById("waitingModal-Title").innerHTML="Erro ! ";
                document.getElementById("waitingModal-Message").className="alert alert-danger";
                document.getElementById("waitingModal-Message").innerHTML = "O utilizador já se encontra no grupo";
                setTimeout(function(){ $("#waitingModal").modal('hide'); }, 3000);
            }else{
                document.getElementById("waitingModal-Title").innerHTML="Concluído ! ";
                document.getElementById("waitingModal-Message").className="alert alert-success";
                document.getElementById("waitingModal-Message").innerHTML = "A atualizar sistema...";
                setTimeout(function(){ checkUserPermissionToAcessGroup(_NGroup); }, 1000);
                setTimeout(function(){ $("#waitingModal").modal('hide'); }, 1000);
            }
            
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));

}


function getUserRoles(_NGroup){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    _NUser = getCookie("_NUser");
    var json = {"_NGroup":_NGroup,"_NUser":_NUser};
    xhr.open("POST", document.location.origin + "/getUserRoles", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var roleIDS = xhr.response.roles;
            if(roleIDS.includes(1)){
                document.getElementById("btn_changeUserRoles").addEventListener("click", function () {
                    changeUserRoles(_NGroup);
                });
            }
            
            if((roleIDS.includes(1) || roleIDS.includes(2))){
                document.getElementById("btn_inviteUsers").style.display="block";
                document.getElementById("btn_inviteUsers").addEventListener("click", function () {
                    openInviteUser(_NGroup);
                });
                document.getElementById("btn_actionInviteUser").addEventListener("click", function () {
                    inviteUser(_NGroup);
                });
            }
            if((roleIDS.includes(1) || roleIDS.includes(5))){
                document.getElementById("btn_createTask").style.display="block";
                document.getElementById("btn_createTask").addEventListener("click", function () {
                    openCreateTask();
                });
                document.getElementById("btn_actionCreateTask").addEventListener("click", function () {
                    createTask(_NGroup);
                });
            }
            getUsersInGroup(_NGroup,roleIDS);
            getTasks(_NGroup);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}


function getUsersInGroup(_NGroup,roleIDS){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NGroup":_NGroup};
    xhr.open("POST", document.location.origin + "/getUsersInGroup", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            i=0;
            document.getElementById("divUsersGroup").style.display="block";
            var tbody = document.getElementById("tbody_usersInGroup");
            tbody.innerHTML = "";
            if(xhr.response.users==0){
                var tr = document.createElement("tr");
                /* Row */
                var td = document.createElement("td");
                td.textContent = "Não existem registos";
                td.colSpan=4;
                td.className="alert-warning center";
                tr.appendChild(td);
                tbody.appendChild(tr);
                return;
            }
            xhr.response.users.forEach(function (user) {
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.style.display="none";
                td.textContent = user._NUser;
                tr.appendChild(td);

                //Search user in group line
                userInGroupLine = xhr.response.userGroup.find(elem => elem._NUser == user._NUser);
                //Search user in roles line
                userRoleIDS = [];
                xhr.response.userRoles.forEach(function (userRole) {
                    if(userRole._NUser == user._NUser){
                        userRoleIDS.push(userRole._NRole);
                    }
                });

                /* Row */
                var td = document.createElement("td");
                td.textContent = user._Name;
                td.className="clickable";
                td.addEventListener("click", function () {
                    window.location.href = "profile.html?nprofile="+user._NUser;
                });
                td.title = "Nome do utilizador";
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                td.textContent = user._Email;
                td.className="clickable";
                td.addEventListener("click", function () {
                    window.location.href = "profile.html?nprofile="+user._NUser;
                });
                td.title = "Email do utilizador";
                tr.appendChild(td);
                
                /* Row */
                var td = document.createElement("td");
                td.textContent = userInGroupLine._JoinDate;
                td.title = "Data de entrada do utilizador";
                tr.appendChild(td);

                var td = document.createElement("td");
                td.textContent = userInGroupLine._LeaveDate;
                td.title = "Data de saida do utilizador";
                tr.appendChild(td);

                if((roleIDS.includes(1) || roleIDS.includes(4)) && !userRoleIDS.includes(1)){
                    /* Row */
                    var td = document.createElement("td");
                    td.title = "Acções de utilizador";
                    tr.appendChild(td);

                    var icon = document.createElement("i"); 
                    icon.style.cursor="pointer";
                    if(userInGroupLine._LeaveDate==""){
                        icon.className="material-icons clickableIcon";
                        icon.textContent="not_interested";
                        icon.title = "Remover utilizador";
                        icon.addEventListener("click", function () {
                            blockPeopleInGroup(user._NUser,_NGroup,true);
                        });
                    }else{
                        icon.className="material-icons clickableIcon";
                        icon.textContent="connect_without_contact";
                        icon.title = "Restituir utilizador";
                        icon.addEventListener("click", function () {
                            blockPeopleInGroup(user._NUser,_NGroup,false);
                        });
                    }
                    td.appendChild(icon);

                    var icon = document.createElement("i"); 
                    icon.style.cursor="pointer";
                    if(userInGroupLine._LeaveDate=="" && userInGroupLine._NUser!=getCookie("_NUser")){

                        icon.className="material-icons clickableIcon";
                        icon.textContent="edit";
                        icon.style="margin-left:10px"
                        icon.title = "Editar utilizador";
                        icon.addEventListener("click", function () {
                            openChangeRoles(user._NUser,_NGroup);
                        });
                        
                        td.appendChild(icon);
                    }

                    tr.appendChild(td);
                    document.getElementById("colUserActions").style.display="block";
                }
                tbody.appendChild(tr);
                i++;
            });
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}
function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }
function changeUserRoles(_NGroup){
    _NUser = document.getElementById("changeRoles_UserID").textContent;
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    
    roles=getSelectValues(document.getElementById("changeRoles-allRoles"));
    var json = {"_NUser":_NUser,"_NGroup":_NGroup,"roles":roles};
    xhr.open("POST", document.location.origin + "/changeRoles", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            location.reload();
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function getTasks(_NGroup){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NGroup":_NGroup};
    xhr.open("POST", document.location.origin + "/getTasks", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            i=0;
            document.getElementById("divTasksGroup").style.display="block";
            var tbody = document.getElementById("tbody_Tasks");
            tbody.innerHTML = "";
            if(xhr.response.tasks==0){
                var tr = document.createElement("tr");
                /* Row */
                var td = document.createElement("td");
                td.textContent = "Não existem registos";
                td.colSpan=4;
                td.className="alert-warning center";
                tr.appendChild(td);
                tbody.appendChild(tr);
                return;
            }
            xhr.response.tasks.forEach(function (task) {
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.style.display="none";
                td.textContent = task._NUser;
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                td.textContent = task._Name;
                td.className="clickable";
                td.addEventListener("click", function () {
                    window.location.href = "task.html?ntask="+task._NTask;
                });
                td.title = "Nome da tarefa";
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                td.textContent = xhr.response.users.find(elem => elem._NUser == task._NAssignedUser)._Name;
                td.className="clickable";
                td.addEventListener("click", function () {
                    window.location.href = "profile.html?nprofile="+task._NAssignedUser;
                });
                td.title = "Responsável";
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                var span = document.createElement("span");
                if(task._NStatus==0){//Por iniciar
                    span.className="label label-warning label-rounded";
                }else if(task._NStatus==1){//Em desenvolvimento
                    span.className="label label-primary label-rounded";
                }else if(task._NStatus==2){//Bloqueado
                    span.className="label label-danger label-rounded";
                }else{//Concluído
                    span.className="label label-success label-rounded";
                }
                span.textContent = xhr.response.status.find(elem => elem._NStatus == task._NStatus)._Name;
                td.appendChild(span);
                td.title = "Estado";
                tr.appendChild(td);
                
                /* Row */
                var td = document.createElement("td");
                td.textContent = task._CreatedAt;
                td.title = "Data de inicio";
                tr.appendChild(td);
                tbody.appendChild(tr);
                i++;
            });
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function openInviteUser(_NGroup){
    document.getElementById("inviteUser").style.display="block";
    document.getElementById("changeRoles").style.display="none";
    document.getElementById("createTask").style.display="none";
    $("#formModal").modal('show');
}
function openChangeRoles(_NUser,_NGroup){
    document.getElementById("changeRoles").style.display="block";
    document.getElementById("inviteUser").style.display="none";
    document.getElementById("createTask").style.display="none";
    document.getElementById("changeRoles_UserID").textContent=_NUser;
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NGroup":_NGroup,"_NUser":_NUser};
    xhr.open("POST", document.location.origin + "/getUserInGroup", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById("changeRoles-userName").textContent=xhr.response.user._Name;
            
            
            select = document.getElementById("changeRoles-allRoles");
            select.innerHTML="";
            xhr.response.roles.forEach(function (role) {
                var option = document.createElement("option");
                option.value=role._NRole;
                option.innerHTML=role._Name;
                //alert(xhr.response.userRoles);
                if (xhr.response.userRoles.filter(e => e._NRole == role._NRole).length > 0) {
                    option.selected=true;
                    /* vendors contains the element we're looking for */
                }
                select.appendChild(option);
            });
            $("#formModal").modal('show');
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));

}



function openCreateTask(){
    document.getElementById("inviteUser").style.display="none";
    document.getElementById("changeRoles").style.display="none";
    document.getElementById("createTask").style.display="block";
    $("#formModal").modal('show');
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NGroup":_NGroup};
    xhr.open("POST", document.location.origin + "/getUsersInGroup", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            select = document.getElementById("createTask_assignedTo");
            select.innerHTML="";
            var option = document.createElement("option");
            option.value="";
            option.disabled = true;
            option.selected = true;
            option.innerHTML="Selecione o utilizador";
            select.appendChild(option);
            xhr.response.users.forEach(function (user) {
                var option = document.createElement("option");
                option.value=user._NUser;
                option.innerHTML=user._Name;
                select.appendChild(option);
            });
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}



function blockPeopleInGroup(_NUser,_NGroup,block){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NUser":_NUser,"_NGroup":_NGroup,"block":block};
    xhr.open("POST", document.location.origin + "/blockPeopleInGroup", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            getUserRoles(_NGroup);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function getGroup(_NGroup){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NGroup":_NGroup};
    xhr.open("POST", document.location.origin + "/getGroup", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById("groupName").innerHTML="Grupo "+ xhr.response.group._Name;
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}



function createTask(_NGroup){
    _Name = document.getElementById("createTask_title").value;
    _NAssignedUser = document.getElementById("createTask_assignedTo").value;
    _NPriority = document.getElementById("createTask_priority").value;
    _NCreatorUser = getCookie("_NUser");
    _Desc = document.getElementById("createTask_description").value;
    $("#formModal").modal('hide');
    $("#waitingModal").modal('show');
    if(_Name=="" ||_NAssignedUser=="" ||_NPriority=="" ||_Desc=="" ){
        document.getElementById("waitingModal-Title").innerHTML="Erro ! ";
        document.getElementById("waitingModal-Message").className="alert alert-warning";
        document.getElementById("waitingModal-Message").innerHTML = "Preencha os campos todos";
        setTimeout(function(){ $("#waitingModal").modal('hide'); }, 1000);
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_Name":_Name,"_NGroup":_NGroup,"_NAssignedUser":_NAssignedUser,"_NPriority":_NPriority,"_NCreatorUser":_NCreatorUser,"_Desc":_Desc};
    xhr.open("POST", document.location.origin + "/createTask", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById("waitingModal-Title").innerHTML="Concluído!";
            document.getElementById("waitingModal-Message").className="alert alert-success";
            document.getElementById("waitingModal-Message").innerHTML = "A atualizar sistema...";
            setTimeout(function(){ getTasks(_NGroup); }, 1000);
            setTimeout(function(){ $("#waitingModal").modal('hide'); }, 1000);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}




$(document).ready(function(){
    $("#searchTasks").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#tbody_Tasks tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#searchUsers").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#tbody_usersInGroup tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});