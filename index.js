const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
var bodyParser = require('body-parser');

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');
const testRoute = require('./routes/test/test_ddg');

dotenv.config();

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('DB connection succesful!'))
	.catch((err) => console.log(err));

app.use(cors());
//app.use("/api/checkout/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);

app.use('/api/test_ddg', testRoute);

app.use('/api/checkout', stripeRoute);

app.listen(process.env.PORT || 5000, () => {
	console.log('Background server is running!');
});
