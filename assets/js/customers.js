function renderCustomers(){
 renderFilteredCustomers(customers);
}

function searchCustomers(){
 const keyword = document.getElementById("searchCustomer").value.toLowerCase();
 const filtered = customers.filter(customer => {
  return (
   customer.name.toLowerCase().includes(keyword) ||
   customer.email.toLowerCase().includes(keyword) ||
   (customer.phone && customer.phone.toLowerCase().includes(keyword)) ||
   (customer.address && customer.address.toLowerCase().includes(keyword)) ||
   (customer.date && customer.date.toLowerCase().includes(keyword))
  );
 });
 renderFilteredCustomers(filtered);
}

function renderFilteredCustomers(list){
 const table = document.getElementById("customerTable");
 table.innerHTML = "";

 list.forEach(customer=>{

table.innerHTML += `
<tr class="border-b">

<td class="p-3">${customer.name}</td>
<td class="p-3">${customer.email}</td>
<td class="p-3">${customer.phone ? customer.phone : "-"}</td>
<td class="p-3">${customer.address ? customer.address : "-"}</td>
<td class="p-3">${customer.date ? customer.date : "-"}</td>
<td class="p-3">

<button onclick="deleteCustomer(${customer.id})"
class="bg-red-500 text-white px-2 py-1 rounded">
Delete
</button>

</td>

</tr>
`;

 });

}
function getFormattedDate(){
 const now = new Date();
 return now.toLocaleDateString() + " " + now.toLocaleTimeString();
}

function addCustomer(){

const name = document.getElementById("customerName").value;
const email = document.getElementById("customerEmail").value;
const phone = document.getElementById("customerPhone").value;
const address = document.getElementById("customerAddress").value;

const newCustomer = {
id: Date.now(),
name,
email,
phone,
address,
date: getFormattedDate()
};

customers.push(newCustomer);

saveCustomers();

renderCustomers();

alert("Customer Added!");

}

function deleteCustomer(id){

customers = customers.filter(c=>c.id !== id);

saveCustomers();

renderCustomers();

}

window.onload = renderCustomers;