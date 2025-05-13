import LogService from "../services/logService.js";

const logController = {
    create: async (req, res) => {
        try {
            await LogService.create(req.body);
            res.status(201).json({ msg: "Log criado com sucesso!" });
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    },

    list: async (req, res) => {
        try {
            const logs = await LogService.listByUser(req.params.userId);
            res.json(logs);
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    },

    listByCode: async (req, res) => {
        try {
            const log = await LogService.findByCode(req.params.code);
            res.json(log);
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    },

    listByRedeemed: async (req, res) => {
        try {
            const log = await LogService.listByRedeemed(req.params.userId);
            res.json(log);
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    },

    listByNotRedeemed: async (req, res) => {
        try {
            const log = await LogService.listByNotRedeemed(req.params.userId);
            res.json(log);
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    },

    getTrash: async (req, res) => {
        try {
            const log = await LogService.getTrash();
            res.json(log);
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const log = await LogService.update(req.params.id);
            res.json({ message: "Produto resgatado com sucesso!" });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },
};

export default logController;
