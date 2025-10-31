// models/Post.js - Mongoose model for blog posts

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    featuredImage: {
      type: String,
      default: "/uploads/default-post.jpg",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
      maxlength: [200, "Excerpt cannot be more than 200 characters"],
    },

    // ✅ Allow author to be either ObjectId or simple string
    author: {
      type: mongoose.Schema.Types.Mixed,
      default: { name: "Anonymous" },
    },

    // ✅ Allow category to be ObjectId or string
    category: {
      type: mongoose.Schema.Types.Mixed,
      default: { name: "General" },
    },

    tags: [String],

    isPublished: {
      type: Boolean,
      default: true,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Automatically generate slug
PostSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }
  next();
});

// ✅ Prevent populate() from throwing errors when author/category aren’t ObjectIds
PostSchema.set("toObject", { virtuals: true });
PostSchema.set("toJSON", { virtuals: true });

PostSchema.virtual("url").get(function () {
  return `/posts/${this.slug}`;
});

// ✅ Safe populate helper
PostSchema.statics.safeFind = async function (query = {}) {
  const posts = await this.find(query).lean();
  return posts.map((p) => ({
    ...p,
    author:
      typeof p.author === "object" && p.author.name
        ? p.author
        : { name: "Anonymous" },
    category:
      typeof p.category === "object" && p.category.name
        ? p.category
        : { name: "General" },
  }));
};

module.exports = mongoose.model("Post", PostSchema);
