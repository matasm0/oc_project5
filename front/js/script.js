fetch ("//localhost:3000/api/products").then (
    res=>res.json()
).then (
    data=>{
        for (let i = 0; i < data.length; i++) {
            const {_id, description, imageUrl, name, altTxt} = data[i]
            const itemHTML = `<a href="./product.html?id=${_id}">
                                <article>
                                <img src="${imageUrl}" alt="${altTxt}">
                                <h3 class="productName">${name}</h3>
                                <p class="productDescription">${description}</p>
                                </article>
                            </a>`
            document.getElementById("items").innerHTML += itemHTML;
        }
    }
)

