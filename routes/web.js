const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const AdminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')

//Middlewares
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')


function initRoutes(app) {
    app.get('/', homeController().index);

    app.get('/login',guest, authController().login);
    app.post('/login', authController().postLogin);
    
    app.get('/register',guest, authController().register);
    app.post('/register', authController().postRegister);
    
    app.post('/logout', authController().logout);

    app.get('/cart', cartController().cart);
    app.post('/update-cart', cartController().update);
    

    //Customers route
    app.post('/orders',auth, orderController().store);
    app.get('/customer/orders',auth, orderController().index)
    app.get('/customer/orders/:id',auth, orderController().show)
    
    //Admin Routes
    app.get('/admin/orders',admin, AdminOrderController().index)
    
    app.post('/admin/order/status', admin, statusController().update)
}

module.exports = initRoutes;