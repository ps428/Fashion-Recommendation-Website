const pwd = "/home/pranav/Desktop/Github/FashionRecommendation/product_imgs"


function makeItemUser(imageName, productID, productArtist, productCategory, productNumber) {
  //can customize the path of image from here
  const imagePath = pwd + '/' + imageName;

  const htmlData = `
    <div class="productCard" id="product${productNumber}">
      <div class="productImg">
          <img src="${imagePath}">
      </div>
      <div class="productId">Product ID: ${productID}</div>
      <div class="productTitle">${productArtist} | ${productCategory} </div>
    </div>
  `;
  return htmlData;
}

function makeItemContainerUser(parentDiv, data) {
  let productNumber = 1;

  data.forEach((pdtData, index) => {
    const htmlItemData = makeItemUser(pdtData.img_name, pdtData.product_id, pdtData.artist, pdtData.category, productNumber);
    parentDiv += htmlItemData;
    productNumber++;
  });

  return parentDiv;
}



function makeItemTrending(imageName, productID, productArtist, productCategory, productNumber, totalQuantity) {
  //can customize the path of image from here
  const imagePath = pwd + '/' + imageName;

  const htmlData = `
    <div class="productCard" id="product${productNumber}">
      <div class="productImg">
          <img src="${imagePath}">
      </div>
      <div class="productId">Product ID: ${productID}</div>
      <div class="productTitle">${productArtist} | ${productCategory} </div>
      <div class="productQuantity">Quantity: ${totalQuantity}</div>
      </div>
  `;
  return htmlData;
}

function makeItemContainerTrending(parentDiv, data) {
  let productNumber = 1;

  data.forEach((pdtData, index) => {
    const htmlItemData = makeItemTrending(pdtData.img_name, pdtData.product_id, pdtData.artist, pdtData.category, productNumber, pdtData.total_quantity);
    parentDiv += htmlItemData;
    productNumber++;
  });

  return parentDiv;
}

function makePie(jsonData) {
  document.getElementById('userCharts').style.height = '300px';
  document.getElementById('userCharts').innerHTML = `
  <div class="chart">
    <canvas id="categoryChart" style="width: 85%; height: 300px;display: inline-block;"></canvas>
  </div>
  <div class="chart">
    <canvas id="artistChart" style="width: 85%; height: 300px;display: inline-block;"></canvas>
  </div>
  `

  artistChartCTX = document.getElementById('artistChart').getContext('2d');
  categoryChartCTX = document.getElementById('categoryChart').getContext('2d');


  var xValuesCategory = Object.keys(jsonData.Category);
  var yValuesCategory = Object.values(jsonData.Category);
  var barColorsCategory = [];

  const colorArray = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

  let sum = 0;
  for (i = 0; i < yValuesCategory.length; i++) {
    barColorsCategory.push(colorArray[i % 20]);
    sum += parseInt(yValuesCategory[i]);
  }
  console.log(sum)
  for (i = 0; i < yValuesCategory.length; i++) {
    console.log(yValuesCategory[i] / sum * 100)
    yValuesCategory[i] = (parseInt(yValuesCategory[i]) / sum * 100).toFixed(2);
  }

  var xValuesArtist = Object.keys(jsonData.Artist)
  var yValuesArtist = Object.values(jsonData.Artist);
  var barColorsArtist = [];

  let sum2 = 0;
  for (i = 0; i < yValuesArtist.length; i++) {
    barColorsArtist.push(colorArray[i % 20]);
    sum2 += parseInt(yValuesArtist[i]);
  }


  for (i = 0; i < yValuesArtist.length; i++) {
    yValuesArtist[i] = (parseInt(yValuesArtist[i]) / sum2 * 100).toFixed(2);
  }

  chart = new Chart(categoryChartCTX, {
    type: "pie",
    data: {
      labels: xValuesCategory,
      datasets: [{
        hoverBackgroundColor: 'grey',
        hoverBorderColor: 'black',
        hoverBorderWidth: '1',
        backgroundColor: barColorsCategory,
        data: yValuesCategory
      }]
    },
    options: {
      responsive: false,
      legend: {
        position: "bottom",
        align: "middle"
      },

      title: {
        display: true,
        text: "Category Preferences"
      }
    }
  });

  chart = new Chart(artistChartCTX, {
    type: "pie",
    data: {
      labels: xValuesArtist,
      datasets: [{

        hoverBackgroundColor: 'grey',
        hoverBorderColor: 'black',
        hoverBorderWidth: '1',
        backgroundColor: barColorsArtist,
        data: yValuesArtist
      }]
    },
    options: {
      responsive: false,
      legend: {
        position: "bottom",
        align: "middle"
      },

      title: {
        display: true,
        text: "Artist Preferences"
      }
    }
  });
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

/*
 * @param {String} typeOfData
 '1': get_all_charts, get_user_recommendations, get_user_products
 '2': get_topN_products, get_topN_attributes
 '3': this needs product id, to get trends of a particular product
*/
function sendUserID(typeOfData, productID = "") {

  // to add future password check here
  let endpoint = "";

  let fetchRes;
  switch (typeOfData) {
    case "1" || 1:

      let noElements = document.getElementsByClassName('noElements')

      while (noElements.length > 0) {
        noElements[0].parentElement.removeChild(noElements[0]);
      }
      endpoint = "http://localhost:8000/personalization";
      let username = document.getElementById("usernameDropDown").value;
      console.log(username)
     if(username=="Select Username"){
      //set all values to null
      document.getElementById('userCharts').style.height = '0px';
      document.getElementById('userCharts').innerHTML = ''
      document.getElementById('recommendedProducts').innerHTML = ''
      document.getElementById('userProducts').innerHTML = ''

      //display null error on page
      let errorMessage1 = document.createElement('div')
      errorMessage1.className = 'noElements'
      errorMessage1.innerHTML = 'NO RECORDS TO SHOW'

      let errorMessage2 = document.createElement('div')
      errorMessage2.className = 'noElements'
      errorMessage2.innerHTML = 'NO RECORDS TO SHOW'

      let errorMessage3 = document.createElement('div')
      errorMessage3.className = 'noElements'
      errorMessage3.innerHTML = 'NO RECORDS TO SHOW'

      document.getElementsByClassName('errorOuter')[0].appendChild(errorMessage1)
      document.getElementsByClassName('errorOuter')[1].appendChild(errorMessage2)
      document.getElementsByClassName('errorOuter')[2].appendChild(errorMessage3)

      return;
     }
      // API for get requests
      fetchRes = fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "func": "get_piecharts_data",
          "username": username.toString()
        })
      })

      // fetchRes is the promise to resolve
      // it by using.then() method
      // .then(data=>{ console.log(data); })

      fetchRes.then(res => res.json()).then((data) => {
        makePie(data)
      })

      // API for get requests
      fetchRes = fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "func": "get_user_recommendations",
          "username": username.toString()
        })
      })

      // fetchRes is the promise to resolve
      // it by using.then() method
      fetchRes.then(res => res.json()).then((data) => {
        let parentDivHTML = "";
        data = JSON.parse(data);

        parentDivHTML = makeItemContainerUser(parentDivHTML, data);
        document.getElementById("recommendedProducts").innerHTML = parentDivHTML;
      })

      // API for purchased products
      fetchRes = fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "func": "get_user_products",
          "username": username.toString()
        })
      })

      // fetchRes is the promise to resolve
      // it by using.then() method
      fetchRes.then(res => res.json()).then((data) => {
        let parentDivHTML = "";
        data = JSON.parse(data);

        parentDivHTML = makeItemContainerUser(parentDivHTML, data);
        document.getElementById("userProducts").innerHTML = parentDivHTML
      })
      break;

    case "2" || 2:
      endpoint = "http://localhost:8000/trending";

      // API for get requests
      fetchRes = fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "func": "get_topN_products"
        })
      })

      // fetchRes is the promise to resolve
      // it by using.then() method
      // .then(data=>{ console.log(data); })


      fetchRes.then(res => res.json()).then((data) => {
        let parentDiv = "";
        data = JSON.parse(data);

        parentDiv = makeItemContainerTrending(parentDiv, data);
        document.getElementById("topProducts").innerHTML = parentDiv;
      })

      // API for get requests
      fetchRes = fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "func": "get_topN_attributes"
        })
      })
      // fetchRes is the promise to resolve
      // it by using.then() method

      fetchRes.then(res => res.json()).then((data) => {
        console.log(data)
        // console.log(JSON.parse(data))
        console.log(JSON.parse(data['category']))

        let htmlDataArtist = 
        `
        <table class="table">
          <tr>
            <th>S.No</th>
            <th>Artist Name</th>
            <th>Total Quantity</th>
          </tr>
        `
        const artistData = JSON.parse(data.artist);

        for(i=0;i<artistData.length;i++){
          htmlDataArtist+=
          `
          <tr>
            <td>${i+1}</td>
            <td>${artistData[i].artist}</td>
            <td>${artistData[i].total_quantity}</td>
          </tr>
          `
        }
        
        htmlDataArtist+='</table>'

        let htmlDataCategory = 
        `
        <table class="table">
          <tr>
            <th>S.No</th>
            <th>Category Name</th>
            <th>Total Quantity</th>
          </tr>
        `
        const categoryData = JSON.parse(data.category);
        
        for(i=0;i<categoryData.length;i++){
          htmlDataCategory+=
          `
          <tr>
            <td>${i+1}</td>
            <td>${categoryData[i].category}</td>
            <td>${categoryData[i].total_quantity}</td>
          </tr>
          `
        }
        
        htmlDataCategory+='</table>'

        document.getElementById('artistTable').innerHTML = htmlDataArtist;
        document.getElementById('categoryTable').innerHTML = htmlDataCategory;

        // document.getElementById("resultDiv2").innerHTML = "";
        // // str = fData.replace(/\\/g, '');
        // // console.log("modified str - " + str);

        // let html = "";
        // for (const key in data) {
        //   let pdtNo = 1;
        //   let pdtData = "";
        //   let headingText = "";
        //   switch (key.toString()) {
        //     case "category":
        //       headingText = "categories";
        //       break;
        //     case "artist":
        //     case "theme":
        //       headingText = key + "s";
        //       break;
        //   }
        //   html += '<div style="display:inline;float:left;padding:20px;">  <h5>Top ' + headingText + '</h5>';
        //   data[key] = JSON.parse(data[key]);
        //   // eachObjData.forEach((pdtData, index) => {
        //   for (let i = 0; i < Object.keys(data[key]).length; i++) {
        //     let pdtData = data[key][i];
        //     html += `<div id="product_${pdtNo}" >
        //                     ${pdtData[key + "_id"]} | ${pdtData[key]} | ${pdtData["total_quantity"]}
        //                 </div>`;
        //     pdtNo++;
        //   }
        //   html += "</div>";
        // }
        // document.getElementById("resultDiv2").innerHTML = "<h2>Top N Attributes</h2>" + html;
      })
      break;

    case "3" || 3:
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

      break;
  }
}
