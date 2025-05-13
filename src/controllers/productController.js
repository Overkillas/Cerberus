import ProductService from "../services/productService.js";

const productController = {
    create: async (req, res) => {
        try {
            await ProductService.create(req.body, req.file);
            res.status(201).json({ msg: "Produto adicionado com sucesso!" });
        } catch (error) {
            if (error.message.includes("name_1 dup key:")) 
                return res.status(400).json({ message: `Falha ao cadastrar produto: produto com esse nome já cadastrado.`});
            res.status(400).json({ message: error.message });
        }
    },

    list: async (req, res) => {
        try {
            const products = await ProductService.list();
            res.json(products);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    listData: async (req, res) => {
        try {
            const products = await ProductService.listData();
            res.json(products);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    listInactive: async (req, res) => {
        try {
            const products = await ProductService.listInactive();
            res.json(products);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    listOne: async (req, res) => {
        try {
            const product = await ProductService.getById(req.params.id);
            res.json(product);
        } catch (error) {
            if (error.message.includes("name_1 dup key:")) 
                return res.status(400).json({ message: `Falha ao atualizar produto: produto com esse nome já cadastrado.`});
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },


    update: async (req, res) => {
        try {
            await ProductService.update(req.params.id, req.body);
            res.status(200).json({ msg: "Produto atualizado" });
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await ProductService.delete(req.params.id);
            res.status(200).json({ msg: "Produto removido com sucesso" });
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    }
};

export default productController;