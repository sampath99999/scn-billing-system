import MailHelper from '#helpers/mail.helper.js';
import { Company } from '#models/company.model.js';
import { User, UserDocumentInterface } from '#models/user.model.js';
import { AppError } from '#utils/appError.js';
import { Encrypter } from '#utils/bcrypt.js';
import { ObjectId } from 'mongoose';

export default class AuthService {
    static async login(username: string, password: string) {
        let user = await User.findOne({
            username,
        });
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
        return user;
    }

    static async checkIfUserIsActive(user: UserDocumentInterface) {
        console.log(user);
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
