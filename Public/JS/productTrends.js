window.addEventListener('load', (event) => {
  console.log('page is fully loaded');

  addProductsDropDown();
  addCategoriesDropDown();
  addArtistsDropDown();
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
    // productData = data.data;

    let select = document.getElementById('productsDropDown');
    select.name = "productsDropDown";
    select.id = "productsDropDown";


    for (const product of data.data) {
      productString = product[0]
      //can make custom product name from here
      productString = productString.replace(',',', ')
      productData.push([productString,product[1]])
      var option = document.createElement("option");
      option.value = productString;
      option.text = productString.charAt(0).toUpperCase() + productString.slice(1);
      select.appendChild(option);
    }
    // document.getElementById('usernameDropDown').innerHTML = select.innerHTML
    // document.getElementsByClassName("form")[0].appendChild(label).appendChild(select);
  })
  // product names are returned in this array
}

function addCategoriesDropDown() {

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
    categoryData = data.data;

    let select = document.getElementById('categoriesDropDown');
    select.name = "categoriesDropDown";
    select.id = "categoriesDropDown";

    let categories = new Map();

    for (const category of data.data) {
      categoryString = category[0].split(",")[0]
      categories.set(categoryString,1);
    }
    for (const categoryString of categories) {
      categoryName = categoryString[0]
      var option = document.createElement("option");
      option.value = categoryName;
      option.text = categoryName;
      select.appendChild(option);
    }
  })
  // category names are returned in this array
}

function addArtistsDropDown() {

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
    artistData = data.data;

    let select = document.getElementById('artistsDropDown');
    select.name = "artistsDropDown";
    select.id = "artistsDropDown";

    let artists = new Map();

    for (const artist of data.data) {
      artistString = artist[0].split(",")[1]
      artists.set(artistString,1);
    }
    for (const artistString of artists) {
      artistName = artistString[0]
      var option = document.createElement("option");
      option.value = artistName;
      option.text = artistName;
      select.appendChild(option);
    }
  })
  // category names are returned in this array
}


function makeChartProducts(){
  const productName = document.getElementById('productsDropDown').value;
  if(document.getElementById('errorProducts')){
    const noValue = document.getElementById('errorProducts')
    noValue.parentElement.removeChild(noValue)
  }

  if(productName=='Select Product'){
    document.getElementById('productCharts').innerHTML = ""
    document.getElementById('productCharts').style.height = '0px';

    let errorMessage1 = document.createElement('div')
    errorMessage1.className = 'noElements'
    errorMessage1.id = 'errorProducts'
    errorMessage1.innerHTML = 'NO RECORDS TO SHOW'
    document.getElementsByClassName('errorOuterProduct')[0].appendChild(errorMessage1)

    return
  }
  const productID = getProductID(productName)
  printChartProducts(productID)
}

function makeChartCategories(){
  const categoryName = document.getElementById('categoriesDropDown').value;
  
  if(document.getElementById('errorCategories')){
    const noValue = document.getElementById('errorCategories')
    noValue.parentElement.removeChild(noValue)
  }

  if(categoryName=='Select Category'){
    document.getElementById('categoryCharts').innerHTML = ""
    document.getElementById('categoryCharts').style.height = '0px';

    let errorMessage1 = document.createElement('div')
    errorMessage1.className = 'noElements'
    errorMessage1.id = 'errorCategories'
    errorMessage1.innerHTML = 'NO RECORDS TO SHOW'
    document.getElementsByClassName('errorOuterCategory')[0].appendChild(errorMessage1)

    return
  }
  printChartCategories(categoryName)
}

function makeChartArtists(){
  const artistName = document.getElementById('artistsDropDown').value;
  
  if(document.getElementById('errorArtists')){
    const noValue = document.getElementById('errorArtists')
    noValue.parentElement.removeChild(noValue)
  }

  if(artistName=='Select Character/Movies'){
    document.getElementById('artistCharts').innerHTML = ""
    document.getElementById('artistCharts').style.height = '0px';

    let errorMessage1 = document.createElement('div')
    errorMessage1.className = 'noElements'
    errorMessage1.id = 'errorArtists'
    errorMessage1.innerHTML = 'NO RECORDS TO SHOW'
    document.getElementsByClassName('errorOuterArtist')[0].appendChild(errorMessage1)

    return
  }
  printChartArtists(artistName)
}

function getProductID(productName){
  let productID=-1;
  for(i=0;i<productData.length;i++){
    if(productData[i][0]==productName)
      productID = productData[i][1];
  }
  return productID
}

function printChartProducts(productID) {
  // curl -X POST -H "Content-type: application/json" -d "{\"func\" : \"get_product_trend\",\"product_id\":\"1\"}" "localhost:8000/monthly-trend" 
  endpoint = "http://localhost:8000/monthly-trend";
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

function printChartCategories(categoryName) {
  // curl -X POST -H "Content-type: application/json" -d "{\"func\" : \"get_product_trend\",\"product_id\":\"1\"}" "localhost:8000/monthly-trend" 
  endpoint = "http://localhost:8000/monthly-trend";
  // API for get requests
  fetchRes = fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "func": "get_category_trend",
      "category":categoryName
    })
  })

  // fetchRes is the promise to resolve
  // it by using.then() method
  // .then(data=>{ console.log(data); })


  fetchRes.then(res => res.json()).then((data) => {
    let parentDiv = "";
    makeChartCategoryTrends(data)

    // parentDiv = makeItemContainerTrending(parentDiv, data);
    // document.getElementById("topProducts").innerHTML = parentDiv;
  })

}


function printChartArtists(artistName) {
  // curl -X POST -H "Content-type: application/json" -d "{\"func\" : \"get_product_trend\",\"product_id\":\"1\"}" "localhost:8000/monthly-trend" 
  endpoint = "http://localhost:8000/monthly-trend";
  // API for get requests
  fetchRes = fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "func": "get_artist_trend",
      "artist":artistName
    })
  })

  // fetchRes is the promise to resolve
  // it by using.then() method
  // .then(data=>{ console.log(data); })


  fetchRes.then(res => res.json()).then((data) => {
    let parentDiv = "";
    makeChartArtistTrends(data)

    // parentDiv = makeItemContainerTrending(parentDiv, data);
    // document.getElementById("topProducts").innerHTML = parentDiv;
  })

}


function makeChartProductTrends(jsonData) {
  document.getElementById('productCharts').style.height = '300px';
  document.getElementById('productCharts').innerHTML = `
  <div class="chartTrend">
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
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues,
        borderColor: '#A9A9A9',
        fill:false,
        hoverBackgroundColor: "Black"
      }]
    },
    options: {
      elements: {
        line: {
            tension: 0
        }
    },
      legend: { display: false },
      title: {
        display: true,
        text: "Product Trends"
      }
    }
  });
}


function makeChartCategoryTrends(jsonData) {
  document.getElementById('categoryCharts').style.height = '300px';
  document.getElementById('categoryCharts').innerHTML = `
  <div class="chartTrend">
    <canvas id="categoryChart" style="width: 85%; height: 300px;display: inline-block;"></canvas>
  </div>
  `
  const colorArray = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

  categoryChartCTX = document.getElementById('categoryChart').getContext('2d');

  var xValues = Object.keys(jsonData);
  var yValues = Object.values(jsonData);
  var barColors = [];

  for (i = 0; i < xValues.length; i++) {
    barColors.push(colorArray[i % 20]);
  }

  new Chart(categoryChartCTX, {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        borderColor: '#A9A9A9',
        fill: false,
        data: yValues
      }]
    },
    options: {
      elements: {
        line: {
            tension: 0
        }
    },
      legend: { display: false },
      title: {
        display: true,
        text: "Category Trends"
      }
    }
  });
}


function makeChartArtistTrends(jsonData) {
  document.getElementById('artistCharts').style.height = '300px';
  document.getElementById('artistCharts').innerHTML = `
  <div class="chartTrend">
    <canvas id="artistChart" style="width: 85%; height: 300px;display: inline-block;"></canvas>
  </div>
  `
  const colorArray = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

  artistChartCTX = document.getElementById('artistChart').getContext('2d');

  var xValues = Object.keys(jsonData);
  var yValues = Object.values(jsonData);
  var barColors = [];

  for (i = 0; i < xValues.length; i++) {
    barColors.push(colorArray[i % 20]);
  }

  new Chart(artistChartCTX, {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        borderColor: '#A9A9A9',
        fill:false,
        data: yValues
      }]
    },
    options: {
      elements: {
        line: {
            tension: 0
        }
    },
      legend: { display: false },
      title: {
        display: true,
        text: "Character/Movies Trends"
      }
    }
  });
}