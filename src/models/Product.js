import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    stock: {type: Number, default: 0, required: false},
    img:
    {
        data: Buffer,
        contentType: String,
    },
    isActive: {type: Boolean, default: true, required: false}
}, {versionKey: false});

const Product = mongoose.model("product", productSchema);

export {Product, productSchema};