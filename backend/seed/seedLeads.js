// console.log("thsi file is running")

import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import LeadModel from "../Models/LeadModel.js"

dotenv.config();
 
const MONGO_URI = process.env.MONGODB_URL;

console.log("thsi file is running")

const statuses = ["New", "Contacted", "Qualified", "Converted", "Lost"];
const sources = ["Website", "Facebook", "Referral", "LinkedIn"];

const getRandomItem = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const generateLeads = (count = 500) => {
  const leads = [];

  for (let i = 0; i < count; i++) {
    leads.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number("9#########"),
      company: faker.company.name(),
      source: getRandomItem(sources),
      status: getRandomItem(statuses),
      createdAt: faker.date.past({ years: 1 }),
    });
  }

  return leads;
};

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    await LeadModel.deleteMany(); // optional
    await LeadModel.insertMany(generateLeads(500)); // 300–1000

    console.log("Leads seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
