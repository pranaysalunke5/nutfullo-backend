import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
        lowStockThreshold: {
            type: Number,
            default: 10, // Notify when stock is below this
        },
        lastRestocked: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;