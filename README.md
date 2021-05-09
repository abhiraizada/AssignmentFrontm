# AssignmentFrontm

Create a collection with name foods and orders in a database
Sample Mongo json data is present in FoodItems.js


Created 2 models - Food ( for adding food items to inventory) and Order ( for adding orders)

pageSize( 3 by default)
GET "/" attributes -   pageNum( default=1 ), sortBy(default='aschending), sortOn(default= 'name')

POST "/addfood"  Required - name, price, cuisine, quantity
{
    "name": "Momos",
    "price":"40",
    "cuisine":"Nepal",
    "quantity":"50"
}
POST "/orderfood"  Required - name, amount, useremail, quantity
{
    "name":"Pepsi",
    "quantity":1,
    "amount":20,
    "useremail":"abhi.raizada21@gmail.com"
}

npm install
