import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import dotenv from 'dotenv';
import './models/Base.js';
import './models/User.js';
import { Creator } from './models/Creator.js';
import User from './models/User.js';
import Post from './models/Post.js';

dotenv.config();

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing data (optional - uncomment if you want to reset database)
        // await mongoose.connection.db.dropDatabase();
        // console.log('🗑️ Cleared existing database');

        // Create sample users
        const hashedPassword = await hash('password123', 10);

        // Create regular user
        const regularUser = new User({
            email: 'john.doe@example.com',
            password: hashedPassword,
            username: 'john_doe',
            bio: 'I love reading about tech and business topics!',
            role: 'user'
        });
        await regularUser.save();
        console.log('👤 Created regular user: john_doe');

        // Create sample creators
        const creators = [
            {
                email: 'techguru@example.com',
                password: hashedPassword,
                username: 'TechGuru',
                bio: 'Full-stack developer sharing insights about modern web development, React, Node.js, and cloud technologies.',
                category: 'Technology',
                fee: 19.99,
                role: 'creator',
                payoutInfo: 'stripe_account_1'
            },
            {
                email: 'businesspro@example.com',
                password: hashedPassword,
                username: 'BusinessPro',
                bio: 'Entrepreneur and business consultant helping others build successful startups and scale their companies.',
                category: 'Business',
                fee: 29.99,
                role: 'creator',
                payoutInfo: 'stripe_account_2'
            },
            {
                email: 'healthylife@example.com',
                password: hashedPassword,
                username: 'HealthyLifestyle',
                bio: 'Certified nutritionist and fitness coach sharing tips for a healthier, more balanced lifestyle.',
                category: 'Health & Wellness',
                fee: 15.99,
                role: 'creator',
                payoutInfo: 'stripe_account_3'
            },
            {
                email: 'artcreative@example.com',
                password: hashedPassword,
                username: 'ArtCreative',
                bio: 'Digital artist and designer teaching creative techniques, design principles, and artistic inspiration.',
                category: 'Art & Design',
                fee: 24.99,
                role: 'creator',
                payoutInfo: 'stripe_account_4'
            },
            {
                email: 'datacoder@example.com',
                password: hashedPassword,
                username: 'DataScientist',
                bio: 'Data scientist and AI researcher sharing insights about machine learning, analytics, and data visualization.',
                category: 'Data Science',
                fee: 34.99,
                role: 'creator',
                payoutInfo: 'stripe_account_5'
            }
        ];

        const createdCreators = [];
        for (const creatorData of creators) {
            const creator = new Creator(creatorData);
            await creator.save();
            createdCreators.push(creator);
            console.log(`🎨 Created creator: ${creatorData.username}`);
        }

        // Create sample posts for creators
        const samplePosts = [
            {
                title: 'Getting Started with React Hooks',
                body: 'In this post, I\'ll walk you through the fundamentals of React Hooks and how they can simplify your component logic. We\'ll cover useState, useEffect, and custom hooks with practical examples.',
                author: createdCreators[0]._id, // TechGuru
            },
            {
                title: 'Building a Scalable Node.js API',
                body: 'Learn how to structure a Node.js API for scalability. We\'ll discuss middleware, error handling, authentication, and database optimization techniques.',
                author: createdCreators[0]._id, // TechGuru
            },
            {
                title: 'Advanced JavaScript Patterns',
                body: 'Deep dive into advanced JavaScript patterns including closures, prototypes, async/await, and modern ES6+ features that every developer should know.',
                author: createdCreators[0]._id, // TechGuru
            },
            {
                title: 'Startup Funding: A Complete Guide',
                body: 'Everything you need to know about raising capital for your startup. From preparing your pitch deck to negotiating with investors.',
                author: createdCreators[1]._id, // BusinessPro
            },
            {
                title: 'Building a Remote Team Culture',
                body: 'Best practices for managing remote teams, fostering communication, and maintaining company culture in a distributed work environment.',
                author: createdCreators[1]._id, // BusinessPro
            },
            {
                title: '10-Minute Morning Workout Routine',
                body: 'Start your day right with this energizing 10-minute workout routine. No equipment needed - perfect for busy schedules!',
                author: createdCreators[2]._id, // HealthyLifestyle
            },
            {
                title: 'Nutrition Myths Debunked',
                body: 'Let\'s separate fact from fiction when it comes to nutrition. I\'ll debunk common myths and share evidence-based advice for healthy eating.',
                author: createdCreators[2]._id, // HealthyLifestyle
            },
            {
                title: 'Color Theory for Digital Artists',
                body: 'Master the fundamentals of color theory to create more impactful digital artwork. Learn about color harmonies, contrast, and emotional impact.',
                author: createdCreators[3]._id, // ArtCreative
            },
            {
                title: 'Digital Art Tools and Techniques',
                body: 'A comprehensive guide to the best digital art software, hardware, and techniques for creating professional-quality artwork.',
                author: createdCreators[3]._id, // ArtCreative
            },
            {
                title: 'Introduction to Machine Learning',
                body: 'Demystifying machine learning for beginners. We\'ll cover basic concepts, algorithms, and practical applications in real-world scenarios.',
                author: createdCreators[4]._id, // DataScientist
            }
        ];

        for (const postData of samplePosts) {
            const post = new Post(postData);
            await post.save();
            console.log(`📝 Created post: ${postData.title}`);
        }

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Test Accounts Created:');
        console.log('Regular User (Reader Dashboard):');
        console.log('  Email: john.doe@example.com');
        console.log('  Password: password123');
        console.log('\nCreator Accounts (Creator Dashboard):');
        console.log('  Email: techguru@example.com, Password: password123');
        console.log('  Email: businesspro@example.com, Password: password123');
        console.log('  Email: healthylife@example.com, Password: password123');
        console.log('  Email: artcreative@example.com, Password: password123');
        console.log('  Email: datacoder@example.com, Password: password123');
        console.log('\nAdmin Dashboard:');
        console.log('  Go to /dashboard → Admin Access');
        console.log('  Username: admin, Password: admin123');
        console.log('\n💡 Tip: Run this script anytime to reset your database with fresh sample data!');

        mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeder
seedDatabase();
