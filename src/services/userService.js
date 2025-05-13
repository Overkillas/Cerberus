import { User } from "../models/User.js"
import { Log } from "../models/Log.js"
import { jwtController } from "../middlewares/jwtConfig.js"
import apiErrors from "../classes/apiErrors.js"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"

class UserService {
    static async create(userData) {
        
        const { cpf, password } = userData;
        const lastThreeDigits = cpf.slice(-3);
        const userFound = await this.checkCPF(cpf, lastThreeDigits);
        
        if (userFound) throw new apiErrors("CPF inválido", 401);
        
        userData.cpf = await bcrypt.hash(cpf, 10);
        userData.password = await bcrypt.hash(password, 10);
        userData.lastThree = lastThreeDigits;

        const newUser = await User.create(userData);
        if (!newUser) throw new apiErrors("Falha ao cadastrar usuário.", 404);

        return newUser;
    }

    static async login(email, password) {
        const foundUser = await User.findOne({ email });
        if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
            throw new apiErrors("Email ou senha inválidos", 401);
        }
        return jwtController.sign(foundUser._id);
    }

    static async loginWithCPF(cpf) {
        const foundUser = await this.checkCPF(cpf, cpf.slice(-3));
        if (!foundUser) throw new apiErrors("CPF inválido", 401);
        return ["token: " + jwtController.sign(foundUser._id), "user: "+foundUser._id];
    }

    static async getAll() {
        const users = await User.find();
        if (users.length === 0) throw new apiErrors("Não existem usuários cadastrados.", 404);
        return users;
    }

    static async getById(id) {
        const user = await User.findById(id).lean();
        if (!user) throw new apiErrors("Usuário não encontrado.", 404);
        delete user.password;
        return user;
    }

    static async update(id, data) {
        if(data.password) data.password = await bcrypt.hash(data.password, 10);
        const user = await User.findByIdAndUpdate(id, data);
        if (!user) throw new apiErrors("Usuário não encontrado.", 404);
        return user;
    }

    static async delete(id) {
        await Log.deleteMany({ user: id });
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new apiErrors("Usuário não encontrado.", 404);
        await Log.deleteMany({ user: id });
        return user;
    }

    static async checkCPF(cpf, lastThreeDigits) {
        const users = await User.find({ lastThree: { "$regex": `${lastThreeDigits}$` } });
        for (const user of users) {
            if (await bcrypt.compare(cpf, user.cpf)) return user;
        }
        return null;
    }

    static async forgotPassword(email) {
        const generateToken = (length = 8) => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let token = '';
            for (let i = 0; i < length; i++) {
                token += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return token;
        };

        const foundUser = await User.findOne({ email });
        const expiryMinutes = 10

        if (!foundUser) throw new apiErrors("Email não encontrado", 404);
        const token = generateToken(8); 
        foundUser.resetToken = token; 
        const expirationDate = new Date();
        foundUser.tokenExpirationDate = expirationDate.setMinutes(expirationDate.getMinutes() + expiryMinutes);
        await foundUser.save();

        await this.sendEmail(email, token);  

        return "Verifique seu email para alterar a senha";
    }

    static async getResetPassword(token) {
        const user = await User.findOne({ resetToken: token });
        if (!user) throw new apiErrors("Invalid or expired token", 404);
    
        const userId = user._id;

        return `
            <form method="post" action="/reset-password">
                <input type="password" name="password" required>
                <input type="hidden" name="userId" value="${userId}"> <!-- Campo oculto com userId -->
                <input type="hidden" name="token" value="${token}"> <!-- Campo oculto com token -->
                <input type="submit" value="Reset Password">
            </form>`;
    }
    
    static async updatePassword(token, newPassword) {
    const foundUser = await User.findOne({ resetToken: token });
    if (!foundUser) throw new apiErrors("Token inválido ou expirado", 404);

    const currentTime = new Date();
    if (foundUser.tokenExpirationDate < currentTime) {
        foundUser.resetToken = undefined;
        foundUser.tokenExpirationDate = undefined;
        await foundUser.save();
        throw new apiErrors("Token expirado", 404);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    foundUser.password = hashedPassword;
    foundUser.resetToken = undefined;
    foundUser.tokenExpirationDate = undefined;
    await foundUser.save();

    return "Senha alterada com sucesso!";
    }    
    
    static async sendEmail(email, token) {

        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
              user: process.env.email,
              pass: process.env.emailPassword
            }
          });

          const mailOptions = {
            to: email,
            subject: 'Recuperar a senha',
            html: `
                <html>
                    <body>
                        <h2>Alterar a senha</h2>
                        <p>Clique no botão abaixo para alterar a senha</p>
                        <a href="http://localhost:5173/ResetPassword/${token}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-align: center; border-radius: 5px; text-decoration: none; font-weight: bold;">
                            Alterar a senha
                        </a>
                        <p>Ignore este email caso não tenha solicitado a alteração da senha</p>
                    </body>
                </html>
            `,
        };
        
        try {
            await transporter.sendMail(mailOptions);

            console.log("email enviado.")
        } catch (error) {
            throw new apiErrors("Ocorreu um erro ao enviar o email", 500)
        }
    }
}

export default UserService;

