import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
    const { 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        totalPrice 
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        // 1. Create the order in the database
        const order = new Order({
            orderItems,
            user: req.user._id, // Set by your 'protect' middleware
            shippingAddress,
            paymentMethod,
            totalPrice,
        });

        const createdOrder = await order.save();

        // 2. Logic to reduce stock for each product ordered
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.qty } // Subtract the quantity ordered from stock
            });
        }

        res.status(201).json({
            success: true,
            data: createdOrder
        });
    }
};