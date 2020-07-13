$(document).ready(function () {
    if (!isLogged()) {
        if (document.title != "Login Taskerer" && document.title != "Registar Taskerer" && document.title != "Termos Taskerer"){
            window.location.replace("index.html");
            return;
        }
    } else {
        if (document.title == "Login Taskerer"){
            window.location.replace("home.html");
            return;
        }
        document.getElementById("userProfilePic").src = "images/profilePics/"+getCookie("_Picture");
    }
});
function getParameter(param){
    var url = new URL(window.location.href);
    var c = url.searchParams.get(param);
    return c;
}
function doLogout() {
    setCookie("_id", "", 0);
    setCookie("_NUser", "", 0);
    setCookie("_Name", "", 0);
    setCookie("_Email", "", 0);
    setCookie("_Password", "", 0);
    setCookie("_Picture", "", 0);
    window.location.replace("index.html");
}


function setCookie(cname, cvalue, mins) {
    var d = new Date();
    var debug = false;
    var time = mins * 60 *1000;
    if (debug) {
        time *= 10;
    }
    d.setTime(d.getTime() + (time));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function isLogged() {
    if (typeof getCookie("_NUser") !== 'undefined') {
        if (getCookie("_NUser") !== '') {
            return true;
        }
    }
    return false;
}

function formatToJSDate(d){
    var correctFormat = d.replace(/(\d+)\-(\d+)\-(\d+)/, "$3-$2-$1");
    return new Date(correctFormat);
}
function getExtMonth(m) {
    switch (m) {
        case "01":
            return "January";
            break;
        case "02":
            return "February";
            break;
        case "03":
            return "March";
            break;
        case "04":
            return "April";
            break;
        case "05":
            return "May";
            break;
        case "06":
            return "June";
            break;
        case "07":
            return "July";
            break;
        case "08":
            return "August";
            break;
        case "09":
            return "September";
            break;
        case "10":
            return "October";
            break;
        case "11":
            return "November";
            break;
        case "12":
            return "December";
            break;
    }
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }