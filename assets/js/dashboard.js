window.onload = function(){

const totalProductsEl = document.getElementById("totalProducts");
const totalOrdersEl = document.getElementById("totalOrders");
const cancelledOrdersEl = document.getElementById("cancelledOrders");
const revenueEl = document.getElementById("revenue");
const cancelledRevenueEl = document.getElementById("cancelledRevenue");

if(totalProductsEl) totalProductsEl.innerText = products.length;
// Total Orders (exclude cancelled)
const activeOrders = orders.filter(o => o.status !== "Cancelled");

if(totalOrdersEl) totalOrdersEl.innerText = activeOrders.length;

// Cancelled Orders
const cancelledOrders = orders.filter(o => o.status === "Cancelled");
if(cancelledOrdersEl) cancelledOrdersEl.innerText = cancelledOrders.length;

// Revenue (count only delivered orders)
let revenue = 0;

orders
.filter(o => o.status === "Delivered")
.forEach(o=>{
 revenue += o.total;
});

if(revenueEl) revenueEl.innerText = "₱" + revenue;

// Cancelled Revenue
let cancelledRevenue = 0;
cancelledOrders.forEach(o => {
 cancelledRevenue += o.total;
});
if(cancelledRevenueEl) cancelledRevenueEl.innerText = "₱" + cancelledRevenue;

if(document.getElementById("lowStockList")){
 showLowStock();
}

// Create Sales Chart
const ctx = document.getElementById('salesChart').getContext('2d');
new Chart(ctx, {
 type: 'bar',
 data: {
  labels: ['Total Products', 'Orders', 'Cancelled Orders', 'Revenue', 'Cancelled Revenue'],
  datasets: [{
   label: 'Metrics',
   data: [products.length, activeOrders.length, cancelledOrders.length, revenue, cancelledRevenue],
   backgroundColor: [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)'
   ],
   borderColor: [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)'
   ],
   borderWidth: 1
  }]
 },
 options: {
  scales: {
   y: {
    beginAtZero: true
   }
  },
  plugins: {
   tooltip: {
    callbacks: {
     label: function(context) {
      let label = context.dataset.label || '';
      if (label) {
       label += ': ';
      }
      if (context.parsed.y !== null) {
       if (context.dataIndex === 3 || context.dataIndex === 4) { // Revenue and Cancelled Revenue
        label += '₱' + context.parsed.y;
       } else {
        label += context.parsed.y;
       }
      }
      return label;
     }
    }
   }
  }
 }
});

}

function showLowStock(){
 const list = document.getElementById("lowStockList");
 list.innerHTML = "";
 const lowStockItems = products.filter(p => p.stock <= 5);
 if(lowStockItems.length === 0){
  list.innerHTML = "<li class='text-gray-500'>No low-stock products.</li>";
  return;
 }
 lowStockItems.forEach(p => {
  list.innerHTML += `
   <li class="text-red-500 mb-2">
    ⚠ ${p.name} (Only ${p.stock} left)
   </li>
  `;
 });
}

function globalSearch(){

const keyword = document.getElementById("globalSearch").value.toLowerCase();
const resultsDiv = document.getElementById("searchResults");

if(keyword === ""){
 resultsDiv.innerHTML = "";
 return;
}

// search products
const filteredProducts = products.filter(p =>
 p.name.toLowerCase().includes(keyword)
);

// search customers
const filteredCustomers = customers.filter(c =>
 c.name.toLowerCase().includes(keyword)
);

// search orders
const filteredOrders = orders.filter(o =>
 o.customer.toLowerCase().includes(keyword)
);

let html = "";

if(filteredProducts.length > 0){
 html += "<h3 class='text-lg font-bold mb-2'>Products:</h3><ul class='mb-4'>";
 filteredProducts.forEach(p => {
  html += `<li class="p-2 bg-white rounded shadow mb-1">${p.name} - ₱${p.price} (Stock: ${p.stock})</li>`;
 });
 html += "</ul>";
}

if(filteredCustomers.length > 0){
 html += "<h3 class='text-lg font-bold mb-2'>Customers:</h3><ul class='mb-4'>";
 filteredCustomers.forEach(c => {
  html += `<li class="p-2 bg-white rounded shadow mb-1">${c.name} - ${c.email}</li>`;
 });
 html += "</ul>";
}

if(filteredOrders.length > 0){
 html += "<h3 class='text-lg font-bold mb-2'>Orders:</h3><ul class='mb-4'>";
 filteredOrders.forEach(o => {
  html += `<li class="p-2 bg-white rounded shadow mb-1">Order #${o.id} by ${o.customer} - ₱${o.total}</li>`;
 });
 html += "</ul>";
}

if(filteredProducts.length === 0 && filteredCustomers.length === 0 && filteredOrders.length === 0){
 html = "<p class='text-gray-500'>No results found.</p>";
}

resultsDiv.innerHTML = html;

}