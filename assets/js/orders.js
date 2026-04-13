function renderOrders(){
 renderFilteredOrders(orders);
}

function searchOrders(){
 const keyword = document.getElementById("searchOrder").value.toLowerCase();
 const filtered = orders.filter(order => {
  const product = products.find(p => p.id === order.productId);
  return (
   order.customer.toLowerCase().includes(keyword) ||
   order.status.toLowerCase().includes(keyword) ||
   (product && product.name.toLowerCase().includes(keyword))
  );
 });
 renderFilteredOrders(filtered);
}

function renderFilteredOrders(list){
 const table = document.getElementById("ordersTable");
 table.innerHTML = "";

 const sortedOrders = [...list].sort((a, b) => (b.id || 0) - (a.id || 0));

 sortedOrders.forEach(order => {
  const product = products.find(p => p.id === order.productId);
  const productName = product ? product.name : "Unknown product";
  table.innerHTML += `
<tr class="border-b">

<td class="p-3">${order.customer}</td>
<td class="p-3">${productName}</td>
<td class="p-3">${order.qty}</td>
<td class="p-3">₱${order.total}</td>
<td class="p-3">${order.date}</td>
<td class="p-3">${order.cancelDate ? order.cancelDate : "-"}</td>

<td class="p-3">

<select onchange="updateStatus(${order.id}, this.value)"
class="border p-1">

<option ${order.status=="Pending"?"selected":""}>Pending</option>
<option ${order.status=="Processing"?"selected":""}>Processing</option>
<option ${order.status=="Shipped"?"selected":""}>Shipped</option>
<option ${order.status=="Delivered"?"selected":""}>Delivered</option>
<option ${order.status=="Cancelled"?"selected":""}>Cancelled</option>

</select>

</td>

</tr>
`;
 });
}

function getFormattedDate(){
 const now = new Date();
 return now.toLocaleDateString() + " " + now.toLocaleTimeString();
}

function updateStatus(id,status){
 const order = orders.find(o => o.id === id);
 if(!order) return;

 if(status === "Cancelled" && order.status !== "Cancelled"){
  const product = products.find(p => p.id === order.productId);
  if(product){
   product.stock += order.qty;
   saveProducts();
  }
  order.cancelDate = getFormattedDate();
 }

 if(order.status === "Cancelled" && status !== "Cancelled"){
  const product = products.find(p => p.id === order.productId);
  if(product){
   product.stock -= order.qty;
   saveProducts();
   recordTransaction(product.id, order.qty, "Bought by customer (order reinstated)", "purchase", `Customer: ${order.customer}`);
  }
  order.cancelDate = null;
 }

 order.status = status;
 saveOrders();
 renderOrders();
 showToast("Order updated!");
}

window.onload = function() {
 renderOrders();
 populateOrderForm();
};

function populateOrderForm(){
 const customerSelect = document.getElementById("orderCustomer");
 const productSelect = document.getElementById("orderProduct");

 customerSelect.innerHTML = "";
 productSelect.innerHTML = "";

 customers.forEach(c=>{
  customerSelect.innerHTML += `<option value="${c.name}">${c.name}</option>`;
 });

 products.forEach(p=>{
  productSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
 });
}

function createOrder(){
 const customer = document.getElementById("orderCustomer").value;
 const productId = parseInt(document.getElementById("orderProduct").value);
 const qty = parseInt(document.getElementById("orderQty").value);

 if(!customer || !productId || !qty){
  alert("Please complete the form");
  return;
 }

 const product = products.find(p => p.id === productId);
 if(!product){
  alert("Product not found");
  return;
 }

 if(product.stock < qty){
  showToast("Not enough stock!", "error");
  return;
 }

 const total = product.price * qty;
 const order = {
  id: Date.now(),
  customer,
  productId,
  qty,
  total,
  status: "Pending",
  date: getFormattedDate()
 };

 orders.push(order);
 product.stock -= qty;
 recordTransaction(productId, qty, "Bought by customer", "purchase", `Customer: ${customer}`);

 saveOrders();
 saveProducts();
 renderOrders();
 showToast("Order Created!");
}

function showToast(message, type="success"){
 const toast = document.getElementById("toast");
 toast.innerText = message;
 toast.className =
  "fixed top-5 right-5 px-4 py-2 rounded shadow text-white " +
  (type === "success" ? "bg-green-500" : "bg-red-500");
 toast.style.display = "block";
 setTimeout(()=>{
  toast.style.display = "none";
 }, 2000);
}

