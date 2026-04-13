function login(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;
const error = document.getElementById("error");

// SIMPLE FAKE CREDENTIALS (demo only)
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

if(username === ADMIN_USER && password === ADMIN_PASS){

localStorage.setItem("isLoggedIn", "true");
localStorage.setItem("role", "admin");

window.location.href = "index.html";

} else {
 error.innerText = "Invalid username or password";
}

}