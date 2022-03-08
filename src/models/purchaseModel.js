const mongoose = require('mongoose');
    let objectId = mongoose.Schema.Types.objectId

    const purchaseSchema = new mongoose.Schema( {

        userId:{
            type: objectId,
            ref: "newUser"
        } ,
        productId: {
            type: objectId,
            ref: "Product"
        },
        
        amount: 0,
        isFreeAppUser: true, 
        date: String
        })


        module.exports = mongoose.model('Purchase', purchaseSchema)