import MailHelper from '#helpers/mail.helper.js';
import { Company } from '#models/company.model.js';
import {
    User,
    UserDocumentInterface,
    UserInterface,
} from '#models/user.model.js';
import { AppError } from '#utils/appError.js';
import { Encrypter } from '#utils/bcrypt.js';
import { JWT } from '#utils/jwt.js';
import { ObjectId } from 'mongoose';

export default class AuthService {
    static async login(username: string, password: string) {
        let user = await User.findOne({
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
        await this.checkIfUserIsActive(user);
        const token = await JWT.generateToken({
            _id: user._id as ObjectId,
            user_type: user.user_type,
        })
        return {token};
    }

    static removePasswordFromObject(user: UserDocumentInterface) {
        const userObj = user.toObject();
        const { password, ...safeUser } = userObj;
        return safeUser;
    }

    static async checkIfUserIsActive(user: UserDocumentInterface) {
        if (!user.is_active) {
            throw new AppError(
                'User is Inactive, Please contact your Admin',
                400,
            );
        }
        return true;
    }

    static async checkIfCompanyIsActive(network_id: ObjectId) {
        const company = await Company.findById(network_id);
        if (!company) {
            throw new AppError('Company detials not found!', 404);
        }
        if (!company?.is_active) {
            throw new AppError(
                'Company is in Inactive state, please contant Our Support Number',
                400,
            );
        }
    }
}
