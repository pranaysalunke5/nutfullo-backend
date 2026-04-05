import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// Add/update product in cart
export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Invalid product or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: userId,
        items: [{ product: productId, qty: quantity, price: product.price }],
        totalPrice: product.price * quantity,
      });
    } else {
      // Update existing cart
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].qty = quantity;
        cart.items[itemIndex].price = product.price * quantity;
      } else {
        cart.items.push({ product: productId, qty: quantity, price: product.price });
      }

      cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error('❌ CART ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get current user cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('❌ GET CART ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};