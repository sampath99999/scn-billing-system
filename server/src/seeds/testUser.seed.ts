import { Encrypter } from '#utils/bcrypt.js';
import { User } from '#models/user.model.js';
import mongoose from 'mongoose';
import { Company } from '../models/company.model.js';
import { UserTypes } from '#types/UserTypes.js';
import connectDB from '#utils/database.js';

export class TestUserSeeder {
    async seed() {
        // Check if Company exists
        const companyExists = await Company.findOne({
            name: 'Sampath Cable Network',
        });
        if (companyExists) {
            console.info('Company Already Exists');
            return;
        }

        const userExists = await User.findOne({
            username: 'sampath',
        });
        if (userExists) {
            console.info('User Already Exists');
            return;
        }

        const session = mongoose.startSession();
        (await session).startTransaction();
        try {
            console.info('Creating Company!');
            const company = new Company({
                name: 'Sampath Cable Network',
                address: 'Khammam',
                phone_no: '9989079159',
                owner_name: 'Saidulu',
            });
            company.save();
            console.info('Company Created!');

            console.info('Creating User!');
            const user = new User({
                name: 'Sampath Bandla',
                username: 'sampath',
                password: await Encrypter.hashPassword('sampath'),
                phone_no: '7036774550',
                user_type: UserTypes.ADMIN,
                company_id: company.id,
            });
            user.save();
            console.info('User Created!');
            (await session).commitTransaction();
        } catch (err: any) {
            (await session).abortTransaction();
            console.error(err);
        } finally {
            (await session).endSession();
        }
    }
}
