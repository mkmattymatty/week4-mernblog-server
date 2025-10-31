const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Post = require("./models/Post");
const Category = require("./models/Category");
const User = require("./models/User");

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mernmatty";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const seed = async () => {
  try {
    // ✅ Author
    let author = await User.findOne({ email: "admin@example.com" });
    if (!author) {
      author = await User.create({
        name: "Mathias Mwaromboso",
        email: "admin@example.com",
        password: "123456",
      });
    }

    // ✅ Categories
    const categoryNames = [
      "Education",
      "Science",
      "Bioinformatics",
      "Biochemistry",
      "Software Engineering",
      "Land Reclamation",
      "Kenyan Unemployment",
      "Corruption",
      "Cancer Awareness",
      "University Rankings",
      "Transport",
      "Cybersecurity",
    ];

    const categories = await Promise.all(
      categoryNames.map(async (name) => {
        let cat = await Category.findOne({ name });
        if (!cat) cat = await Category.create({ name });
        return cat;
      })
    );

    // ✅ Skip if posts exist
    const existingPosts = await Post.find();
    if (existingPosts.length > 0) {
      console.log("✅ Data already exists. Skipping seed.");
      process.exit();
    }

    // ✅ Rich posts
    const postsData = [
      {
        title: "Education and Technology: A New Frontier for Africa",
        content: `Education in Africa is undergoing a digital revolution. Online learning platforms, virtual classrooms,
and open-access resources are transforming how students acquire knowledge.  
In Kenya, initiatives such as the Competency-Based Curriculum (CBC) are encouraging practical learning and creativity.
However, the digital divide remains a challenge — many rural areas lack internet connectivity and modern equipment.

To address this, governments and private organizations must invest in affordable connectivity, teacher training,
and student devices. Education is the foundation of economic growth — and technology is the key to making it inclusive.`,
        excerpt: "Education in Africa is being reshaped by digital technology and modern learning tools...",
        category: categories.find((c) => c.name === "Education")._id,
        author: author._id,
        featuredImage: "uploads/post1.png",
      },
      {
        title: "Science and Innovation: Kenya’s Path to Development",
        content: `Science drives progress — from renewable energy to medical breakthroughs. Kenya’s scientists are contributing
to regional innovation in agriculture, renewable energy, and disease control.  
With more funding, collaboration between universities and startups could make Kenya a scientific powerhouse.`,
        excerpt: "Kenya’s scientists are driving innovation through agriculture, energy, and health research...",
        category: categories.find((c) => c.name === "Science")._id,
        author: author._id,
        featuredImage: "uploads/post2.png",
      },
      {
        title: "Understanding Bioinformatics: Where Biology Meets Data",
        content: `Bioinformatics is at the heart of modern biology — integrating computer science, statistics, and genomics.
Researchers use algorithms to analyze DNA sequences, predict protein structures, and understand genetic diseases.
In Kenya, bioinformatics is essential for malaria genomics and cancer research.`,
        excerpt: "Bioinformatics combines computer science, statistics, and biology to decode life’s data...",
        category: categories.find((c) => c.name === "Bioinformatics")._id,
        author: author._id,
        featuredImage: "uploads/post3.png",
      },
      {
        title: "The Role of Biochemistry in Human Health",
        content: `Biochemistry explains life at the molecular level. From enzymes to hormones, it reveals how our bodies function.
Modern biochemistry helps in drug discovery, nutrition, and environmental health research.
Universities in Kenya are now emphasizing applied biochemistry for solving real-world challenges.`,
        excerpt: "Biochemistry explores how molecules sustain life and advance medical science...",
        category: categories.find((c) => c.name === "Biochemistry")._id,
        author: author._id,
        featuredImage: "uploads/post4.png",
      },
      {
        title: "Building Modern Software: Why Every Developer Should Learn Full Stack",
        content: `Software engineering is no longer about writing code — it's about solving problems through design,
architecture, and teamwork.  
Full Stack developers, who understand both frontend and backend technologies, are in high demand across Africa.
Frameworks like React, Node.js, and MongoDB empower young innovators to build scalable apps.`,
        excerpt: "Software engineering is evolving fast — full stack skills now define modern developers...",
        category: categories.find((c) => c.name === "Software Engineering")._id,
        author: author._id,
      },
      {
        title: "Land Reclamation and Sustainable Agriculture in Kenya",
        content: `Land degradation threatens food security. Land reclamation projects in arid regions such as Turkana and Garissa
are restoring fertility through irrigation, composting, and agroforestry.  
Technology plays a role too — drones and IoT sensors help monitor soil health and rainfall patterns.`,
        excerpt: "Kenya’s land reclamation projects are restoring hope to arid regions...",
        category: categories.find((c) => c.name === "Land Reclamation")._id,
        author: author._id,
      },
      {
        title: "The Harsh Reality of Unemployment in Kenya",
        content: `Unemployment remains one of Kenya’s toughest challenges. Many graduates struggle to find work despite
their qualifications. A growing concern is workplace exploitation — especially women being pressured
for favors to secure jobs.  
This can only be solved through strict enforcement of employment laws, transparency, and merit-based hiring.`,
        excerpt: "Kenya’s unemployment crisis exposes inequality and corruption in recruitment...",
        category: categories.find((c) => c.name === "Kenyan Unemployment")._id,
        author: author._id,
      },
      {
        title: "Tackling Corruption in Kenya’s Job Market",
        content: `The job market in Kenya has been tainted by favoritism, nepotism, and bribery.
Many deserving candidates lose opportunities to unqualified but connected individuals.
Digital recruitment systems, anonymous applications, and public audits can help restore fairness.`,
        excerpt: "Kenya’s job market must embrace transparency to curb favoritism and bribery...",
        category: categories.find((c) => c.name === "Corruption")._id,
        author: author._id,
      },
      {
        title: "Cancer Awareness and Early Diagnosis in Kenya",
        content: `Cancer remains one of Kenya’s leading causes of death. Awareness campaigns, regular screenings,
and better healthcare funding are essential for saving lives.  
Local hospitals are adopting AI-based image analysis to detect cancers early — a promising step for affordable care.`,
        excerpt: "Cancer awareness and AI-based diagnosis are transforming Kenya’s healthcare...",
        category: categories.find((c) => c.name === "Cancer Awareness")._id,
        author: author._id,
      },
      {
        title: "Why Kenyatta University Leads in Academic Excellence",
        content: `Kenyatta University consistently ranks among Kenya’s top universities due to its research output,
digital innovation, and community outreach.  
The university’s focus on entrepreneurship and technology has inspired many startups across East Africa.`,
        excerpt: "Kenyatta University leads Kenya’s higher education through innovation and research...",
        category: categories.find((c) => c.name === "University Rankings")._id,
        author: author._id,
      },
      {
        title: "Kenya’s Transport System: Progress and Pitfalls",
        content: `Kenya’s transport infrastructure has improved with the Standard Gauge Railway (SGR) and road expansions.
However, traffic congestion, road safety, and corruption in licensing remain major issues.
Adopting smart transport systems and enforcing safety laws are key to progress.`,
        excerpt: "Kenya’s transport system is evolving, but challenges in safety and congestion persist...",
        category: categories.find((c) => c.name === "Transport")._id,
        author: author._id,
      },
      {
        title: "Cybersecurity in the Digital Era",
        content: `With digital transformation comes vulnerability. Kenyan businesses and institutions face a rise in
cyberattacks targeting financial systems and personal data.  
Training, awareness, and government regulation are essential to build a secure online ecosystem.`,
        excerpt: "As Kenya embraces digitization, cybersecurity has become more vital than ever...",
        category: categories.find((c) => c.name === "Cybersecurity")._id,
        author: author._id,
      },
    ];

    await Post.insertMany(postsData);
    console.log("✅ 15+ rich blog posts seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seed();
