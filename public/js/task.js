$(document).ready(function () {
    if(isLogged()){
        _NTask = getParameter("ntask");
        getTask(_NTask);
    }
});

function getTask(_NTask){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NTask":_NTask};
    xhr.open("POST", document.location.origin + "/getTask", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            _NGroup = xhr.response.task._NGroup;
           isUserAllowedInGroup(_NGroup,xhr.response);
           getUserRoles(_NGroup,_NTask);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}


function getUserRoles(_NGroup,_NTask){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    _NUser = getCookie("_NUser");
    var json = {"_NGroup":_NGroup,"_NUser":_NUser};
    xhr.open("POST", document.location.origin + "/getUserRoles", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var roleIDS = xhr.response.roles;
            
            if((roleIDS.includes(1) || roleIDS.includes(5))){
                document.getElementById("btn_createSubtask").style.display="block";
                document.getElementById("btn_createSubtask").addEventListener("click", function () {
                    openCreateSubtask();
                });
                document.getElementById("btn_actionCreateSubtask").addEventListener("click", function () {
                    createSubtask(_NGroup,_NTask);
                });
            }
            if((roleIDS.includes(1) || roleIDS.includes(6))){
                document.getElementById("btn_editTask").style.display="block";
                document.getElementById("btn_editTask").addEventListener("click", function () {
                    openEditTask();
                });
                document.getElementById("btn_actionEditTask").addEventListener("click", function () {
                    editTask(_NGroup,_NTask);
                });

                document.getElementById("btn_deleteTask").style.display="block";
                document.getElementById("btn_deleteTask").addEventListener("click", function () {
                    deleteTask(_NTask);
                });
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function deleteTask(_NTask){
    alert("deleteTask");
}

function createSubtask(_NGroup,_NTask){
    _Name = document.getElementById("createSubtask_title").value;
    _NAssignedUser = document.getElementById("createSubtask_assignedTo").value;
    _NPriority = document.getElementById("createSubtask_priority").value;
    _NCreatorUser = getCookie("_NUser");
    _Desc = document.getElementById("createSubtask_decription").value;
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
    var json = {"_Name":_Name,"_NTask":_NTask,"_NGroup":_NGroup,"_NAssignedUser":_NAssignedUser,"_NPriority":_NPriority,"_NCreatorUser":_NCreatorUser,"_Desc":_Desc};
    xhr.open("POST", document.location.origin + "/createSubtask", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById("waitingModal-Title").innerHTML="Concluído!";
            document.getElementById("waitingModal-Message").className="alert alert-success";
            document.getElementById("waitingModal-Message").innerHTML = "A atualizar sistema...";
            setTimeout(function(){ getSubTasks(_NTask)}, 1000);
            setTimeout(function(){ $("#waitingModal").modal('hide'); }, 1000);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function openEditSubtask(){
    document.getElementById("editTask").style.display="block";
    document.getElementById("createSubtask").style.display="none";
    $("#formModal").modal('show');
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NGroup":_NGroup};
    xhr.open("POST", document.location.origin + "/getUsersInGroup", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            select = document.getElementById("createSubtask_assignedTo");
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


function openCreateSubtask(){
    document.getElementById("editTask").style.display="none";
    document.getElementById("createSubtask").style.display="block";
    $("#formModal").modal('show');
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NGroup":_NGroup};
    xhr.open("POST", document.location.origin + "/getUsersInGroup", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            select = document.getElementById("createSubtask_assignedTo");
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


function isUserAllowedInGroup(_NGroup,task){
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
            }else{
                document.getElementById("groupName").innerHTML="Grupo "+ task.group._Name;
                document.getElementById("taskName").innerHTML="Tarefa '"+ task.task._Name+"'";

                /* Field */
                var field = document.getElementById("updateTask-creatorName");
                field.textContent = task.creatorUser._Name;
                field.className="clickable";
                field.addEventListener("click", function () {
                    window.location.href = "profile.html?nprofile="+task.creatorUser._NUser;
                });

                /* Field */
                var field = document.getElementById("updateTask-createdAt");
                field.textContent = task.task._CreatedAt;

                /* Field */
                if(task.task._UpdatedAt!=undefined && task.task._UpdatedAt!="" ){
                    document.getElementById("hasBeenUpdated").style.display="block";
                    var field = document.getElementById("updateTask-updatedAt");
                    field.textContent = task.task._UpdatedAt;
                }

                
                /* Field */
                var field = document.getElementById("updateTask-assignedTo");
                field.textContent = task.assignedUser._Name;
                field.className="clickable";
                field.addEventListener("click", function () {
                    window.location.href = "profile.html?nprofile="+task.creatorUser._NUser;
                });

                
                /* Field */
                var field = document.getElementById("updateTask-status");
                field.textContent = task.status._Name;
                
                if(task.task._NStatus==0){//Por iniciar
                    field.className="label label-warning label-rounded";
                }else if(task.task._NStatus==1){//Em desenvolvimento
                    field.className="label label-primary label-rounded";
                }else if(task.task._NStatus==2){//Bloqueado
                    field.className="label label-danger label-rounded";
                }else{//Concluído
                    field.className="label label-success label-rounded";
                }

                /* Field */
                var field = document.getElementById("updateTask-priority");
                field.textContent = task.priority._Name;
                if(task.task._NPriority==0){//Baixo
                    field.className="label label-success label-rounded";
                }else if(task.task._NPriority==1){//Médio
                    field.className="label label-info label-rounded";
                }else{//Alto
                    field.className="label label-danger label-rounded";
                }

                /* Field */
                var field = document.getElementById("updateTask-description");
                field.textContent = task.task._Desc;

                getSubTasks(task.task._NTask);

                setTimeout(function(){ $("#waitingModal").modal('hide'); }, 1000);
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function getSubTasks(_NTask){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NTask":_NTask};
    xhr.open("POST", document.location.origin + "/getSubTasks", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            i=0;
            document.getElementById("divSubtasks").style.display="block";
            var tbody = document.getElementById("tbody_Subtasks");
            tbody.innerHTML = "";
            if(xhr.response.subtasks==0){
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
            xhr.response.subtasks.forEach(function (task) {
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
                    window.location.href = "subtask.html?ntask="+task._NTask;
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


$(document).ready(function(){
    $("#searchSubtasks").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#tbody_Subtasks tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});