const Doc = require("../models/Doc");
const Blog = require("../models/Blog");
const News = require("../models/News");
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");

// Create a DOMPurify instance for server-side HTML sanitization
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// Sanitize HTML to prevent XSS while keeping safe formatting
function sanitizeHTML(html) {
  if (!html) return html;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code', 'span', 'div', 'table',
      'thead', 'tbody', 'tr', 'th', 'td', 'sub', 'sup', 'hr', 'iframe', 'video', 'source'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel',
      'width', 'height', 'id', 'frameborder', 'allow', 'allowfullscreen', 'controls', 'type'],
    ALLOW_DATA_ATTR: false,
  });
}

// --- Docs ---
async function getDocs(req, res) {
  try {
    const docs = await Doc.find().sort({ section: 1, createdAt: 1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch docs." });
  }
}

async function addDoc(req, res) {
  try {
    const data = { ...req.body };
    if (data.content) data.content = sanitizeHTML(data.content);
    const doc = new Doc(data);
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: "Failed to add doc." });
  }
}

async function updateDoc(req, res) {
  try {
    const data = { ...req.body };
    if (data.content) data.content = sanitizeHTML(data.content);
    const doc = await Doc.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!doc) return res.status(404).json({ error: "Doc not found" });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: "Failed to update doc." });
  }
}

async function deleteDoc(req, res) {
  try {
    const doc = await Doc.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Doc not found" });
    res.json({ message: "Doc deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete doc." });
  }
}

// --- Blogs ---
async function getBlogs(req, res) {
  try {
    const blogs = await Blog.find().sort({ updatedAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs." });
  }
}

async function addBlog(req, res) {
  try {
    const data = { ...req.body };
    if (data.content) data.content = sanitizeHTML(data.content);
    const blog = new Blog(data);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to add blog." });
  }
}

async function updateBlog(req, res) {
  try {
    const data = { ...req.body };
    if (data.content) data.content = sanitizeHTML(data.content);
    const blog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog." });
  }
}

async function deleteBlog(req, res) {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog." });
  }
}

// --- News ---
async function getNews(req, res) {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news." });
  }
}

async function addNews(req, res) {
  try {
    const newsItem = new News(req.body);
    await newsItem.save();
    res.status(201).json(newsItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add news." });
  }
}

async function updateNews(req, res) {
  try {
    const newsItem = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!newsItem) return res.status(404).json({ error: "News not found" });
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update news." });
  }
}

async function deleteNews(req, res) {
  try {
    const newsItem = await News.findByIdAndDelete(req.params.id);
    if (!newsItem) return res.status(404).json({ error: "News not found" });
    res.json({ message: "News deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete news." });
  }
}

// --- Blog Interactions ---
async function likeBlog(req, res) {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Check if user already liked
    const hasLiked = blog.likes.includes(userId);
    
    if (hasLiked) {
      // Unlike
      blog.likes = blog.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      blog.likes.push(userId);
    }
    
    await blog.save();
    res.json({ message: hasLiked ? "Unliked" : "Liked", likes: blog.likes });
  } catch (error) {
    res.status(500).json({ error: "Failed to like blog." });
  }
}

async function commentBlog(req, res) {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const username = req.user.username; // Added by authenticate middleware
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const newComment = {
      user: userId,
      username: username,
      text: text.trim(),
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json({ message: "Comment added", comments: blog.comments });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment." });
  }
}

module.exports = {
  getDocs, addDoc, updateDoc, deleteDoc,
  getBlogs, addBlog, updateBlog, deleteBlog, likeBlog, commentBlog,
  getNews, addNews, updateNews, deleteNews,
};
