const orderID = new URL(window.location).searchParams.get("orderID")

document.getElementById("orderId").innerHTML = orderID;