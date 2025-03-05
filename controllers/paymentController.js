const Razorpay = require('razorpay');
const crypto = require('crypto');

const getOrderId = async(req,res)=>{
    try {
        var instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
        console.log(req.body.amount)
        var options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: "TXN" + Date.now(),
        };

        instance.orders.create(options, function(err, order) {
            if(order){
                return res.send(order.id)
            } else {
                console.log(err);
            }
        });
    } catch (error) {
        console.log(error.message);
    }

}

const paymentCallBack = async(req,res)=>{
    const {razorpay_signature, razorpay_payment_id, razorpay_order_id} = req.body
    console.log(req.body)
    try {
        const string = `${razorpay_order_id}|${razorpay_payment_id}`;

        const generated_signature = crypto
        .createHmac('sha256', process.env.KEY_SECRET)
        .update(string)
        .digest('hex');

        if (generated_signature == razorpay_signature) {
            console.log('payment successfull')
            return res.redirect('https://www.knitsilk.com/successrazorpay')
        }else{
            return res.redirect('https://www.knitsilk.com/failurerazorpay')
            console.log("object")
        }

    } catch (error) {
        console.log(error.message);
    }

}

const paymentCancel = async (req, res) => {
    try {
        console.log('Redirecting to failure page');
        return res.redirect('http://www.knitsilk.com/failurerazorpay');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getOrderId,
    paymentCallBack,
    paymentCancel
}