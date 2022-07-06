window.addEventListener('load', (event) => {
  console.log('page is fully loaded');

  addUsernameDropDown();
});

// making the request as get showed some error
function addUsernameDropDown() {

  // curl -X POST -H "Content-type: application/json" -d "{\"func\" : \"get_usernames\"}" "localhost:8000/home"
  endpoint = "http://localhost:8000/home";
  fetchRes = fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "func": "get_usernames"
    })
  })

  // fetchRes is the promise to resolve
  // it by using.then() method
  // .then(data=>{ console.log(data); })
  fetchRes.then(res => res.json()).then((data) => {
    data = JSON.parse(data)

    usernames = data.data

    let select = document.getElementById('usernameDropDown');
    select.name = "usernameDropDown";
    select.id = "usernameDropDown";


    for (const username of usernames) {
      usernameString = username[0]
      var option = document.createElement("option");
      option.value = usernameString;
      option.text = usernameString.charAt(0).toUpperCase() + usernameString.slice(1);
      select.appendChild(option);
    }

    // document.getElementById('usernameDropDown').innerHTML = select.innerHTML
    // document.getElementsByClassName("form")[0].appendChild(label).appendChild(select);


  })

  // usernames are returned in this array

}