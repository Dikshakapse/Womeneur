import mongoose from 'mongoose';
import { User } from '../models/User';
import { Business } from '../models/Business';
import { Post, Event } from '../models/Community';
import { Resource } from '../models/Resource';
import { Mentorship } from '../models/Mentorship';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Business.deleteMany({}),
      Post.deleteMany({}),
      Event.deleteMany({}),
      Resource.deleteMany({}),
      Mentorship.deleteMany({})
    ]);

    // Create sample users
    const users = await User.create([
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        businessType: 'Technology',
        stage: 'startup',
        interests: ['AI', 'E-commerce'],
        mentorStatus: 'mentor'
      },
      {
        name: 'Emily Chen',
        email: 'emily@example.com',
        password: 'password123',
        businessType: 'Retail',
        stage: 'ideation',
        interests: ['Fashion', 'Sustainability'],
        mentorStatus: 'mentee'
      }
    ]);

    // Create sample businesses
    await Business.create([
      {
        owner: users[0]._id,
        name: 'TechWomen Solutions',
        description: 'AI-powered business solutions',
        industry: 'Technology',
        stage: 'startup',
        financials: {
          initialInvestment: 50000,
          projectedRevenue: 200000,
          monthlyExpenses: 8000
        }
      }
    ]);

    // Create sample posts
    await Post.create([
      {
        author: users[0]._id,
        content: 'Excited to share my journey in tech entrepreneurship!',
        tags: ['tech', 'startup', 'womenintech']
      }
    ]);

    // Create sample events
    await Event.create([
      {
        organizer: users[0]._id,
        title: 'Women in Tech Meetup',
        description: 'Monthly networking event for women in technology',
        type: 'networking',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxParticipants: 50
      }
    ]);

    // Create sample resources
    await Resource.create([
      {
        title: 'Business Plan Template',
        description: 'Comprehensive business plan template for startups',
        type: 'template',
        category: ['planning', 'startup'],
        submittedBy: users[0]._id
      }
    ]);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();