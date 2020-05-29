console.log("hello");
function getData() {
  var name = document.getElementById("name1").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("number").value;
  var dob = document.getElementById("dob").value;
  var data = {
    name: name,
    email: email,
    phone: phone,
    dob: dob,
  };

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:3000/api/v1/contacts", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Response
      //   var response = this.responseText;
    }
  };
  xhttp.send(JSON.stringify(data));
  window.location.href = "index.html";
}
