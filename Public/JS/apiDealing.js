const pwd = process.cwd();

function makeItem(imageName, productID, productArtist, productCategory) {
  //can customize the path of image from here
  const imagePath  = pwd+'/'+imageName;

  const htmlData = `
    <div class="productCard">
      <div class="productImg">
        <img src="${imagePath}">
      </div>
      <div class="productId">${productID}</div>
      <div class="productTitle">${productArtist} | ${productCategory} </div>
    </div>
  `

  return htmlData;
}

function makePie(){
  
}

function sendUserID(typeOfData) {
  // 1: get_all_charts, get_user_recommendations, get_user_products
  // 2: get_topN_products, get_topN_attributes

  // to add future password check here
  let username = document.getElementById("username").value;
  let endpoint = "";

  let fetchRes;
  
  switch (typeOfData) {
    case "1":
      endpoint = "http://localhost:8000/personalization";

      // API for get requests
      fetchRes = fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "func": "get_all_charts",
          //"user_id": userID.toString()
          "username": username.toString()
        })
      })

      // fetchRes is the promise to resolve
      // it by using.then() method
      // .then(data=>{ console.log(data); })

      fetchRes.then(res => res.json()).then((data) => {
        document.getElementById("charts").innerHTML = "";
        for (const imageName in data) {
          let html = '<div style="display:inline;float:left;padding:20px;"> <img src="' + data[imageName] + '" /></div>';
          document.getElementById("resultDiv").innerHTML += html;
        }
      })
      // .then(d => {
      //     console.log(d)
      // })

      // API for get requests
      fetchRes = fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "func": "get_user_recommendations",
          //"user_id": userID.toString()
          "username": username.toString()
        })
      })
      // fetchRes is the promise to resolve
      // it by using.then() method
      fetchRes.then(res => res.json()).then((data) => {
        document.getElementById("resultDiv2").innerHTML = "";
        // fData=JSON.stringify(data);
        // str = fData.replace(/\\/g, '');
        // console.log("modified str - " + str);
        data = JSON.parse(data);
        let html = "";
        let pdtNo = 1;
        let pdtData = "";
        html += '<h1>RECOMMENDED PRODUCTS</h1>';
        data.forEach((pdtData, index) => {
          // for (let i=0; i < data.length; i++) {
          console.log(pdtData);
          //html += '<h1>RECOMMENDED PRODUCTS</h1>';
          html += `<div id="product_${pdtNo}" style="display:inline;float:left;padding:75px;">
                        <img src="${pdtData.img_path}" /><br/>
                        product_id = ${pdtData.product_id}<br/>
                        ${pdtData.artist} | ${pdtData.category}
                    </div>`;
          pdtNo++;
        });
        document.getElementById("resultDiv2").innerHTML += html;
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
          //"user_id": userID.toString()
          "username": username.toString()
        })
      })
      // fetchRes is the promise to resolve
      // it by using.then() method
      fetchRes.then(res => res.json()).then((data) => {
        document.getElementById("resultDiv3").innerHTML = "";
        // fData=JSON.stringify(data);
        // str = fData.replace(/\\/g, '');
        // console.log("modified str - " + str);
        data = JSON.parse(data);
        let html = "";
        let pdtNo = 1;
        let pdtData = "";
        html += '<h1>PAST PURCHASED PRODUCTS</h1>';
        data.forEach((pdtData, index) => {
          // for (let i=0; i < data.length; i++) {
          console.log(pdtData);
          //html += '<h1>RECOMMENDED PRODUCTS</h1>';
          html += `<div id="product_${pdtNo}" style="display:inline;float:left;padding:40px;">
                        <img src="${pdtData.img_path}" /><br/>
                        product_id = ${pdtData.product_id}<br/>
                        ${pdtData.artist} | ${pdtData.category}
                    </div>`;
          pdtNo++;
        });
        document.getElementById("resultDiv3").innerHTML += html;
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
        document.getElementById("resultDiv").innerHTML = "";
        data = JSON.parse(data);
        let html = "";
        let pdtNo = 1;
        let pdtData = "";
        data.forEach((pdtData, index) => {
          // for (let i=0; i < data.length; i++) {
          html += `<div id="product_${pdtNo}" style="display:inline;float:left;padding:20px;">
                        <img src="${pdtData.img_path}" /><br/>
                        product_id = ${pdtData.product_id}<br/>
                        ${pdtData.artist} | ${pdtData.category}<br/>
                        Total quantity sold = ${pdtData.total_quantity}
                    </div>`;
          pdtNo++;
        });
        document.getElementById("resultDiv").innerHTML = "<h2>Top Products</h2> <br/><br/>" + html;
      })
      // .then(d => {
      //     console.log(d)
      // })

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
