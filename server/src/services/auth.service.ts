import { Company } from '#models/company.model.js';
import { User, UserInterface } from '#models/user.model.js';
import { AppError } from '#utils/appError.js';
import { Encrypter } from '#utils/bcrypt.js';
import { JWT } from '#utils/jwt.js';
import { ObjectId } from 'mongoose';

export const AuthService = {
    async login(username: string, password: string) {
        const user = await User.findOne({
            username,
        }).select('+password');
        if (!user) {
            throw new AppError(
                'Invalid Credentials, Please check Username and Password',
                404,
            );
        }
        if (!(await Encrypter.comparePassword(password, user.password))) {
            throw new AppError(
                'Invalid Credentials, Please check Username and Password',
                404,
            );
        }
        await this.checkIfCompanyIsActive(user.company_id);
        this.checkIfUserIsActive(user);
        const token = JWT.generateToken({
            _id: user._id as ObjectId,
            user_type: user.user_type,
        });
        return { token };
    },

    removePasswordFromObject(user: UserInterface) {
        const userObj = user.toObject() as Omit<UserInterface, 'password'> & {
            password: string;
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = userObj;
        return safeUser as Omit<UserInterface, 'password'>;
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

    async checkIfCompanyIsActive(network_id: ObjectId) {
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
    },
};
