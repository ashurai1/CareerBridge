import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Sample users data
const users = [
    {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: "Alice123",
        role: "candidate",
        skills: ["JavaScript", "React", "Node.js"],
        education: [{
            institution: "MIT",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: new Date("2018-09-01"),
            endDate: new Date("2022-05-15")
        }]
    },
    {
        name: "Bob Smith",
        email: "bob@example.com",
        password: "Bob123",
        role: "employer",
        companyName: "Tech Corp",
        companyWebsite: "https://techcorp.com",
        companySize: "51-200",
        industry: "Technology"
    },
    {
        name: "Charlie Brown",
        email: "charlie@example.com",
        password: "Charlie123",
        role: "candidate",
        skills: ["Python", "Django", "PostgreSQL"],
        experience: [{
            company: "StartupXYZ",
            position: "Junior Developer",
            startDate: new Date("2022-06-01"),
            endDate: new Date("2023-12-31"),
            description: "Worked on backend development"
        }]
    },
    {
        name: "Diana Prince",
        email: "diana@example.com",
        password: "Diana123",
        role: "employer",
        companyName: "Innovation Labs",
        companyWebsite: "https://innovationlabs.com",
        companySize: "11-50",
        industry: "Software Development"
    },
    {
        name: "Ethan Hunt",
        email: "ethan@example.com",
        password: "Ethan123",
        role: "candidate",
        skills: ["Java", "Spring Boot", "Microservices", "Docker"],
        education: [{
            institution: "Stanford University",
            degree: "Master of Science",
            field: "Software Engineering",
            startDate: new Date("2020-09-01"),
            endDate: new Date("2022-05-15")
        }]
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
        console.log(`📊 Database: ${mongoose.connection.name}\n`);

        // Ask user if they want to clear existing data
        console.log('🗑️  Clearing existing users...');
        const deleteResult = await User.deleteMany({});
        console.log(`   Deleted ${deleteResult.deletedCount} existing users\n`);

        // Create new users
        console.log('👥 Creating new users...\n');

        for (const userData of users) {
            try {
                const user = await User.create(userData);
                console.log(`✅ Created ${user.role}: ${user.name} (${user.email})`);
            } catch (error) {
                console.error(`❌ Failed to create ${userData.email}:`, error.message);
            }
        }

        // Show summary
        console.log('\n📊 Database Summary:');
        const totalUsers = await User.countDocuments();
        const candidates = await User.countDocuments({ role: 'candidate' });
        const employers = await User.countDocuments({ role: 'employer' });

        console.log(`   Total Users: ${totalUsers}`);
        console.log(`   Candidates: ${candidates}`);
        console.log(`   Employers: ${employers}`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Test Credentials:');
        console.log('   Email: alice@example.com | Password: Alice123');
        console.log('   Email: bob@example.com   | Password: Bob123');
        console.log('   Email: charlie@example.com | Password: Charlie123');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
