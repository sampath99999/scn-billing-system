import connectDB from '#utils/database.js';
import { TestUserSeeder } from './testUser.seed.js';

connectDB();

console.info('Seeding Started');
const seedingClasses = [TestUserSeeder];

for (let seedClass of seedingClasses) {
    await new seedClass().seed().catch(console.error);
}

console.info('Seeding Completed');
