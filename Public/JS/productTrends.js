window.addEventListener('load', (event) => {
  console.log('page is fully loaded');

  addProductsDropDown();
});

// it will have product names and product ids mapped
let productData = []

// making the request as get showed some error
function addProductsDropDown() {

  // curl -X POST -H "Content-type: application/json" -d "{\"func\" : \"get_products\"}" "localhost:8000/productData"
  endpoint = "http://localhost:8000/productData";
  fetchRes = fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "func": "get_products"
    })
  })

  // fetchRes is the promise to resolve
  // it by using.then() method
  // .then(data=>{ console.log(data); })
  fetchRes.then(res => res.json()).then((data) => {
    data = JSON.parse(data)
    // console.log(data.data)
    
    //setting global variable for making charts
    productData = data.data;

    let select = document.getElementById('productsDropDown');
    select.name = "productsDropDown";
    select.id = "productsDropDown";


    for (const username of data.data) {
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

function makeChart(){
  const productName = document.getElementById('productsDropDown').value;
  
  if(document.getElementById('errorProducts')){
    const noValue = document.getElementById('errorProducts')
    noValue.parentElement.removeChild(noValue)
  }

  if(productName=='Select Product'){
    document.getElementById('userCharts').innerHTML = ""
    document.getElementById('userCharts').style.height = '0px';

    let errorMessage1 = document.createElement('div')
    errorMessage1.className = 'noElements'
    errorMessage1.id = 'errorProducts'
    errorMessage1.innerHTML = 'NO RECORDS TO SHOW'
    document.getElementsByClassName('errorOuter')[0].appendChild(errorMessage1)

    return
  }
  const productID = getProductID(productName)
  printChart(productID)
}

function getProductID(productName){
  let productID=-1;
  for(i=0;i<productData.length;i++){
    if(productData[i][0]==productName)
      productID = productData[i][1];
  }
  return productID
}

function printChart(productID) {
  endpoint = "http://localhost:8000/trending";

  // API for get requests
  fetchRes = fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "product_id": `${productID}`,
      "func": "get_product_trend"
    })
  })

  // fetchRes is the promise to resolve
  // it by using.then() method
  // .then(data=>{ console.log(data); })


  fetchRes.then(res => res.json()).then((data) => {
    let parentDiv = "";
    makeChartProductTrends(data)

    // parentDiv = makeItemContainerTrending(parentDiv, data);
    // document.getElementById("topProducts").innerHTML = parentDiv;
  })

}


function makeChartProductTrends(jsonData) {
  document.getElementById('userCharts').style.height = '300px';
  document.getElementById('userCharts').innerHTML = `
  <div class="chart">
    <canvas id="productChart" style="width: 85%; height: 300px;display: inline-block;"></canvas>
  </div>
  `
  const colorArray = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

  productChartCTX = document.getElementById('productChart').getContext('2d');

  var xValues = Object.keys(jsonData);
  var yValues = Object.values(jsonData);
  var barColors = [];

  for (i = 0; i < xValues.length; i++) {
    barColors.push(colorArray[i % 20]);
  }

  new Chart(productChartCTX, {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "Product Trends"
      }
    }
  });
}