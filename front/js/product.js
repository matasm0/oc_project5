const id = new URL(window.location).searchParams.get('id')

async function populatePage(){
    const product = await fetch("//localhost:3000/api/products/" + id).then(res => res.json())

    const productImg = document.createElement("img");
    productImg.src = product.imageUrl
    productImg.alt = product.altTxt
    document.querySelector(".item__img").append(productImg)

    document.getElementById("title").innerHTML = product.name
    document.getElementById("price").innerHTML = product.price
    document.getElementById("description").innerHTML = product.description
    
    let colorsList = document.getElementById("colors")
    product.colors.forEach(element => {
        let newColor = document.createElement("option")
        newColor.value = element
        newColor.innerHTML = element
        colorsList.append(newColor)
    })
    return product
}



populatePage().then(product => {

    document.getElementById("addToCart").addEventListener("click", (e)=>{
        // Save item details to local storage
        // Check duplicate items (colors)

        const color = document.getElementById("colors").value
        const amount = document.getElementById("quantity").value

        if (amount == 0 || color == "") return;

        // Check for correct color?
        let cart = JSON.parse(localStorage.getItem("cart"))
        if (cart == null) {
            cart = [{
                    "id" : product._id,
                    "name" : product.name,
                    "color" : color,
                    "amount" : amount,
                    "price" : product.price,
                    "imageUrl" : product.imageUrl,
                    "altTxt" : product.altTxt,
                    }]
            cart = JSON.stringify(cart)
            localStorage.setItem("cart", cart)
        }
        else {
            let found = false
            for (let item of cart){
                if (item.name == product.name && item.color == color) {
                    item.amount = parseInt(item.amount) + parseInt(amount)
                    found = true;
                    break
                }
            }
            if (!found) {
                cart.push({
                    "id" : product._id,
                    "name" : product.name,
                    "color" : color,
                    "amount" : amount,
                    "price" : product.price,
                    "imageUrl" : product.imageUrl,
                    "altTxt" : product.altTxt,
                })
            }
            localStorage.setItem("cart", JSON.stringify(cart))
        }
    })    
})