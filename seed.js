// seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Post = require("./models/Post");
const Category = require("./models/Category");
const User = require("./models/User");

dotenv.config();

// MongoDB URI
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mernmatty";

// Check for reset flag
const RESET = process.argv.includes("--reset");

(async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected to", mongoURI.includes("mongodb.net") ? "Atlas" : "Local");

    // Optional reset
    if (RESET) {
      console.log("⚠️ Reset flag detected — deleting old data...");
      await Promise.all([Post.deleteMany({}), Category.deleteMany({})]);
      console.log("🗑️ Existing Posts & Categories deleted.");
    }

    // Admin user
    let author = await User.findOne({ email: "admin@example.com" });
    if (!author) {
      author = await User.create({
        name: "Mathias Mwaromboso",
        email: "admin@example.com",
        password: "123456",
      });
      console.log("👤 Created admin user.");
    } else {
      console.log("👤 Admin user already exists.");
    }

    // Categories
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

    const categories = [];
    for (const name of categoryNames) {
      let cat = await Category.findOne({ name });
      if (!cat) {
        cat = await Category.create({ name });
        console.log(`📂 Created category: ${name}`);
      }
      categories.push(cat);
    }

    const postCount = await Post.countDocuments();
    if (postCount > 0 && !RESET) {
      console.log(`✅ ${postCount} posts already exist. Use '--reset' to reseed.`);
      await mongoose.connection.close();
      console.log("🔒 Connection closed.");
      return;
    }

    // 📰 Long-form Kenyan blog posts
    const postsData = [
      {
        title: "Education and Technology: How Kenya is Rewiring Classrooms",
        excerpt:
          "Digital tools, teacher training and the CBC are reshaping Kenyan classrooms — but the digital divide remains.",
        content: `
Education in Kenya is being reshaped by a wave of digital transformation. Schools are integrating tablets, projectors, and e-learning systems into lessons. 
From county laptop programs to grassroots community learning centers, education is gradually moving from rote memorization to interactive engagement.

The Competency-Based Curriculum (CBC) focuses on skill acquisition and creativity — but its success depends on teacher preparedness and access to devices. 
Teachers must learn to use modern teaching aids effectively, while government and private partners must ensure rural schools aren’t left behind.

Despite the challenges, progress is visible. 
Schools in Nairobi, Mombasa, and Kisumu are experimenting with blended learning, coding clubs, and virtual labs.
If Kenya can combine infrastructure, content, and inclusivity, the next generation will not only consume digital tools — they’ll build them.`,
        category: categories.find((c) => c.name === "Education")._id,
        author: author._id,
      },
      {
        title: "From Labs to Fields: Kenya’s Science Revolution",
        excerpt:
          "Kenyan researchers are translating lab discoveries into farming, energy and health solutions for local communities.",
        content: `
Kenya’s research ecosystem is experiencing a quiet revolution. 
Institutions such as KALRO, KEMRI, and local universities are working on practical science — not just publications.

Agricultural scientists are developing drought-resistant seeds, biopesticides, and smart irrigation systems. 
Meanwhile, engineers are deploying low-cost solar water purifiers and wind turbines in rural counties.

However, translating research into real-world impact requires investment and collaboration. 
More government grants, private sector partnerships, and international exchange programs will help Kenyan scientists take prototypes to production.

A future where research fuels entrepreneurship and local innovation is within reach — if policy, funding, and community engagement align.`,
        category: categories.find((c) => c.name === "Science")._id,
        author: author._id,
      },
      {
        title: "Bioinformatics in Kenya: Turning Genomes into Action",
        excerpt:
          "Genomic surveillance and data analysis are helping Kenya combat malaria, TB and emerging infectious diseases.",
        content: `
Bioinformatics — the fusion of biology and computer science — is giving Kenya a new tool against diseases. 
Local researchers use genome sequencing to track malaria, tuberculosis, and viral outbreaks.

KEMRI, ILRI, and several universities are building bioinformatics capacity through training programs, data-sharing platforms, and regional collaborations. 
With the right investment in computing infrastructure, Kenya could become East Africa’s hub for genomic research.

Beyond healthcare, bioinformatics supports agriculture, conservation, and even forensics. 
The key challenge remains funding and skilled manpower — but the foundation has been laid for a data-driven public health system.`,
        category: categories.find((c) => c.name === "Bioinformatics")._id,
        author: author._id,
      },
      {
        title: "Biochemistry: The Molecular Solutions to Kenya’s Health Challenges",
        excerpt:
          "Local biochemistry research underpins diagnostics, nutrition and new therapies for diseases that affect Kenyans.",
        content: `
From nutrition studies to medical diagnostics, Kenyan biochemists are exploring life at the molecular level. 
At the University of Nairobi and Egerton, labs are testing low-cost enzyme kits and developing herbal extracts with real pharmacological potential.

The challenge is sustainability — reagents, instruments, and funding are often scarce. 
By investing in local manufacturing of lab supplies and encouraging research commercialization, Kenya can reduce dependency and boost innovation.

In the long term, biochemical innovation will help develop affordable diagnostics for rural hospitals and create biotech startups solving African health problems.`,
        category: categories.find((c) => c.name === "Biochemistry")._id,
        author: author._id,
      },
      {
        title: "Full-Stack Kenya: Building the Next Generation of Software Startups",
        excerpt:
          "MERN, agile practices, and local talent are powering a wave of Kenyan startups solving domestic problems.",
        content: `
Kenya’s software scene has matured rapidly — moving from solo coders to full-fledged startup teams. 
Full-stack developers, comfortable in both React frontends and Node.js backends, are building real products serving Kenyan users.

E-commerce, logistics, education tech, and digital health platforms are now common. 
Developers collaborate via hackathons and co-working spaces like iHub, Gearbox, and Nairobi Garage.

With global remote work opportunities and cloud tools, Kenyan developers are exporting code worldwide. 
However, mentorship and funding remain bottlenecks. 
When investors and educators align with tech talent, Kenya can rival global innovation hubs.`,
        category: categories.find((c) => c.name === "Software Engineering")._id,
        author: author._id,
      },
      {
        title: "Turning Dust into Farms: Land Reclamation Success Stories from Kenya",
        excerpt:
          "Irrigation, soil rehabilitation and community-led projects are restoring arid land into productive farms.",
        content: `
From Turkana to Kitui, Kenyan farmers are reclaiming degraded land using irrigation canals, composting, and tree planting. 
Community-driven projects like Tana River’s sand dams show how technology and tradition can blend to fight desertification.

Satellite data, mobile apps, and drip irrigation systems help monitor soil health and water use. 
When communities own the process — forming cooperatives and managing resources — the results are lasting.

Land reclamation is not just about greening deserts; it’s about creating food, jobs, and dignity.`,
        category: categories.find((c) => c.name === "Land Reclamation")._id,
        author: author._id,
      },
      {
        title: "Youth Unemployment in Kenya: Causes, Voices and Practical Remedies",
        excerpt:
          "Graduate unemployment is structural — requiring vocational training, entrepreneurship and transparent hiring.",
        content: `
Despite thousands of university graduates, Kenya’s unemployment remains high. 
The issue is structural — too few jobs, and a mismatch between education and industry skills.

Vocational training, apprenticeships, and digital freelancing are emerging as practical solutions. 
TVET programs are producing electricians, plumbers, and technicians who find work faster than many graduates.

Entrepreneurship programs, microloans, and digital platforms (like Ajira and Upwork) give youth real alternatives. 
The future of work in Kenya depends on innovation and fair hiring — not just degrees.`,
        category: categories.find((c) => c.name === "Kenyan Unemployment")._id,
        author: author._id,
      },
      {
        title: "Fighting Corruption: Practical Steps to Restore Trust in Kenya’s Institutions",
        excerpt:
          "Transparency, digital procurement and civic oversight can limit space for abuse in hiring and public contracts.",
        content: `
Corruption affects every Kenyan — from inflated road tenders to unfair recruitment. 
However, digitization and citizen vigilance are slowly changing the tide.

E-procurement systems, open budget data, and digital tax services reduce human discretion and create accountability trails. 
Civil society and investigative journalists play a vital role in monitoring these systems.

Ethics must start in education — from primary school to university. 
When transparency becomes cultural, Kenya will finally rebuild public trust.`,
        category: categories.find((c) => c.name === "Corruption")._id,
        author: author._id,
      },
      {
        title: "Early Detection Saves Lives: Cancer Awareness Drive in Kenya",
        excerpt:
          "Screenings, community outreach and affordable diagnostics are critical to reducing cancer mortality rates.",
        content: `
Cancer is one of Kenya’s top three causes of death — yet most cases are diagnosed late. 
Mobile clinics, awareness campaigns, and affordable testing are bridging the gap.

Counties like Meru and Kisumu are running local awareness drives, while national hospitals use telemedicine to connect specialists with rural health centers. 
NGOs are training nurses in screening and counseling — turning awareness into early diagnosis.

A national cancer database and subsidized treatment would make early detection even more powerful.`,
        category: categories.find((c) => c.name === "Cancer Awareness")._id,
        author: author._id,
      },
      {
        title: "Why Kenyan Universities Must Focus on Research with Local Impact",
        excerpt:
          "Research that solves Kenyan problems—agriculture, health, and technology—boosts university standing and national prosperity.",
        content: `
Kenyan universities are producing research — but much of it stays on shelves. 
By focusing on applied projects that solve national issues, universities can elevate both relevance and ranking.

Partnerships with industries, county governments, and NGOs ensure that innovations reach communities. 
Students should be encouraged to build prototypes, startups, and policy tools that create measurable impact.

Research funding, mentorship, and intellectual property support will make Kenya’s academia a driver of economic growth.`,
        category: categories.find((c) => c.name === "University Rankings")._id,
        author: author._id,
      },
      {
        title: "Transport in Kenya: Modern Projects, Ongoing Challenges",
        excerpt:
          "Infrastructural wins like the SGR must be matched with road safety, maintenance and equitable transport planning.",
        content: `
Kenya’s Standard Gauge Railway, bypass roads, and airport expansions have boosted mobility. 
Yet accidents, congestion, and poor planning still limit efficiency.

Public transport reform is key — integrating matatus, buses, and commuter trains with one ticketing system could transform urban commuting. 
Maintenance budgets must match expansion, or progress will fade.

Kenya’s transport future must balance sustainability, safety, and inclusivity.`,
        category: categories.find((c) => c.name === "Transport")._id,
        author: author._id,
      },
      {
        title: "Securing Kenya’s Digital Future: Practical Cybersecurity Steps",
        excerpt:
          "Awareness, regulations, and technical capacity are central to protecting citizens and businesses online.",
        content: `
Kenya’s fast digitalization — from eCitizen to mobile banking — has exposed vulnerabilities. 
Cybersecurity is now a national priority.

From phishing scams to ransomware, threats target citizens, businesses, and even government systems. 
Building resilience requires user awareness, cyber hygiene, and professional security audits.

Training institutions should integrate cybersecurity into ICT courses. 
Government must enforce data protection and incident response frameworks. 
A safe digital space will sustain Kenya’s innovation economy.`,
        category: categories.find((c) => c.name === "Cybersecurity")._id,
        author: author._id,
      },
    ];

    await Post.insertMany(postsData);
    console.log("✅ All 12 long-form Kenyan posts seeded successfully!");
    await mongoose.connection.close();
    console.log("🔒 MongoDB connection closed.");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    try {
      await mongoose.connection.close();
    } catch (closeErr) {
      console.error("❌ Error closing connection:", closeErr);
    }
    process.exit(1);
  }
})();
