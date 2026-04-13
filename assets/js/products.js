function renderProducts(){
 renderFilteredProducts(products);
}

function updateStock(id,newStock){
 products.forEach(p=>{
  if(p.id === id){
   const oldStock = parseInt(p.stock);
   const parsedNewStock = parseInt(newStock);
   if(isNaN(parsedNewStock)) return;

   if(parsedNewStock < oldStock){
    const reason = prompt("Reason for manual stock deduction:", "Manual adjustment");
    const note = reason ? reason.trim() : "Manual stock deduction";
    recordTransaction(p.id, oldStock - parsedNewStock, "Manual stock deduction", "manual", note);
   } else if(parsedNewStock > oldStock){
    const reason = prompt("Reason for manual stock addition:", "Manual adjustment");
    const note = reason ? reason.trim() : "Manual stock addition";
    recordTransaction(p.id, parsedNewStock - oldStock, "Manual stock addition", "manual", note);
   }

   p.stock = parsedNewStock;
  }
 });

 saveProducts();
}

function showTransactionHistory(id){
 const product = products.find(p => p.id === id);
 if(!product) return;
 const history = getProductTransactions(id);
 const historyBody = document.getElementById("transactionHistoryBody");
 const historyTitle = document.getElementById("transactionHistoryTitle");
 const historyStock = document.getElementById("transactionHistoryStock");

 historyTitle.textContent = `Transaction History — ${product.name}`;
 historyStock.textContent = `Current Stock: ${product.stock}`;
 historyBody.innerHTML = "";

 if(history.length === 0){
  historyBody.innerHTML = `<tr><td colspan=4 class="p-3 text-center text-gray-500">No deduction history for this product.</td></tr>`;
 } else {
  history.forEach(entry => {
   historyBody.innerHTML += `
   <tr class="border-b">
    <td class="p-3">${entry.date}</td>
    <td class="p-3">${entry.quantity}</td>
    <td class="p-3">${entry.cause}</td>
    <td class="p-3">${entry.note || "-"}</td>
   </tr>
   `;
  });
 }

 document.getElementById("transactionHistoryModal").classList.remove("hidden");
}

function closeHistoryModal(){
 document.getElementById("transactionHistoryModal").classList.add("hidden");
}

function addProduct(){
 const name = document.getElementById("name").value;
 const price = Number(document.getElementById("price").value);
 const stock = parseInt(document.getElementById("stock").value);

 if(!name || isNaN(price) || isNaN(stock)){
  alert("Please enter valid product details.");
  return;
 }

 const newProduct = {
  id: Date.now(),
  name,
  price,
  stock
 };

 products.push(newProduct);
 if(stock > 0){
  recordTransaction(newProduct.id, stock, "Initial stock addition", "manual", "Product created with stock");
 }

 saveProducts();
 renderProducts();
}

function deleteProduct(id){

products = products.filter(p => p.id !== id);

saveProducts();

renderProducts();

}

window.onload = renderProducts;

function searchProducts(){

const keyword = document.getElementById("searchProduct").value.toLowerCase();

const filtered = products.filter(p =>
 p.name.toLowerCase().includes(keyword)
);

renderFilteredProducts(filtered);

}

function renderFilteredProducts(list){

const table = document.getElementById("productTable");

table.innerHTML = "";

list.forEach(product=>{

table.innerHTML += `
<tr class="border-b">

<td class="p-3">${product.name}</td>
<td class="p-3">₱${product.price}</td>

<td class="p-3">
<input type="number"
value="${product.stock}"
onchange="updateStock(${product.id}, this.value)"
class="border p-1 w-20">
</td>

<td class="p-3 space-y-2">
<button onclick="showTransactionHistory(${product.id})"
class="bg-indigo-500 text-white px-2 py-1 rounded w-full">
Transaction History
</button>
<button onclick="deleteProduct(${product.id})"
class="bg-red-500 text-white px-2 py-1 rounded w-full">
Delete
</button>

</td>

</tr>
`;

});

}