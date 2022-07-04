const loginSection = document.querySelector("#login-section");
const signupSection = document.querySelector("#signup-section");
const signupForm = signupSection.querySelector('#signup-form')
const orderSection = document.querySelector("#order-section");
const loginForm = document.querySelector("#login-form");
const userDetails = orderSection.querySelector("#user-details");
const logoutBtn = orderSection.querySelector("#logout-btn");
const foodMenu = orderSection.querySelector(".food-menu");
const mobile = localStorage.getItem("mobile");
const cartBtn = document.querySelector("#cart-btn");
const cartModal = document.querySelector("#cart-modal");
const cartCloseBtn = cartModal.querySelector(".close");
const addressDetails = document.querySelector("#address-details");
const addressForm = addressDetails.querySelector("#address-form")
const orderPlacedButton = document.querySelector('#order-placed-button')
const orderConfirmMessage = document.querySelector('.order-confirm-message')
const crossButton = document.querySelector(".cross-button")
const navigateSignup = document.querySelector("#navigate-signup")
const navigateLogin = document.querySelector('#navigate-login')
const signupError = signupForm.querySelector("#signup-error");
const loginError = loginForm.querySelector("#login-error");
const orderedItemSection = document.querySelector("#ordered-items-section")
const orderedItemsButton = document.querySelector("#ordered-items")
const terminateOrderSection = document.querySelector("#terminate-order-section")
const orders = document.querySelector(".orders")
const apiBase='http://restaurant.nikitarawat.site/api';
if (localStorage.getItem("is-logged-in") === "true") {
  user = JSON.parse(localStorage.getItem("user"))
  login()
  loadOrderedItems()

}

logoutBtn.addEventListener("click", logout);

let foodItems = [];
let cart = [];


function updateCart() {
  let total = 0;
  cart.forEach((e) => {
    total += e.count;
  });

  cartBtn.textContent = "Cart: " + total + " items";

}

function addToCart(id) {
  const current = cart.find((i) => i.id === id);
  if (current) current.count++;
  else
    cart.push({
      id: id,
      count: 1,
    });
  updateCart();
}

function removeFromCart(id) {
  const current = cart.find((i) => i.id === id);
  if (current) {
    current.count--;
    if (current.count === 0) {
      const index = cart.indexOf(current);
      cart.splice(index, 1);
    }
  }
  updateCart();
}

function logout() {
  loginSection.style.display = "flex";
  orderSection.style.display = "none";
  localStorage.clear();
  orders.innerHTML = ""; 
  cart=[]
  updateCart();
 
}

function login() {
  loginSection.style.display = "none";
  signupSection.style.display = "none";
  orderSection.style.display = "block";
  if (localStorage.getItem("is-logged-in") === "true") {
    user = JSON.parse(localStorage.getItem("user"))
    userDetails.innerHTML = "<h3>" + user.name + "</h3>";

  }
  loadFoodItems();
  loadOrderedItems()

}
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const submitBtn = signupForm.querySelector("#signup-btn");
  submitBtn.innerHTML = "";
  submitBtn.innerHTML = "..."
  submitBtn.disabled = true;
  const data = new FormData(signupForm);

  const body = {
    email: data.get("email"),
    name: data.get("name"),
    password: data.get("password"),
    c_password: data.get("c_password")
  }
  fetch(apiBase+"/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json"
    }
  }).then(res => res.json())
    .then(res => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Signup";
      if (!res.status) {
        signupError.classList.add("show");
        setTimeout(()=>{
          signupError.classList.remove("show");

        },3000)
        signupError.textContent = res.message;
      } else {
        localStorage.setItem("is-logged-in", "true");
        localStorage.setItem('user', JSON.stringify(res.user))
        user = res.user.name;
        signupForm.reset();
        login();

      }
    })
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const submitBtn = loginForm.querySelector("#login-btn");
  submitBtn.innerHTML = "";
  submitBtn.innerHTML = "...";
  submitBtn.disabled = true;
  const data = new FormData(loginForm);
  const body = {
    email: data.get("email"),
    password: data.get("password")
  }
  fetch(apiBase+"/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json"
    }
  }).then(res => res.json())
    .then(res => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Login";
      if (!res.status) {
        
        loginError.classList.add("show");
        setTimeout(()=>{
          loginError.classList.remove("show");

        },3000)
        loginError.textContent = res.message;
      } else {
        localStorage.setItem("is-logged-in", "true");
        localStorage.setItem('user', JSON.stringify(res.user))
        loginForm.reset();
        login()
      }
      
    })
});

function addFoodItem(item) {
  
  const card = document.createElement("div");
  card.className = "card";
  card.id = "food-item-" + item.id;

  const image = document.createElement("img");
  image.src = item.picture;
  image.alt = item.u_name;

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";
  const titleContainer = document.createElement("div");
  const foodName = document.createElement("h3");
  foodName.textContent = item.u_name;
  const foodPrice = document.createElement("span");
  foodPrice.className = "price";
  foodPrice.textContent = "₹ " + item.price;

  titleContainer.appendChild(foodName);
  titleContainer.appendChild(foodPrice);
  cardHeader.appendChild(titleContainer);

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  cardHeader.appendChild(buttonContainer);

  card.appendChild(image);
  card.appendChild(cardHeader);
  foodMenu.appendChild(card);
  updateButtons(buttonContainer, item.id);
}

function updateButtons(buttonContainer, id) {
  buttonContainer.innerHTML = "";
  function addItem() {
    addToCart(id);
    updateButtons(buttonContainer, id);
  }
  function removeItem() {
    removeFromCart(id);
    updateButtons(buttonContainer, id);
  }
  const cartItem = cart.find((i) => i.id === id);
  if (cartItem) {
    const quantityMenu = document.createElement("div");
    quantityMenu.className = "quantity-menu";
    const addButton = document.createElement("button");
    const removeButton = document.createElement("button");
    addButton.innerHTML = '<img alt="plus" src="icons/plus.svg">';
    removeButton.innerHTML = '<img alt="minus" src="icons/minus.svg">';
    const span = document.createElement("span");
    span.textContent = cartItem.count;
    quantityMenu.appendChild(removeButton);
    quantityMenu.appendChild(span);
    quantityMenu.appendChild(addButton);
    buttonContainer.appendChild(quantityMenu);
    addButton.addEventListener("click", addItem);
    removeButton.addEventListener("click", removeItem);
  } else {
    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    buttonContainer.appendChild(addButton);
    addButton.addEventListener("click", addItem);
  }
}

function renderItems() {
  foodMenu.innerHTML = "";
  for (let i = 0; i < foodItems.length; i++) {
    addFoodItem(foodItems[i]);
  }
}

function loadFoodItems() {
  foodMenu.innerHTML =""
  foodMenu.innerHTML = '<div class="loader"></div>';
  fetch(apiBase+"/food-items")
    .then(function (res) {
      return res.json();
    })
    .then(function (item) {
      foodItems = item.items;
      renderItems();
    });
}



/*
<div class="cart-item">
    <span class="title">Palak Paneer</span>
    <span class="price">200.00</span>
    <div class="quantity-menu">
        <button>
            <img alt="minus" src="icons/minus.svg">
        </button>
        <span>10</span>
        <button>
            <img alt="minus" src="icons/plus.svg">
        </button>
    </div>
</div>
*/





function getTotal() {
  let total = 0;
  cart.forEach(function (item) {
    const foodItem = foodItems.find((i) => item.id === i.id);
    total += foodItem.price * item.count;
  });
  return total;
}

function placeOrder(data) {
  const promise = new Promise((resolve, reject) => {
    const totalCount = cart.reduce((sum, curr) => sum + curr.count, 0)
    if (totalCount === 0) {
      setTimeout(() => {
        reject({
          status: 0,
          message: 'something went wrong!'
        })
      }, 0)
    } else {
      setTimeout(() => {
        resolve({
          status: 1,
          message: 'Order Placed!'
        })
      }, 0000)
    }
  })
  return promise;
}

function confirmOrder() {

  if (cart.length === 0) return;
  const mobile = localStorage.getItem('mobile')
  const orderDetails = {
    mobile: mobile,
    items: cart
  }
  const orderBtn = cartModal.querySelector('.cart-footer button')

  placeOrder(orderDetails)
    .then(res => {
      cart = []
      updateCart()
      cartModal.classList.add("show")
      const cartItemsDiv = cartModal.querySelector(".items");
      const cartFooter = cartModal.querySelector(".cart-footer");
      cartFooter.innerHTML = "";
      cartItemsDiv.innerHTML = '<img src="icons/order-confirmed.svg" class="cart-empty" /> <br/> ' + res.message;
      renderItems()
    })
    .catch(e => {
      orderBtn.innerHTML = 'Order Now'
      alert(e.message)
    })
  orderBtn.innerHTML = '<div class="loader"></div>'
  addressDetails.style.display = "none";
  cartModal.classList.remove("show");
  orderSection.style.display = "block";

}
function openAddressBlock() {
  addressDetails.style.display = "flex";
  cartModal.classList.remove("show");
  orderSection.style.display = "none";

}

function openCart() {
  const cartItemsDiv = cartModal.querySelector(".items");
  const cartFooter = cartModal.querySelector(".cart-footer");
  cartFooter.innerHTML = "";
  cartItemsDiv.innerHTML = "";
  if (cart.length === 0) {
    cartItemsDiv.innerHTML =
      '<img src="icons/empty-cart.svg" class="cart-empty" /> <br/> Nothing in cart!';
  }
  cart.forEach(function (item) {
    const foodItem = foodItems.find((i) => item.id === i.id);
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    const title = document.createElement("span");
    title.className = "title";
    title.textContent = foodItem.u_name;
    const price = document.createElement("span");
    price.className = "price";
    price.textContent = foodItem.price;
    const quantityMenu = document.createElement("div");
    quantityMenu.className = "quantity-menu";
    const minusButton = document.createElement("button");
    const minusImg = document.createElement("img");
    minusImg.src = "icons/minus.svg";
    minusButton.appendChild(minusImg);
    const quantity = document.createElement("span");
    quantity.textContent = item.count;
    const plusButton = document.createElement("button");
    const plusImg = document.createElement("img");
    plusImg.src = "icons/plus.svg";
    plusButton.appendChild(plusImg);
    quantityMenu.appendChild(minusButton);
    quantityMenu.appendChild(quantity);
    quantityMenu.appendChild(plusButton);
    cartItem.appendChild(title);
    cartItem.appendChild(price);
    cartItem.appendChild(quantityMenu);
    cartItemsDiv.appendChild(cartItem);

    function updateCount() {
      quantity.textContent = item.count;
      const currentFoodItem = foodMenu.querySelector("#food-item-" + item.id);
      const buttonContainer =
        currentFoodItem.querySelector(".button-container");
      updateButtons(buttonContainer, item.id);
      updateTotal();
    }
    function addItem() {
      addToCart(item.id);
      updateCount();
    }
    function removeItem() {
      removeFromCart(item.id);
      updateCount();
      if (item.count === 0) {
        openCart();
      }
    }
    minusButton.addEventListener("click", removeItem);
    plusButton.addEventListener("click", addItem);
  });

  function updateTotal() {
    const total = getTotal();
    cartFooter.innerHTML = ''
    if (total !== 0) {
      const discount = total / 10;
      cartFooter.innerHTML += `
        Total: ₹ ${total} <br/>
        Discount %: 10 <br/>
        Discount in ₹: ${discount} <br/>
        Net Payable: ₹ ${total - discount} <br/>
        <button onclick="openAddressBlock()">Order Now</button>
        `;
    }
  }
  updateTotal();
  cartModal.classList.add("show");
}
function closeCart() {
  cartModal.classList.remove("show");
}

cartBtn.addEventListener("click", openCart);
cartCloseBtn.addEventListener("click", closeCart);

addressForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = addressForm.name.value;
  const mobile = addressForm.mobile.value;
  const pincode = addressForm.pincode.value;
  const state = addressForm.state.value;
  const address = addressForm.address.value;
  const location = addressForm.location.value;
  user = JSON.parse(localStorage.getItem("user"))


  if (mobile.length < 10 || mobile.length > 10) {
    alert("enter valid mobile number")
    return;
  }

  orderPlacedButton.disabled = true;
  orderPlacedButton.innerHTML = "..."
  const total = getTotal();
  const discount = total / 10;
  const payment = total - discount;

  const data = {
    loginId: user.id,
    name: name,
    mobile: mobile,
    pincode: pincode,
    state: state,
    address: address,
    location: location,
    items: cart,
    payment: payment


  }
  console.log(data)
  const result = await fetch(apiBase+"/ordereditems", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
  const res = await result.json();
  if (res.status === 1) {
    confirmOrder()
    loadOrderedItems()
  } else {
    alert(res.message)
  }
  addressForm.reset();
  orderPlacedButton.disabled = false;
  orderPlacedButton.innerHTML = "Place Order";
})
crossButton.addEventListener("click", () => {
  addressDetails.style.display = "none";
  cartModal.classList.remove("show");
  orderSection.style.display = "block";
})
navigateSignup.addEventListener("click", () => {
  loginSection.style.display = "none"
  signupSection.style.display = "flex"
});
navigateLogin.addEventListener("click", () => {
  loginSection.style.display = "flex"
  signupSection.style.display = "none"
});
orderedItemsButton.addEventListener("click", () => {
  orderedItemSection.style.display = "block";
  loginSection.style.display = "none"
  signupSection.style.display = "none"
  orderSection.style.display = "none";

})
terminateOrderSection.addEventListener("click", () => {
  orderedItemSection.style.display = "none";
  loginSection.style.display = "none"
  signupSection.style.display = "none"
  orderSection.style.display = "block";
})

let OrderedItems = [];
function loadOrderedItems() {
  orders.innerHTML = '<div class="loader"></div>';
  fetch(apiBase+"/getordered-items")
    .then(function (res) {
      return res.json();
    })
    .then(function (item) {
      OrderedItems = item.items;

      renderOrderedItems();

    });
}

function renderOrderedItems() {
  orders.innerHTML = "";
  
  for (let i = 0; i < OrderedItems.length; i++) {
    renderOrderedItemSection(OrderedItems[i]);
  }
}

function renderOrderedItemSection(user) {
  const users = JSON.parse(localStorage.getItem("user"))
  
  if (user.loginid === users.id) {
    const divhead = document.createElement('div');
    divhead.className = "orders-check";
    const div = document.createElement("div")
    div.className="order-item"
    const li = document.createElement('li');
    const h5 = document.createElement('h5');
    h5.textContent = "Deliver to " + user.name;

    li.appendChild(h5);
    div.appendChild(li)
    const loc = document.createElement('li');
    loc.className = "location";
    const img = document.createElement('img');
    img.src = "icons/map-pin.svg";
    loc.appendChild(img);
    const span = document.createElement('span');
    span.textContent = user.city + " " + user.pincode;
    loc.appendChild(span)

    div.appendChild(loc)
    divhead.appendChild(div)
    const div1=document.createElement('div')
    div1.className="order-item"
    const arr = JSON.parse(user.itemsordered)
    arr.forEach((i) => {
      const fooditem = foodItems.find((item) => {
        return item.id === i.id
      })
      const li2 = document.createElement('li');
      li2.textContent = fooditem.u_name +" X "+ i.count;
      div1.appendChild(li2)
      
    })
    divhead.appendChild(div1)
    const li4 = document.createElement('li');
    li4.innerHTML = "Total: <b>₹ " + user.total + "</b>";
    const div2=document.createElement('div')
    div2.className="order-item"
    const button = document.createElement('button');
    button.innerHTML = "Cancel Order";
    

    div2.appendChild(li4)
    divhead.appendChild(div2);
    orders.appendChild(divhead);
    const buttonDiv= document.createElement('div')
    buttonDiv.appendChild(button)
    divhead.appendChild(buttonDiv)
    button.addEventListener("click", () => {
      const data = {
        userid: user.id
      }
      const result = fetch(apiBase+"/delete-ordereditems", {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        }
      }).then(res => res.json())
        .then(res => {
          alert(res.message)
          loadOrderedItems()
        })

    })
  }
  
}



