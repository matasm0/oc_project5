function showCart() {
    let cart = localStorage.getItem("cart")

    let cart_total_price = 0
    let cart_total_quantity = 0
    
    let cart_items = document.getElementById("cart__items")
    
    if (cart == null || cart.length == 0) {
        cart_items.innerHTML = "Cart is empty"
    }
    
    else {
        JSON.parse(cart).forEach(item => {
            let cart_item = `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
                                <div class="cart__item__img">
                                <img src="${item.imageUrl}" alt="${item.altTxt}">
                                </div>
                                <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${item.name}</h2>
                                    <p>${item.color}</p>
                                    <p>€${item.price}</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                    <p>Quantity : ${item.amount}</p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.amount}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Delete</p>
                                    </div>
                                </div>
                                </div>
                            </article>`
            // cart_items.innerHTML += cart_item
            cart_items.innerHTML += cart_item
            cart_total_price += parseInt(item.amount) * parseFloat(item.price)
            cart_total_quantity += parseInt(item.amount)

            // ?? .closest?
            buttons = document.getElementsByClassName("deleteItem")
            buttons[buttons.length - 1].addEventListener("click", e =>{
                let cart = JSON.parse(localStorage.getItem("cart"))
                if (cart == null) return
                localStorage.removeItem("cart")
                let tempcart = new Array()
                for (let cart_item of cart) {
                    if (cart_item.color != item.color || cart_item.id != item.id) {
                        tempcart.push(cart_item)
                    }
                }
                cart = JSON.stringify(tempcart)
                localStorage.setItem("cart", cart)
                document.getElementById("cart__items").innerHTML = ""
                showCart()
            })

            // ?? #2
            inputs = document.getElementsByClassName("itemQuantity")
            inputs[0].addEventListener("input", e => {
                let cart = JSON.parse(localStorage.getItem("cart"))
                if (cart == null) return
                localStorage.removeItem("cart")
                for(let cart_item of cart) {
                    if (cart_item.id == item.id && cart_item.color == item.color) {
                        cart_item.amount = inputs[0].value
                    }
                }
                cart = JSON.stringify(cart)
                localStorage.setItem("cart", cart)
                document.getElementById("cart__items").innerHTML = ""
                showCart() 
            })
        })
        document.getElementById("totalQuantity").innerHTML = cart_total_quantity
        document.getElementById("totalPrice").innerHTML = cart_total_price
    }
}


document.getElementById("order").addEventListener("click", (e) => {
        e.preventDefault();
        send();
    }
);
showCart()

function send() {
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const email = document.getElementById("email");
    // Check valid

    if (!firstName.checkValidity() || !lastName.checkValidity() ||
        !address.checkValidity() || !city.checkValidity() || !email.checkValidity())
    {
        return;
    }

    let orderDetails = {
        "firstName" : firstName.value,
        "lastName" : lastName.value,
        "address" : address.value,
        "city" : city.value,
        "email" : email.value
    }

    let orderItems = JSON.parse(localStorage.getItem("cart")).map(item => {
        return item.id;
    })

    fetch('http://localhost:3000/api/products/order', 
    {
        method : "POST",
        headers : {"Accept" : "application/json", "Content-Type" : "application/json"},
        body : JSON.stringify({
            "contact" : orderDetails,
            "products" : orderItems 
        })
    }).then(res=>res.json()).then(res=>{
        localStorage.clear();
        window.location.href = `./confirmation.html?orderID=${res.orderId}`;
    })

    
}