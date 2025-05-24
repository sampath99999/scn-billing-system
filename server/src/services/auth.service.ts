import { Company } from '#models/company.model.js';
import { User, UserInterface } from '#models/user.model.js';
import { AppError } from '#utils/appError.js';
import { Encrypter } from '#utils/bcrypt.js';
import { JWT } from '#utils/jwt.js';
import mongoose from 'mongoose';

const AuthService = {
    async login(username: string, password: string) {
        try {
            const user = await User.findOne({
                username,
            }).select('+password');
            if (!user) {
                throw new AppError(
                    'Invalid Credentials, Please check Username and Password',
                    400,
                );
            }
            if (!(await Encrypter.comparePassword(password, user.password))) {
                throw new AppError(
                    'Invalid Credentials, Please check Username and Password',
                    400,
                );
            }
            await this.checkIfCompanyIsActive(user.company_id);
            this.checkIfUserIsActive(user);
            const token = JWT.generateToken({
                _id: user._id as mongoose.Types.ObjectId,
                user_type: user.user_type,
                company_id: user.company_id,
            });
            return { token };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Error during login process', 500);
        }
    },

    checkIfUserIsActive(user: UserInterface) {
        if (!user.is_active) {
            throw new AppError(
                'User is Inactive, Please contact your Admin',
                400,
            );
        }
        return true;
    },

    async checkIfCompanyIsActive(network_id: mongoose.Types.ObjectId) {
        try {
            const company = await Company.findById(network_id);
            if (!company) {
                throw new AppError('Company details not found!', 404);
            }
            if (!company.is_active) {
                throw new AppError(
                    'Company is in Inactive state, please contact Our Support Number',
                    400,
                );
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Error checking company status', 500);
        }
    },
};

export default AuthService;
