document.addEventListener("DOMContentLoaded", function () {

  productChartCTX = document.getElementById('productChart').getContext('2d');
  categoryChartCTX = document.getElementById('categoryChart').getContext('2d');

  var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
  var yValues = [55, 49, 44, 24, 15];
  var barColors = [
    "#b91d47",
    "#00aba9",
    "#2b5797",
    "#e8c3b9",
    "#1e7145"
  ];

  chart =new Chart(productChartCTX, {
    type: "pie",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      title: {
        display: true,
        text: "Products chart"
      }
    }
  });

  chart =new Chart(categoryChartCTX, {
    type: "pie",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      title: {
        display: true,
        text: "Category chart"
      }
    }
  });
  // chart.render();



});