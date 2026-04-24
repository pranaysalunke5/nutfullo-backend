import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';



export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      if (quantity < 1) {
        return res.status(200).json({ success: true, cart: null });
      }

      const product = await Product.findById(productId);

      cart = new Cart({
        user: userId,
        items: [{ product: productId, qty: quantity, price: product.price * quantity }],
        totalPrice: product.price * quantity,
      });

    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      // 🔥 REMOVE ITEM
      if (quantity === 0 && itemIndex > -1) {
        cart.items.splice(itemIndex, 1);
      }

      // 🔥 UPDATE ITEM
      else if (itemIndex > -1) {
        const product = await Product.findById(productId);
        cart.items[itemIndex].qty = quantity;
        cart.items[itemIndex].price = product.price * quantity;
      }

      // 🔥 ADD NEW ITEM
      else if (quantity > 0) {
        const product = await Product.findById(productId);
        cart.items.push({
          product: productId,
          qty: quantity,
          price: product.price * quantity,
        });
      }

      // 🔥 IF CART EMPTY → DELETE CART
      if (cart.items.length === 0) {
        await Cart.deleteOne({ user: userId });
        return res.json({ success: true, cart: null });
      }

      cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');

    res.json({ success: true, cart: populatedCart });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart) {
      return res.json({ success: true, items: [] });
    }

    res.json({
      success: true,
      items: cart.items,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};