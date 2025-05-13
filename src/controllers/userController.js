import UserService from "../services/userService.js";

const userController = {
    create: async (req, res) => {
        try {
            const user = await UserService.create(req.body);
            res.status(201).json({ message: "Usuário criado com sucesso!"});
        } catch (error) {
            if (error.message.includes("email_1 dup key:")) return res.status(400).json({ message: `Falha ao cadastrar usuário: email já cadastrado.`});
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const token = await UserService.login(req.body.email, req.body.password);
            res.json({ auth: true, token });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    loginCPF: async (req, res) => {
        try {
            const response = await UserService.loginWithCPF(req.params.cpf);
            res.json({ auth: true, response });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const message = await UserService.forgotPassword(req.body.email);
            res.json({ message });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const user = await UserService.updatePassword(req.params.token, req.body.password);
            res.json({ message: "Usuário atualizado com sucesso!" });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },
    
    resetPassword: async (req, res) => {
        try {
            const token = req.params.token;
            const formHtml = await UserService.getResetPassword(token);
            
            res.send(formHtml);            
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },
    

    list: async (req, res) => {
        try {
            const users = await UserService.getAll();
            res.json(users);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    listOne: async (req, res) => {
        try {
            const user = await UserService.getById(req.params.id);
            res.json(user);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const user = await UserService.update(req.params.id, req.body);
            res.json({ message: "Usuário atualizado com sucesso!" });
        } catch (error) {
            if (error.message.includes("email_1 dup key:")) 
                return res.status(400).json({ message: `Falha ao atualizar usuário: email já cadastrado.`});
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await UserService.delete(req.params.id);
            res.json({ message: "Usuário e seus logs deletados com sucesso!" });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },
};

export default userController;
