const OrderModel = require("../models/orderSchema.js");
const ProductModel = require("../models/productSchema.js");
const UserModel = require("../models/userSchema.js");

const createOrder = async function (req, res) {
  let data = req.body;
  let uId = data.userId;
  let pId = data.productId;
  let freeAppUser = req.headers.isfreeappuser;
  console.log(freeAppUser);

  let user = await UserModel.findById(uId);
  let product = await ProductModel.findById(pId);

  if (data.hasOwnProperty("userId") == false) {
    res.send({ error: "userID is required" });
  } else if (!user) {
    res.send({ error: "wrong userID entered" });
  }

  if (data.hasOwnProperty("productId") == false) {
    res.send({ error: "productId is required" });
  } else if (!product) {
    res.send({ error: "wrong productID entered" });
  }

  let productDetail = await ProductModel.findById(pId);
  console.log(productDetail);

  let priceValue = productDetail.price;
  console.log(priceValue);

  let userDetail = await UserModel.findById(uId);
  console.log(userDetail);

  let userBalance = userDetail.balance;
  console.log(userBalance);

  if (freeAppUser === "false") {
    if (userBalance > priceValue) {
      let updatedBalance = await UserModel.findByIdAndUpdate(
        { _id: uId },
        { $inc: { balance: -priceValue } },
        { new: true }
      );
      
      data.amount = priceValue;
      data.isFreeAppUser = false
      let orderDetail = await OrderModel.create(data);      
      res.send({ order: orderDetail });
    } else {
      res.send({ error: "insufficient balance" });
    }
  } else {
    data.amount = 0;
    data.isFreeAppUser = true
    let orderDetails = await OrderModel.create(data);
    res.send({ order: orderDetails });
  }
};

module.exports.createOrder = createOrder;