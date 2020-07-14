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
    var json = {"_NGroup":_NGroup,"_NUser":_NUser,"_NTask":_NTask};
    xhr.open("POST", document.location.origin + "/getUserRoles", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var roleIDS = xhr.response.roles;
            
            document.getElementById("btn_sendComment").addEventListener("click", function () {
                createComment(_NTask);
            });
            if((roleIDS.includes(1) || roleIDS.includes(5))){
                document.getElementById("btn_createSubtask").style.display="block";
                document.getElementById("btn_createSubtask").addEventListener("click", function () {
                    openCreateSubtask();
                });
                document.getElementById("btn_actionCreateSubtask").addEventListener("click", function () {
                    createSubtask(_NGroup,_NTask);
                });
            }
            if((roleIDS.includes(1) || roleIDS.includes(6)||xhr.response.isAssigned.length==1)){
                document.getElementById("btn_editTask").style.display="block";
                document.getElementById("btn_editTask").addEventListener("click", function () {
                    openEditSubtask(_NGroup,_NTask);
                });
                document.getElementById("btn_actionEditTask").addEventListener("click", function () {
                    editTask(_NTask);
                });
                fillSelectUsersInGroup(_NGroup);
                fillSelectStatus();
            }
            if((roleIDS.includes(1) || roleIDS.includes(6))){
                document.getElementById("btn_deleteTask").style.display="block";
                document.getElementById("btn_deleteTask").addEventListener("click", function () {
                    deleteTask(_NGroup,_NTask);
                });
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function deleteTask(_NGroup,_NTask){
    var sure = confirm("De certeza que pretende eleminar esta tarefa e todas as suas subtarefas?");
    if(!sure)
        return;
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NTask":_NTask};
    $("#waitingModal").modal('show');
    xhr.open("POST", document.location.origin + "/deleteTask", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById("waitingModal-Title").innerHTML="Concluído!";
            document.getElementById("waitingModal-Message").className="alert alert-success";
            document.getElementById("waitingModal-Message").innerHTML = "A atualizar sistema...";
            setTimeout(function(){ window.location.href = "group.html?ngroup="+_NGroup }, 1000);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}
function editTask(_NTask){
    _Name = document.getElementById("editTask_title").value;
    _NAssignedUser = document.getElementById("editTask_assignedTo").value;
    _NPriority = document.getElementById("editTask_priority").value;
    _NStatus = document.getElementById("editTask_status").value;
    _Desc = document.getElementById("editTask_description").value;
    $("#formModal").modal('hide');
    $("#waitingModal").modal('show');
    if(_Name=="" ||_NAssignedUser=="" ||_NPriority=="" ||_Desc==""||_NStatus=="" ){
        document.getElementById("waitingModal-Title").innerHTML="Erro ! ";
        document.getElementById("waitingModal-Message").className="alert alert-warning";
        document.getElementById("waitingModal-Message").innerHTML = "Preencha os campos todos";
        setTimeout(function(){ $("#waitingModal").modal('hide'); }, 1000);
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NTask":_NTask,"_Name":_Name,"_NAssignedUser":_NAssignedUser,"_NPriority":_NPriority,"_NStatus":_NStatus,"_Desc":_Desc};
    xhr.open("POST", document.location.origin + "/updateTask", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById("waitingModal-Title").innerHTML="Concluído!";
            document.getElementById("waitingModal-Message").className="alert alert-success";
            document.getElementById("waitingModal-Message").innerHTML = "A atualizar sistema...";
            setTimeout(function(){ location.reload(); }, 1000);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}
function createSubtask(_NGroup,_NTask){
    _Name = document.getElementById("createSubtask_title").value;
    _NAssignedUser = document.getElementById("createSubtask_assignedTo").value;
    _NPriority = document.getElementById("createSubtask_priority").value;
    _NCreatorUser = getCookie("_NUser");
    _Desc = document.getElementById("createSubtask_description").value;
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


function createComment(_NTask){
    _Comment = document.getElementById("message_text").value;
    $("#formModal").modal('hide');
    $("#waitingModal").modal('show');
    if(_Comment==""){
        document.getElementById("waitingModal-Title").innerHTML="Erro ! ";
        document.getElementById("waitingModal-Message").className="alert alert-warning";
        document.getElementById("waitingModal-Message").innerHTML = "Escreva uma mensagem primeiro";
        setTimeout(function(){ $("#waitingModal").modal('hide'); }, 1000);
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    _NUser = getCookie("_NUser");
    var json = {"_Comment":_Comment,"_NTask":_NTask,"_NUser":_NUser,"_NSubtask":-1};
    xhr.open("POST", document.location.origin + "/createComment", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById("waitingModal-Title").innerHTML="Concluído!";
            document.getElementById("waitingModal-Message").className="alert alert-success";
            document.getElementById("waitingModal-Message").innerHTML = "A atualizar sistema...";
            setTimeout(function(){ getComments(_NTask)}, 1000);
            setTimeout(function(){ $("#waitingModal").modal('hide'); }, 1000);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}


function openEditSubtask(_NGroup,_NTask){
    document.getElementById("editTask").style.display="block";
    document.getElementById("createSubtask").style.display="none";
    $("#formModal").modal('show');
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NTask":_NTask};
    xhr.open("POST", document.location.origin + "/getTask", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {

                /* Field */
                var field = document.getElementById("editTask_title");
                field.value = xhr.response.task._Name;
                
                /* Field */
                var field = document.getElementById("editTask_assignedTo");
                field.value = xhr.response.assignedUser._NUser;
                
                /* Field */
                var field = document.getElementById("editTask_priority");
                field.value = xhr.response.priority._NPriority;

                /* Field */
                var field = document.getElementById("editTask_status");
                field.value = xhr.response.status._NStatus;

                /* Field */
                var field = document.getElementById("editTask_description");
                field.textContent = xhr.response.task._Desc;
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));

}

function fillSelectUsersInGroup(_NGroup){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NGroup":_NGroup};
    xhr.open("POST", document.location.origin + "/getUsersInGroup", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            select = document.getElementById("editTask_assignedTo");
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

function fillSelectStatus(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/getStatus", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            select = document.getElementById("editTask_status");
            select.innerHTML="";
            var option = document.createElement("option");
            option.value="";
            option.disabled = true;
            option.selected = true;
            option.innerHTML="Selecione o estado";
            select.appendChild(option);
            xhr.response.status.forEach(function (status) {
                var option = document.createElement("option");
                option.value=status._NStatus;
                option.innerHTML=status._Name;
                select.appendChild(option);
            });
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify());
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
                icon = document.createElement("i");
                icon.className="material-icons clickableIcon";
                icon.textContent="arrow_back";
                icon.title = "Voltar";
                groupName = document.getElementById("groupName");
                groupName.appendChild(icon);
                groupName.innerHTML+=" Grupo "+ task.group._Name;
                groupName.className="clickableIcon";
                groupName.addEventListener("click", function () {
                    window.location.href = "group.html?ngroup="+task.group._NGroup;
                });
                document.getElementById("taskName").innerHTML="Tarefa '"+ task.task._Name+"'";
                document.getElementById("groupHiperlink").innerHTML="'"+ task.group._Name+"'";
                document.getElementById("groupHiperlink").href="group.html?ngroup="+task.group._NGroup;
                

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
                getComments(task.task._NTask);

                //document.getElementById("fullpageLoad").style.display="block";
                setTimeout(function(){
                    document.getElementById("fullpageLoad").style.display="block";
                    $("#waitingModal").modal('hide'); 
                }, 1000);
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


function getComments(_NTask){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    var json = {"_NTask":_NTask};
    xhr.open("POST", document.location.origin + "/getCommentsForTask", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var panel = document.getElementById("commentsZone");
            panel.innerHTML = "";
            if (xhr.response.comments.length==0){
                var span = document.createElement("span");
                span.style="font-size:30px;";
                span.textContent="Não existem comentários";
                panel.appendChild(span);
                return;
            }

            xhr.response.comments.forEach(function (comment) {

                user = xhr.response.users.find(elem => elem._NUser == comment._NUser);

                var divRow = document.createElement("div");
                divRow.className="d-flex flex-row comment-row m-t-0"
                panel.appendChild(divRow);
                
                var divImage = document.createElement("div");
                divImage.className="p-2"
                divRow.appendChild(divImage);

                var image = document.createElement("img");
                image.src="images/profilePics/"+user._Picture;
                image.width="50"
                image.className="rounded-circle"
                divImage.appendChild(image);

                var divText = document.createElement("div");
                divText.className="comment-text w-100"
                divRow.appendChild(divText);

                var time = document.createElement("span");
                time.className="text-muted float-right";
                time.textContent=comment._Datetime;
                divText.appendChild(time);
                
                var name = document.createElement("h6");
                name.className="font-medium";
                name.textContent=user._Name;
                divText.appendChild(name);

                var message = document.createElement("span");
                message.className="m-b-15 d-block";
                message.textContent=comment._Message;
                divText.appendChild(message);
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