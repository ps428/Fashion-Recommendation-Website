const pwd = "/home/pranav/Desktop/Github/FashionRecommendation/product_imgs"

function makeItemUser(imageName, productID, productArtist, productCategory, productID) {
  //can customize the path of image from here
  const imagePath = pwd + '/' + imageName;

  const htmlData = `
    <div class="productCard" id="product${productID}">
      <div class="productImg">
        <img src="${imagePath}">
      </div>
      <div class="productId">${productID}</div>
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
      <div class="productId">${productID}</div>
      <div class="productTitle">${productArtist} | ${productCategory} </div>
      <div class="productQuantity'>${totalQuantity}</div>
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
  artistChartCTX = document.getElementById('artistChart').getContext('2d');
  categoryChartCTX = document.getElementById('categoryChart').getContext('2d');


  var xValuesCategory = Object.keys(jsonData.Category) 
  var yValuesCategory = Object.values(jsonData.Category);
  var barColorsCategory =[];
  
  let hue=0;
  for(i=0;i<xValuesCategory.length;i++){
    let color = "hsl(" + hue + ",100%,50%)"      
    barColorsCategory.push(color)
    hue += 500
  }

  var xValuesArtist = Object.keys(jsonData.Artist) 
  var yValuesArtist = Object.values(jsonData.Artist);
  var barColorsArtist =[];
  
  hue=0;
  for(i=0;i<xValuesArtist.length;i++){
    let color = "hsl(" + hue + ",100%,50%)"      
    barColorsArtist.push(color)
    hue += 500  }

  chart =new Chart(categoryChartCTX, {
    type: "pie",
    data: {
      labels: xValuesCategory,
      datasets: [{
        backgroundColor: barColorsCategory,
        data: yValuesCategory
      }]
    },
    options: {
      title: {
        display: true,
        text: "Category chart"
      }
    }
  });

  chart =new Chart(artistChartCTX, {
    type: "pie",
    data: {
      labels: xValuesArtist,
      datasets: [{
        backgroundColor: barColorsArtist,
        data: yValuesArtist
      }]
    },
    options: {
      title: {
        display: true,
        text: "Category chart"
      }
    }
  });
}


/*
 * @param {String} typeOfData
 '1': get_all_charts, get_user_recommendations, get_user_products
 '2': get_topN_products, get_topN_attributes
*/
function sendUserID(typeOfData) {
 
  // to add future password check here
  let endpoint = "";

  let fetchRes;
  switch (typeOfData) {
    case "1":
      endpoint = "http://localhost:8000/personalization";
      let username = document.getElementById("username").value;

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

    case "2":
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
        let parentDiv = document.getElementById("resultDiv").innerHTML = "";
        data = JSON.parse(data);

        parentDiv = makeItemContainerTrending(parentDiv, data);
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
        document.getElementById("resultDiv2").innerHTML = "";
        // fData=JSON.stringify(data);
        // str = fData.replace(/\\/g, '');
        // console.log("modified str - " + str);

        let html = "";
        for (const key in data) {
          let pdtNo = 1;
          let pdtData = "";
          let headingText = "";
          switch (key.toString()) {
            case "category":
              headingText = "categories";
              break;
            case "artist":
            case "theme":
              headingText = key + "s";
              break;
          }
          html += '<div style="display:inline;float:left;padding:20px;">  <h5>Top ' + headingText + '</h5>';
          data[key] = JSON.parse(data[key]);
          // eachObjData.forEach((pdtData, index) => {
          for (let i = 0; i < Object.keys(data[key]).length; i++) {
            let pdtData = data[key][i];
            html += `<div id="product_${pdtNo}" >
                            ${pdtData[key + "_id"]} | ${pdtData[key]} | ${pdtData["total_quantity"]}
                        </div>`;
            pdtNo++;
          }
          html += "</div>";
        }
        document.getElementById("resultDiv2").innerHTML = "<h2>Top N Attributes</h2>" + html;
      })
      break;
  }
}
