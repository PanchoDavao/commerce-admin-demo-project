let products = JSON.parse(localStorage.getItem("products")) || [
 {id:1,name:"Wireless Mouse",price:450,stock:20},
 {id:2,name:"Mechanical Keyboard",price:2500,stock:8},
 {id:3,name:"Gaming Headset",price:1800,stock:15}
];

let orders = JSON.parse(localStorage.getItem("orders")) || [];

let customers = JSON.parse(localStorage.getItem("customers")) || [
 {id:1,name:"John Doe",email:"john@email.com",phone:"09171234567",address:"123 Main St, Cityville",date:"2026-04-01"},
 {id:2,name:"Maria Santos",email:"maria@email.com",phone:"09171234568",address:"456 Oak Ave, Townsville",date:"2026-04-05"},
 {id:3,name:"John Woe",email:"johnwoe@email.com",phone:"09171234569",address:"789 Pine Rd, Villagetown",date:"2026-04-08"}
];

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveProducts(){
 localStorage.setItem("products", JSON.stringify(products));
}

function saveOrders(){
 localStorage.setItem("orders", JSON.stringify(orders));
}

function saveCustomers(){
 localStorage.setItem("customers", JSON.stringify(customers));
}

function saveTransactions(){
 localStorage.setItem("transactions", JSON.stringify(transactions));
}

function recordTransaction(productId, quantity, cause, type = "deduction", note = ""){
 const now = new Date();
 transactions.push({
  id: Date.now(),
  productId,
  quantity,
  cause,
  type,
  note,
  date: now.toLocaleDateString() + " " + now.toLocaleTimeString(),
  dateISO: now.toISOString()
 });
 saveTransactions();
}

function getProductTransactions(productId){
 return transactions
  .filter(t => t.productId === productId)
  .sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
}
