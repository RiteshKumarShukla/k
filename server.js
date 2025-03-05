process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cashfreeRoute = require('./routes/cashfree');
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const bigOrderRoutes = require('./routes/bigOrderRoutes');
const draftRoutes = require('./routes/draftRoutes');
const contactRoute = require('./routes/contactRoute');
const { Usermodel } = require("./models/user.model");
const { GoogleUsermodel } = require("./models/google.user.model ");
const { authenticate } = require("./middleware/authenticate");
const { Cartmodel } = require("./models/cart.model");
const Product = require("./models/Product");
const { Wishlistmodel } = require("./models/wishlist.model");
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;  // Note: Use v2
const paypal = require('paypal-rest-sdk');
const adminAuth = require('./routes/adminAuth');
const otpRoutes = require('./routes/otpRoutes');
const emailRoutes = require('./routes/emailRoutes.js')
const addressRoutes = require('./routes/addressRoute');
const Payment = require("./models/payment.model");
const shippingProfileRoutes = require('./routes/shippinProfileRoute');
const tagRoutes = require('./routes/tagRoutes');
const colorRoutes = require('./routes/colorRoutes');
const http = require('http');
const unitRoutes = require('./routes/unitRoutes');
const blogRoutes = require('./routes/blogRoutes.js')
const courierRoutes = require('./routes/courierRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const messagesRouter = require('./routes/messages');
const subcategory = require("./models/subcategoryModel");
const subscribeRoutes = require('./routes/subscribe');
const promoCodeRoutes = require('./routes/promoCodeRoutes');
const campaignRoutes = require('./routes/campaignRoutes.js')
const ootp = require('./routes/otpForEmailVerification.js')
const returnRequest = require('./routes/returnRequest.js');
const orderEmail = require('./routes/OrderEmail.js');
const OrderReturnRequestFromUser = require('./routes/OrderReturnRequestFromUser.js');
const returnMailByAdminWithStatus = require('./routes/returnMailByAdminWithStatus.js');
const messageConfirmationMailRoutes = require('./routes/messageConfirmationMail');
const resetEmail = require('./routes/resetPasswordEmail')
const b2b = require('./routes/b2bInquiry');
const couponRoutes = require('./routes/couponRoutes');
const acc = require('./routes/accountCreationMail.js');
const Order = require("./models/order");
const app = express();
const axios = require('axios');
let secret = process.env.STRIPE_SECRET;
const stripe = require("stripe")(secret);

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '50mb' }))

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	console.log("Connected to MongoDB")
});

app.use(
	cookieSession({
		name: "session",
		keys: ["knitsilk"],
		maxAge: 24 * 60 * 60 * 100,
	})
);
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
	// frontend url in origin and change before deployment
	origin: ['https://www.knitsilk.com/', 'https://knitsilk.com/', 'http://localhost:3000', 'https://www.knitsilk.com', 'https://knitsilk.com', 'http://localhost:3000/','https://knitsilk.netlify.app/','https://knitsilk.netlify.app'],
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
};


app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/auth", authRoute);
app.use('/api', cashfreeRoute);
app.use('/api/discounts', bigOrderRoutes);
app.use('/', productRoutes);
app.use('/drafts', draftRoutes);
app.use('/', contactRoute);
app.use('/api', otpRoutes);
app.use('/adminlogin', adminAuth);
app.use('/', addressRoutes);
app.use('/', shippingProfileRoutes);
app.use('/adminsetting', tagRoutes);
app.use('/adminsetting', colorRoutes);
app.use('/adminsetting', unitRoutes);
app.use('/adminsetting', courierRoutes);
app.use('/adminsetting', categoryRoutes);
app.use('/adminsetting', subcategoryRoutes);
app.use('/messages', messagesRouter);
app.use('/subscribe', subscribeRoutes)
app.use('/b2bInquiry', b2b);
app.use('/discount', couponRoutes);
app.use('/campaign', emailRoutes)
app.use('/blogs', blogRoutes);
app.use('/promo-codes', promoCodeRoutes);
app.use('/email', campaignRoutes)
app.use('/sendOrderMail', orderEmail);
app.use('/order-return-request-from-user', OrderReturnRequestFromUser);
app.use('/return-status-update',returnMailByAdminWithStatus);
app.use('/resetPasswordEmail', resetEmail);
app.use('/messageConfirmation', messageConfirmationMailRoutes)
app.use('/emailVerification', ootp);
app.use('/welcome', acc);
app.use('/order-return',returnRequest);

const razorpayRoute = require('./routes/razorpayRoute');
const OrderDraft = require("./models/orderDraft");
const adminStatus = require("./models/adminstatus.js");
const SubUser = require("./models/subuser.model.js");
const Message = require("./models/Message.js");

app.use("/api", razorpayRoute);

app.get('/status', (req, res) => {
	res.status(200).json({ status: 'Server is up and running' });
});

app.get("/test1", (req, res) => {
	res.send({ msg: "Sucess" })
})

app.get('/test', (req, res) => {
	res.send('Hello, World!');
});

//Basic sign up
app.post("/signup", async (req, res) => {
	let { name, email, password } = req.body;
	let user = await Usermodel.findOne({ email });
	if (user) {
		res.send({ msg: "pls login" });
	} else {
		try {
			let hash = bcrypt.hashSync(password, 4);
			await Usermodel.create({ name, email, password: hash });
			res.send({ msg: "user sign up success" });
		} catch (err) {
			res.send({ msg: "error to sign up" });
		}
	}
});

app.post('/reset', async (req, res) => {
	let { email, newPassword } = req.body;
	console.log(email, newPassword);
	try {
		let user = await Usermodel.findOne({ email });
		if (!user) {
			res.send({ msg: "user not found" });
		} else {
			let hash = bcrypt.hashSync(newPassword, 4);
			user.password = hash;
			await user.save();
			res.send({ msg: "password reset success" });
		}
	} catch (err) {
		res.send({ msg: "error to reset password" });
	}
});

//Basic Login
app.post("/login", async (req, res) => {
	let { email, password } = req.body;
	let user = await Usermodel.findOne({ email });
	if (user) {
		try {
			let userpass = user.password;
			let match = bcrypt.compareSync(password, userpass);
			if (match) {
				let token = jwt.sign({ userID: user._id }, process.env.SECRET_KEY_FOR_LOGIN_VERIFY);
				res.send({ msg: "login success", token, userName: user.name });
			} else {
				res.send({ msg: "invalid credentials" });
			}
		} catch (err) {
			res.send({ msg: "login failed" });
		}
	} else {
		res.send({ msg: "sign up first" });
	}
});

// Google login (give email and name only here as body)
app.post('/login/google', async (req, res) => {
	try {
		let { email, name, picture } = req.body;
		console.log(email, name);
		let user = await GoogleUsermodel.findOne({ email });
		if (user) {
			let token = jwt.sign({ userID: user._id }, process.env.SECRET_KEY_FOR_LOGIN_VERIFY);
			res.send({ msg: "Sign In with google success", token, userName: name });
		} else {
			// User not found, create a new user in the database
			let newUser = await GoogleUsermodel.create({ name, email, picture });
			let token = jwt.sign({ userID: newUser._id }, process.env.SECRET_KEY_FOR_LOGIN_VERIFY);
			res.send({ msg: "Sign Up with google success", token, userName: name });
		}
	} catch (err) {
		res.send({ msg: err.message });
	}

});

// Get all users
app.get("/getallusers", async (req, res) => {
	try {
		const basicUsers = await Usermodel.find({});
		const googleUsers = await GoogleUsermodel.find({});
		const allUsers = [...basicUsers, ...googleUsers];
		res.send(allUsers);
	} catch (error) {
		res.status(500).send({ message: "Error fetching users." });
	}
});

// Get user by ID
app.get("/getuser/:id", async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res.status(400).send({ message: "Invalid user ID." });
		}

		// Attempt to find the user by ID in both models
		const basicUser = await Usermodel.findById(userId);
		const googleUser = await GoogleUsermodel.findById(userId);

		// Check if the user is found in either model
		if (basicUser) {
			return res.send(basicUser);
		} else if (googleUser) {
			return res.send(googleUser);
		} else {
			return res.status(404).send({ message: "User not found." });
		}
	} catch (error) {
		res.status(500).send({ message: "Error fetching user by ID." });
	}
});

// get user details by token
app.get("/getuserdetails", authenticate, async (req, res) => {
	let id = req.userID;
	res.send({ userID: id })
})

// Delete User by ID
app.delete("/deleteuser/:userId", async (req, res) => {
	try {
		const { userId } = req.params;

		// Check if the user is a basic user
		let basicUser = await Usermodel.findOne({ _id: userId });
		if (basicUser) {
			await Usermodel.deleteOne({ _id: userId });
			return res.send({ message: "User deleted successfully." });
		}
		let googleUser = await GoogleUsermodel.findOne({ _id: userId });
		if (googleUser) {
			await GoogleUsermodel.deleteOne({ _id: userId });
			return res.send({ message: "User deleted successfully." });
		}
		return res.status(404).send({ message: "User not found." });
	} catch (error) {
		return res.status(500).send({ message: "Error deleting user." });
	}
});



// add to cart
app.post("/addtocart", authenticate, async (req, res) => {
	try {
		let { productId } = req.body;
		if (!productId) {
			return res.status(400).send({ msg: "Product ID is required." });
		}
		let user = await Usermodel.findOne({ _id: req.userID });
		if (user) {
			let existingCart = await Cartmodel.findOne({
				userID: req.userID,
				productId: productId
			});

			if (existingCart) {
				res.send({ msg: "Product already in cart" })
			} else {
				await Cartmodel.create(
					{
						productId, userID: req.userID
					}
				);

				return res.send({ message: "Item added to cart successfully." });
			}

		}
		else {
			let googleUser = await GoogleUsermodel.findOne({ _id: req.userID });
			if (googleUser) {
				let existingCart = await Cartmodel.findOne({
					userID: req.userID,
					productId: productId
				});
				if (existingCart) {
					res.send({ msg: "Product already in cart" })
				} else {
					await Cartmodel.create(
						{ productId, userID: req.userID }
					);

					return res.send({ message: "Item added to cart successfully." });
				}
			} else {
				return res.send({ msg: "Wrong token inserted!" });
			}
		}
	} catch (error) {
		return res.status(500).send({ msg: "Error adding item to cart." });
	}
});

//  get Cart Items
app.get("/getcartitems", authenticate, async (req, res) => {
	let data = await Cartmodel.find({ userID: req.userID })
	res.send({ msg: "All items ", data })
})

// delete Cart Items
app.delete("/removeitem/:id", authenticate, async (req, res) => {
	let { id } = req.params;
	try {
		let result = await Cartmodel.deleteMany({ productId: id });
		if (result.deletedCount === 0) {
			return res.status(404).send({ msg: "No items found with the specified productId." });
		}

		res.send({ msg: `All items with productId ${id} have been deleted` });
	} catch (error) {
		res.status(500).send({ msg: "Error deleting items from cart." });
	}
});

// delete all Cart Items
app.post("/removeitems", authenticate, async (req, res) => {

	try {
		let count = await Cartmodel.countDocuments({});
		console.log(count);
		let result = await Cartmodel.deleteMany({});
		if (result.deletedCount === 0 || count === 0) {
			return res.status(200).send({ msg: "No items found with the specified productId." });
		}

		res.send({ msg: `All items have been deleted` });
	} catch (error) {
		res.status(500).send({ msg: "Error deleting items from cart." });
	}
});

// Update quantity of a product in the user's cart
app.post("/updatequantity", authenticate, async (req, res) => {
	try {
		let { productId, quantity } = req.body;
		if (!productId || !quantity || !Number.isInteger(parseInt(quantity, 10)) || parseInt(quantity, 10) <= 0) {
			return res.status(400).send({ message: "Invalid product ID or quantity." });
		}
		let existingCart = await Cartmodel.findOne({
			userID: req.userID,
			productId: productId
		});
		if (!existingCart) {
			return res.send({ msg: "Product not in the cart." });
		}
		let d = await Product.findOne({ _id: productId });
		let q = d.qtyInStock;
		if (parseInt(quantity) <= q && parseInt(quantity) >= 1) {
			existingCart.quantity = parseInt(quantity);
			await existingCart.save();
			return res.send({ msg: "Quantity updated successfully." });
		} else {
			return res.send({ msg: "Exceeds product's stock." });
		}
	} catch (error) {
		return res.status(500).send({ msg: "Error updating quantity in cart." });
	}
});

//add to wishlist 
app.post("/addtowishlist", authenticate, async (req, res) => {
	try {
		let { productId } = req.body;
		if (!productId) {
			return res.status(400).send({ msg: "Product ID is required." });
		}
		let user = await Usermodel.findOne({ _id: req.userID });
		if (user) {
			let existingCart = await Wishlistmodel.findOne({
				userID: req.userID,
				productId: productId
			});
			if (existingCart) {
				res.send({ msg: "Product already in wishlist" })
			} else {
				await Wishlistmodel.create(
					{
						productId, userID: req.userID
					}
				);
				return res.send({ msg: "Item added to Wishlist successfully." });
			}

		} else {
			let googleUser = await GoogleUsermodel.findOne({ _id: req.userID });
			if (googleUser) {
				let existingCart = await Wishlistmodel.findOne({
					userID: req.userID,
					productId: productId
				});

				if (existingCart) {
					res.send({ msg: "Product already in Wishlist" })
				} else {
					await Wishlistmodel.create(
						{ productId, userID: req.userID }
					);
					return res.send({ msg: "Item added to Wishlist successfully." });
				}
			} else {
				return res.send({ msg: "Wrong token inserted!" });
			}
		}
	} catch (error) {
		return res.status(500).send({ msg: "Error adding item to Wishlist." });
	}
})

//   get wishlist Items
app.get("/getwishlistitems", authenticate, async (req, res) => {
	let data = await Wishlistmodel.find({ userID: req.userID })
	res.send({ msg: "All items ", data })
})

// Remove item from wishlist
app.delete("/removefromwishlist/:productId", authenticate, async (req, res) => {
	try {
		const { productId } = req.params;
		if (!productId) {
			return res.status(400).send({ msg: "Product ID is required." });
		}
		const removedItem = await Wishlistmodel.findOneAndDelete({
			userID: req.userID,
			productId: productId,
		});

		if (removedItem) {
			return res.send({ msg: "Item removed from Wishlist successfully." });
		} else {
			return res.status(404).send({ msg: "Item not found in Wishlist." });
		}
	} catch (error) {
		return res.status(500).send({ msg: "Error removing item from Wishlist." });
	}
});

// Updated backend route to use POST method
app.post('/getallsubcategory', async (req, res) => {
	let { category } = req.body;
	let data = await subcategory.find({ category })
	res.send({ data: data });
});

// Configure Cloudinary
cloudinary.config({
	cloud_name: 'dhtux7rmu',
	api_key: '989215955166629',
	api_secret: 'wYIfBdiDU0m-SnJ4oM1W6s6j-jo',
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'uploads',
		allowed_formats: ['jpg', 'jpeg', 'png',],
		transformation: [{ width: 500, height: 500, crop: 'limit' }],
	},
});
// Configure Multer with Cloudinary storage
const videoCloudinaryStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'uploads/videos',
		resource_type: 'video',
		allowed_formats: ['mp4', 'mov', 'avi'],
	},
});

const upload = multer({ storage: storage });
const upload2 = multer({ storage: videoCloudinaryStorage });

// Define a model for your photos
const Photo = mongoose.model('Photo', {
	url: String,
});
const Video = mongoose.model('Video', {
	url: String,
});

// API endpoint for uploading photos
app.post('/api/upload', upload.array('photos', 9), async (req, res) => {
	try {
		const urls = req.files.map((file) => file.path);
		const photosData = urls.map((url) => ({ url }));
		res.json({ photos: photosData });
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// API endpoint for uploading videos
app.post('/api/upload/videos', upload2.array('videos', 1), async (req, res) => {
	try {
		const urls = req.files.map((file) => file.path);
		const videosData = urls.map((url) => ({ url }));
		res.json({ videos: videosData });
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Configure PayPal
const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;
paypal.configure({
	mode: PAYPAL_MODE,
	client_id: PAYPAL_CLIENT_KEY,
	client_secret: PAYPAL_SECRET_KEY,
});

app.post('/pay', async (req, res) => {
	try {
		const { items } = req.body;
		const prices = items.map(item => item.priceUSD * item.quantity);
		const totalPrice = prices.reduce((sum, price) => sum + price, 0);
		const create_payment_json = {
			intent: 'sale',
			payer: {
				payment_method: 'paypal',
			},
			redirect_urls: {
				return_url: 'https://www.knitsilk.com/success',
				cancel_url: 'https://www.knitsilk.com/cancel',
			},
			transactions: [{
				item_list: {
					items: [{
						name: items[0].title,
						sku: items[0]._id,
						price: items[0].priceUSD,
						currency: 'USD',
						quantity: items[0].quantity,
					}]
				},
				amount: {
					currency: 'USD',
					total: Number((totalPrice).toFixed(2).toString()),
				},
				description: 'Purchase description',
			}],
		};
		paypal.payment.create(create_payment_json, (error, payment) => {
			if (error) {
				throw error;
			} else {
				for (let i = 0; i < payment.links.length; i++) {
					if (payment.links[i].rel === 'approval_url') {
						res.send({ paymentUrl: payment.links[i].href, paymentid: payment.id });
					}
				}
			}
		});
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.post(`/pay/success`, async (req, res) => {
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;
	const totalPrice = req.body.totalPrice;
	if (paymentId && payerId) {
		const execute_payment_json = {
			"payer_id": payerId,
			"transactions": [{
				"amount": {
					"currency": "USD",
					"total": totalPrice,
				}
			}]
		};
		paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
			if (error) {
				res.send(error.message)
			} else {
				console.log("payment")
				res.send({ paymentDetails: payment });
			}
		});
	} else {
		res.send({ msg: "payerID or paymentID not found" })
	}
});

app.post("/payment/store", authenticate, async (req, res) => {
	try {
		const { datastring } = req.body;
		if (!datastring) {
			return res.status(400).send({ msg: "Datastring is required." });
		}
		const userId = req.userID;
		await Payment.create({
			paymentInfo: datastring,
			userID: userId,
		});

		return res.send({ message: "Payment information stored successfully." });
	} catch (error) {
		return res.status(500).send({ msg: "Error adding item to cart." });
	}
});

app.post('/products/filterBySubcategories', async (req, res) => {
	const { subcategories, category } = req.body;
	console.log(subcategories);
	try {
		// Implement the logic to filter products based on subcategories and category
		// Use Mongoose queries to fetch the filtered products
		const filteredProducts = await Product.find({
			subCategory: { $in: subcategories },
			category,
		});

		res.json(filteredProducts);
	} catch (error) {
		console.error('Error fetching products:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});


app.post('/products/colors', async (req, res) => {
	try {
		const { color, category } = req.query;
		console.log(color, category);

		if (color === 'All' && category == "All") {
			// If color is not specified or 'All', return all products in the category
			const products = await Product.find();

			return res.json(products);
		} else if (color === 'All' && category != "All") {
			const products = await Product.find({ category });

			return res.json(products);
		} else if (category == "All" && color != "All") {
			console.log("object")
			const products = await Product.find({ color });
			return res.json(products);
		}
		else {

			// If a specific color is provided, filter products by that color and category
			const products = await Product.find({ category, color });
			res.json(products);
		}
	} catch (error) {
		console.error('Error fetching products by color:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.get('/filterbyyarn', async (req, res) => {
	try {
		const { category, yarnWeight } = req.query;

		console.log('Received request with parameters:', category, yarnWeight);

		if (!yarnWeight || yarnWeight === 'All' || category === 'All') {
			const products = await Product.find({ category });
			return res.json(products);
		}

		const products = await Product.find({
			category,
			yarnWeight,
		});

		res.json(products);
	} catch (error) {
		console.error('Error fetching products by yarn weight:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.post("/order/draft", authenticate, async (req, res) => {
	try {
		const { userID } = req;
		const data = req.body;

		// Basic validation
		if (!data || !userID) {
			return res.status(400).json({ error: 'Invalid request data' });
		}

		// Check if there's an existing draft for the user
		const existingDraft = await OrderDraft.findOne({ userID: userID });

		if (existingDraft) {
			// If a draft exists, update it with the new data
			existingDraft.set(data);
			const updatedDraft = await existingDraft.save();
			console.log('Updated Draft:', updatedDraft);

			// Respond with a success message or the updated document
			return res.status(200).json({ msg: "Order draft updated successfully", orderDraft: updatedDraft, _id: updatedDraft._id });
		} else {
			// If no draft exists, create a new one
			const newOrderDraft = new OrderDraft({
				...data,
				userID: userID
			});

			const savedDraft = await newOrderDraft.save();
			console.log('New Draft:', savedDraft);

			// Respond with a success message or the saved document
			return res.status(201).json({ msg: "Order draft saved successfully", orderDraft: savedDraft, _id: savedDraft._id });
		}
	} catch (error) {
		console.error('Error saving/updating order draft:', error);

		if (error.name === 'ValidationError') {
			return res.status(400).json({ error: 'Validation Error', details: error.errors });
		}

		res.status(500).json({ error: 'Internal Server Error', details: error.message });
	}
});


app.get("/order/draft", authenticate, async (req, res) => {
	try {
		const data = await OrderDraft.find({ userID: req.userID });

		// Send the data as a response
		res.status(200).json(data);
	} catch (error) {
		console.error('Error fetching order drafts:', error);
		// Handle the error, send an error response, or do something else as needed
		res.status(500).json({ error: 'Internal Server Error' });
	}
});



app.post("/order", authenticate, async (req, res) => {
	try {
		const { userID } = req;
		const data = req.body;
		console.log(data);
		const newOrder = await Order.create({
			customerInfo: data.customerInfo,
			cartProducts: data.cartProducts,
			shippingMethod: data.shippingMethod,
			shippingCharges: data.shippingCharges,
			discount: data.discount,
			finalAmount: data.finalAmount,
			paymentMethod: data.paymentMethod,
			userCurrency: data.userCurrency,
			userID: userID,
			isPaid: false,
			status: data.status,
		});

		res.status(201).json({ msg: "Order saved successfully.", orderID: newOrder._id });
	} catch (error) {
		console.error('Error saving order or sending confirmation emails:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});


app.put('/order/:id/pay', async (req, res) => {
	const { id } = req.params;

	try {
		const order = await Order.findById(id);

		if (!order) {
			return res.status(404).send({ message: 'Order not found' });
		}

		order.isPaid = true;
		await order.save();

		res.send({ message: 'Order payment status updated to true', order });
	} catch (error) {
		res.status(500).send({ message: 'Error updating order payment status', error });
	}
});

// To get all orders of a certain user ----------------------------------
app.get("/order", authenticate, async (req, res) => {
	try {
		const { userID } = req;

		// Retrieve all orders for the user
		const allOrders = await Order.find({ userID: userID });

		// Respond with the fetched orders
		res.status(200).json(allOrders);
	} catch (error) {
		console.error('Error fetching orders:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// To get all orders---------------------
app.get("/allOrders", async (req, res) => {
	try {
		// Retrieve all orders for all users
		const allOrders = await Order.find();

		// Respond with the fetched orders
		res.status(200).json(allOrders);
	} catch (error) {
		console.error('Error fetching orders:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// New route to get an order by its ID
app.get("/allOrders/:orderId", async (req, res) => {
	try {
		const orderId = req.params.orderId;

		// Retrieve the order by its ID
		const foundOrder = await Order.findById(orderId);

		// Check if the order was found
		if (!foundOrder) {
			return res.status(404).json({ error: 'Order not found' });
		}

		// Respond with the fetched order
		res.status(200).json(foundOrder);
	} catch (error) {
		console.error('Error fetching order by ID:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Route to find orders by email
app.get('/findByEmail', async (req, res) => {
	const email = req.query.email;

	if (!email) {
		return res.status(400).json({ error: 'Email query parameter is required' });
	}

	try {
		// Find orders where either shipping or billing email matches the provided email
		const orders = await Order.find({
			$or: [
				{ 'customerInfo.shipping.email': email },
				{ 'customerInfo.billing.email': email }
			]
		});

		if (orders.length === 0) {
			return res.status(404).json({ message: 'No orders found for the provided email' });
		}

		res.json(orders);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

app.put("/updateTracking/:orderId", async (req, res) => {
	const { orderId } = req.params;
	const { trackingId, courier, trackingUrl } = req.body;

	try {
		// Find the order by orderId
		const foundOrder = await Order.findOne({ _id: orderId });

		if (!foundOrder) {
			return res.status(404).json({ error: "Order not found" });
		}

		// Update the tracking details
		foundOrder.trackingId = trackingId;
		foundOrder.deliveryPlatform = courier;
		foundOrder.trackingUrl = trackingUrl;

		// Save the updated order
		await foundOrder.save();

		// Respond with the updated order
		res.status(200).json(foundOrder);
		console.log(foundOrder)
	} catch (error) {
		console.error("Error updating tracking details:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.put("/updateStatus/:orderId", async (req, res) => {
	const { orderId } = req.params;
	const { status } = req.body;

	try {
		// Find the order by orderId
		const foundOrder = await Order.findOne({ _id: orderId });

		if (!foundOrder) {
			return res.status(404).json({ error: "Order not found" });
		}

		// Update the status
		foundOrder.status = status;
		if (status === "completed") {
            foundOrder.deliveredAt = new Date(); // Update with current date and time
        } else {
            foundOrder.deliveredAt = null; // Clear the statusUpdatedAt if not completed
        }

		// Save the updated order
		await foundOrder.save();

		// Respond with the updated order
		res.status(200).json(foundOrder);
		console.log(foundOrder);
	} catch (error) {
		console.error("Error updating status:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});


// To get a single order by orderid in all orders---------------------
app.post("/allOrders", async (req, res) => {
	try {
		let { orderID } = req.body;
		console.log(orderID);
		// Retrieve all orders for all users
		const allOrders = await Order.findOne({ _id: orderID });
		// // Respond with the fetched orders
		res.status(200).json(allOrders);
	} catch (error) {
		console.error('Error fetching orders:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});


// To get products with discounts > 0 ------------------
app.get("/productsWithDiscount", async (req, res) => {
	try {
		const productsWithDiscount = await Product.find({ discount: { $gt: 0 } });
		res.status(200).json(productsWithDiscount);
	} catch (error) {
		console.error('Error fetching products with discount:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// offers - categories filter
app.post('/products/offers/filterBycategories', async (req, res) => {
	const { category } = req.body;
	try {
		const filteredProducts = await Product.find({
			category,
			discount: { $gt: 0 },
		});
		res.json(filteredProducts);
	} catch (error) {
		console.error('Error fetching products by category:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// offers - subcategories filter
app.post('/products/offers/filterBySubcategories', async (req, res) => {
	const { subcategories, category } = req.body;
	try {
		const filteredProducts = await Product.find({
			subCategory: { $in: subcategories },
			category,
			discount: { $gt: 0 },
		});
		res.json(filteredProducts);
	} catch (error) {
		console.error('Error fetching products by subcategory:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.get('/getadminstatus', async (req, res) => {
	let status = await adminStatus.findOne({});
	res.send({ msg: `Admin is ${status}`, data: status })
})

app.post('/putadminstatus', async (req, res) => {
	try {
		const filter = {};

		// Check if admin status document exists
		let existingStatus = await adminStatus.findOne(filter);

		if (!existingStatus) {
			// Create a new admin status document with isOnline field
			existingStatus = await adminStatus.create({ isOnline: req.body.isOnline });
			res.send({ msg: 'Admin status created successfully for the first time', data: existingStatus });
		} else {
			// Update the existing admin status document
			const update = { isOnline: req.body.isOnline };
			const updatedStatus = await adminStatus.findOneAndUpdate(filter, update);

			res.send({ msg: 'Admin status updated successfully', data: updatedStatus });
		}
	} catch (error) {
		console.error('Error updating admin status:', error);
		res.status(500).send({ msg: 'Error updating admin status' });
	}
});


// Get user by ID
app.get("/getuser/:id", async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res.status(400).send({ message: "Invalid user ID." });
		}

		// Attempt to find the user by ID in both models
		const basicUser = await Usermodel.findById(userId);
		const googleUser = await GoogleUsermodel.findById(userId);

		// Check if the user is found in either model
		if (basicUser) {
			return res.send(basicUser);
		} else if (googleUser) {
			return res.send(googleUser);
		} else {
			return res.status(404).send({ message: "User not found." });
		}
	} catch (error) {
		res.status(500).send({ message: "Error fetching user by ID." });
	}
});


app.post('/api/createsubusers', async (req, res) => {
	try {
		const { email, password, userRole } = req.body;
		const newUser = new SubUser({ email, password, userRole });
		await newUser.save();
		res.status(201).json(newUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Read all users
app.get('/api/getsubusers', async (req, res) => {
	try {
		const users = await SubUser.find();
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Update a user
app.put('/api/updatesubusers/:id', async (req, res) => {
	try {
		const { email, password, userRole } = req.body;
		const updatedUser = await SubUser.findByIdAndUpdate(req.params.id, { email, password, userRole }, { new: true });
		res.json(updatedUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Delete a user
app.delete('/api/deletesubusers/:id', async (req, res) => {
	try {
		await SubUser.findByIdAndDelete(req.params.id);
		res.json({ message: 'User deleted' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});


app.post('/delete/messages', async (req, res) => {
	const { selectedUserIDs } = req.body;
	try {
		await Message.deleteMany({
			$or: [
				{ sender: { $in: selectedUserIDs } },
				{ reciever: { $in: selectedUserIDs } }
			]
		});
		const remainingMessages = await Message.find();


		res.status(200).send({ message: `Deleted messages successfully` });
	} catch (error) {
		console.error('Error deleting messages:', error);
		res.status(500).send({ error: 'An error occurred while deleting messages' });
	}
});

// Stripe Pyament 
// Payment Route
app.post("/create-checkout-session", async (req, res) => {
	const { finalAmount } = req.body;
	console.log(finalAmount);
	let products = [
		{
			title: "KNITSILK STORE",
			price: finalAmount,
			quantity: 1
		}
	]

	const lineItems = products.map((product) => ({
		price_data: {
			currency: "usd",
			product_data: {
				name: product.title,

			},
			unit_amount: Math.round(product.price * 100),
		},
		quantity: product.quantity
	}));




	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: lineItems,
		mode: "payment", // Corrected mode value to lowercase "payment"
		success_url: "https://www.knitsilk.com/successstripe",
		cancel_url: "https://www.knitsilk.com/failurestripe"
	});

	res.json({ id: session.id });
});


app.get('/', (req, res) => {
	res.send('API is Working !!!');
});
const port = 5501;
app.listen(port, () => console.log(`Listening on port ${port}...`));