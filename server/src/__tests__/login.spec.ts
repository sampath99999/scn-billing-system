import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import AuthService from '#services/auth.service.js';
import { User } from '#models/user.model.js';
import { Company, CompanyInterface } from '#models/company.model.js';
import mongoose from 'mongoose';
import { Encrypter } from '#utils/bcrypt.js';
import { UserTypes } from '#types/UserTypes.js';
import { connectTestDB } from '#utils/database.js';

describe('Login API Tests', () => {
    let company: CompanyInterface;
    let testUserData;

    beforeAll(async () => {
        await connectTestDB();
        // Create a test company
        company = await Company.create({
            name: 'Test Company',
            address: 'Test Address',
            phone_no: '1234567890',
            owner_name: 'Test Owner',
            is_active: true,
        });

        // Create a test user
        testUserData = {
            name: 'Test User',
            username: 'testuser',
            password: Encrypter.hashPassword('testpassword'),
            phone_no: '9876543210',
            user_type: UserTypes.ADMIN,
            company_id: company._id as string,
            is_active: true,
        };
        await User.create(testUserData);
    });

    afterAll(async () => {
        // Clean up test data
        await User.deleteMany({});
        await Company.deleteMany({});
        await mongoose.connection.close();
    });

    describe('Successful login', () => {
        it('should successfully login with valid credentials', async () => {
            const response = await AuthService.login(
                'testuser',
                'testpassword',
            );
            expect(response).toHaveProperty('token');
            expect(typeof response.token).toBe('string');
        });
    });

    describe('Failed login scenarios', () => {
        it('should fail with invalid username', async () => {
            await expect(
                AuthService.login('nonexistentuser', 'testpassword'),
            ).rejects.toThrow(
                'Invalid Credentials, Please check Username and Password',
            );
        });

        it('should fail with invalid password', async () => {
            await expect(
                AuthService.login('testuser', 'wrongpassword'),
            ).rejects.toThrow(
                'Invalid Credentials, Please check Username and Password',
            );
        });

        it('should fail when user is inactive', async () => {
            // Deactivate the user
            await User.findOneAndUpdate(
                { username: 'testuser' },
                { is_active: false },
            );

            await expect(
                AuthService.login('testuser', 'testpassword'),
            ).rejects.toThrow('User is Inactive, Please contact your Admin');

            // Reactivate the user for other tests
            await User.findOneAndUpdate(
                { username: 'testuser' },
                { is_active: true },
            );
        });

        it('should fail when company is inactive', async () => {
            // Deactivate the company
            await Company.findByIdAndUpdate(company._id, { is_active: false });

            await expect(
                AuthService.login('testuser', 'testpassword'),
            ).rejects.toThrow(
                'Company is in Inactive state, please contact Our Support Number',
            );

            // Reactivate the company for other tests
            await Company.findByIdAndUpdate(company._id, { is_active: true });
        });
    });
});
