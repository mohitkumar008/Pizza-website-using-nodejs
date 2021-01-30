const order = require("../../../models/order")
const Order = require('../../../models/order')

function orderController() {
    return {
        index(req, res) {
            order.find({staus: {$ne: 'completed'}}, null, {sort: {'createdAt': -1}}).populate('customerId', '-password').exec((err, orders) => {
                if (req.xhr) {
                    return res.json(orders)
                } else {
                    res.render('admin/order')
                }
            })
        }
    }
}

module.exports = orderController