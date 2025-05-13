import { Product } from "../models/Product.js";
import { Log } from "../models/Log.js"
import apiErrors from "../classes/apiErrors.js";

class ProductService {

    static async create(data, file) {
        if (!file) {
            throw new apiErrors("Imagem é obrigatória", 400);
        }
        const newProduct = new Product({
            ...data,
            img: {
                data: file.buffer,
                contentType: file.mimetype,
            }
        });
        await newProduct.save();
    }

    static async list() {
        const productList = await Product.find({ isActive: true });
        if (productList.length === 0) {
            throw new apiErrors("Não existem produtos no banco de dados", 400);
        }
        return productList.map(product => ({
            ...product._doc,
            img: product.img?.data
                ? `data:${product.img.contentType};base64,${product.img.data.toString("base64")}`
                : null
        }));
    }

    static async listData() {
        const productList = await Product.find({ isActive: true }, "-img");
        if (productList.length === 0) {
            throw new apiErrors("Não existem produtos no banco de dados", 400);
        }
        return productList;
    }

    static async listInactive() {
        const productList = await Product.find({ isActive: false }, "-img");
        if (productList.length === 0) {
            throw new apiErrors("Não existem produtos em falta no banco de dados", 400);
        }
        return productList;
    }

    static async getById(id) {
        const product = await Product.findById(id);
        if (!product) {
            throw new apiErrors("ID não encontrado", 404);
        }
        return product;
    }

    static async update(id, updateData) {
        const product = await Product.findById(id);
        if(product.isActive == false && updateData.stock > 0) updateData.isActive = true
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
            throw new apiErrors("ID não encontrado", 404);
        }
        return updatedProduct;
    }

    static async delete(id) {
        await Log.deleteMany({ product: id });
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            throw new apiErrors("ID não encontrado", 404);
        }
    }
}

export default ProductService;
