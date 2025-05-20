const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;
const BASE_URL ='http://localhost:' + PORT;

// Middleware
app.use(cors());
app.use(express.json());

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
// 7 days ago (last week)
const lastWeek = new Date();
lastWeek.setDate(today.getDate() - 7);

// Ensure upload directory exists
const UPLOAD_DIR = './uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// Configure multer for disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });


// 🗃 In-memory post store with 3 default posts
const posts = [
    {
        id: 1,
        title: '5 Mouth-Watering Recipes You Need to Try This Week',
        description: `
            <p>Looking for inspiration in the kitchen? We've rounded up five irresistible recipes that are perfect for spicing up your weeknight meals. From savory to sweet, there's something for everyone.</p>
            <ol>
              <li>
                <strong>Garlic Butter Shrimp Pasta</strong><br>
                A quick and creamy dish with juicy shrimp, rich garlic butter, and al dente pasta. Perfect for a 20-minute dinner.
              </li>
              <li>
                <strong>Spicy Korean Fried Chicken</strong><br>
                Crispy, sticky, and spicy! This dish delivers big flavor with a gochujang glaze and sesame crunch.
              </li>
              <li>
                <strong>Loaded Veggie Tacos</strong><br>
                A fresh and colorful taco night favorite, packed with grilled veggies, avocado, and a zesty lime crema.
              </li>
              <li>
                <strong>One-Pan Lemon Herb Salmon</strong><br>
                Baked with garlic, lemon, and fresh herbs, this healthy dinner comes together in under 30 minutes.
              </li>
              <li>
                <strong>Chocolate Lava Cakes</strong><br>
                End on a sweet note with these decadent, gooey-centered cakes that are easier to make than you'd think.
              </li>
            </ol>
            <p>Give one (or all) of these a try and transform your weeknight cooking into something extraordinary!</p>
        `,
        image: {
            url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&h=600&q=80',
        },
        author: {
            avatarUrl: 'https://img-c.udemycdn.com/user/75x75/171403284_682c.jpg',
            name: 'Babak',
        },
        publishedDate: today,
    },
    {
        id: 2,
        title: '10 Reasons Why Cats Make the Best Companions',
        description: `
            <p>Cats have earned a special place in our hearts — and for good reason. Whether you're a seasoned cat lover or considering your first feline friend, here are ten reasons why cats make the best companions.</p>
            <ol>
              <li>
                <strong>Low Maintenance:</strong><br>
                Cats are independent and don't require constant attention, making them perfect for busy lifestyles.
              </li>
              <li>
                <strong>Clean Creatures:</strong><br>
                They groom themselves regularly and are naturally litter-trained.
              </li>
              <li>
                <strong>Quiet and Peaceful:</strong><br>
                Cats tend to be quieter than many other pets, offering calm company without the noise.
              </li>
              <li>
                <strong>Affectionate (on Their Terms):</strong><br>
                When a cat chooses to cuddle, it's genuine and heartwarming.
              </li>
              <li>
                <strong>Perfect Apartment Pets:</strong><br>
                They adapt well to smaller living spaces and don't need outdoor walks.
              </li>
              <li>
                <strong>Excellent Entertainers:</strong><br>
                Watching a cat chase a toy or nap in odd positions is endlessly amusing.
              </li>
              <li>
                <strong>Great for Mental Health:</strong><br>
                Studies show that petting cats can reduce stress and anxiety.
              </li>
              <li>
                <strong>Long Lifespan:</strong><br>
                Cats often live into their late teens, giving you many years of companionship.
              </li>
              <li>
                <strong>Pest Control Experts:</strong><br>
                No more bugs or rodents — your cat has it covered.
              </li>
              <li>
                <strong>Unique Personalities:</strong><br>
                Every cat is different, with quirks and charm that make them endlessly lovable.
              </li>
            </ol>
            <p>From their quiet affection to their playful spirit, cats truly are exceptional companions. If you've got a cat in your life, you already know — they're family.</p>
        `,
        image: {
            url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&h=600&q=80',
        },
        author: {
            avatarUrl: 'https://img-c.udemycdn.com/user/75x75/171403284_682c.jpg',
            name: 'Babak',
        },
        publishedDate: yesterday,
    },
    {
        id: 3,
        title: 'Building Effective Teamwork in a Virtual Environment',
        description: `
            <ol>
              <li>
                <strong>Establish Clear Communication Channels:</strong><br>
                Use tools like Slack, Microsoft Teams, or Zoom to ensure everyone stays connected and aligned.
              </li>
              <li>
                <strong>Set Expectations Early:</strong><br>
                Define roles, responsibilities, and goals from the start to minimize confusion and overlap.
              </li>
              <li>
                <strong>Foster Trust and Transparency:</strong><br>
                Encourage openness, regular check-ins, and sharing both wins and challenges.
              </li>
              <li>
                <strong>Use Video Whenever Possible:</strong><br>
                Face-to-face interaction builds stronger connections and reduces feelings of isolation.
              </li>
              <li>
                <strong>Embrace Flexibility:</strong><br>
                Respect time zones and personal schedules — flexibility builds goodwill and reduces burnout.
              </li>
              <li>
                <strong>Promote Team Bonding:</strong><br>
                Create space for informal chats, virtual coffee breaks, or team games to build relationships.
              </li>
              <li>
                <strong>Celebrate Successes:</strong><br>
                Recognize achievements publicly to boost morale and reinforce a sense of shared purpose.
              </li>
              <li>
                <strong>Encourage Collaboration:</strong><br>
                Use shared documents, project boards, and brainstorming tools to promote teamwork over silos.
              </li>
              <li>
                <strong>Provide Opportunities for Growth:</strong><br>
                Invest in training, mentorship, and upskilling to keep your team motivated and engaged.
              </li>
              <li>
                <strong>Lead by Example:</strong><br>
                Demonstrate empathy, accountability, and commitment — your team will follow your lead.
              </li>
            </ol>
            <p>Virtual teamwork takes intention and effort, but with the right approach, remote teams can be just as cohesive, productive, and connected as those in the same room.</p>
        `,
        image: {
            url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600&q=80',
        },
        author: {
            avatarUrl: 'https://img-c.udemycdn.com/user/75x75/171403284_682c.jpg',
            name: 'Babak',
        },
        publishedDate: lastWeek,
    },
];

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// GET /posts – return all posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// GET /posts/:id – return all posts
app.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id.toString() === id);

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
});

// POST /posts – create a new post
app.post('/posts', upload.single('image'), (req, res) => {
    const { title, description } = req.body;
    const image = req.file;

    if (!title || !description || !image) {
        return res.status(400).json({ message: 'Title, description, and image are required.' });
    }

    const newPost = {
        id: posts.length + 1,
        title,
        description,
        image: {
            originalname: image.originalname,
            mimetype: image.mimetype,
            size: image.size,
            buffer: image.path,
            url: BASE_URL + `/uploads/${image.filename}`,
        },
        createdAt: new Date(),
    };

    posts.push(newPost);
    res.status(201).json(newPost);
});

// PATCH /posts/:id – edit a post
app.patch('/posts/:id', upload.single('image'), (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const { title, description } = req.body;
    const image = req.file;

    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const post = posts[postIndex];

    // Update title/description if provided
    if (title) post.title = title;
    if (description) post.description = description;

    // If a new image is uploaded, update it
    if (image) {
        // Optionally delete the old image file
        const oldImagePath = post.image?.buffer;
        if (oldImagePath && fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Delete the old image file
        }

        post.image = {
            originalname: image.originalname,
            mimetype: image.mimetype,
            size: image.size,
            buffer: image.path,
            url: `${BASE_URL}/uploads/${image.filename}`,
        };
    }

    post.updatedAt = new Date();

    res.json(post);
});

// DELETE /posts/:id – Delete a post
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);

    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const post = posts[postIndex];

    // Delete the associated image file from disk if it exists
    const imagePath = post.image?.buffer; // 'buffer' was used as image.path
    if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }

    // Remove the post from the array
    posts.splice(postIndex, 1);

    res.json({ message: 'Post deleted successfully' });
});

// POST route to receive file
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(200).json({
        message: 'Upload successful',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
