const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { get, run, all } = require('../db');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', '..', 'data', 'bibelpose');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created bibelpose upload directory:', uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'));
    }
  },
});

// Upload photo
router.post('/upload', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📸 File uploaded:', {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    const { teamId, sceneId, sceneName } = req.body;

    if (!teamId || !sceneId || !sceneName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get team info
    const team = get('SELECT * FROM teams WHERE id = ?', [teamId]);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Create submission record
    const submissionId = uuidv4();
    const photoPath = `bibelpose/${req.file.filename}`;
    const now = Math.floor(Date.now() / 1000);

    run(
      `INSERT INTO bibelpose_submissions 
       (id, team_id, team_name, scene_id, scene_name, photo_path, status, submitted_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [submissionId, teamId, team.name, sceneId, sceneName, photoPath, 'pending', now]
    );

    console.log('✅ Submission created:', { submissionId, photoPath });

    res.json({
      success: true,
      submissionId,
      message: 'Photo uploaded successfully. Waiting for admin confirmation.',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// Error handler for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.error('Multer error:', error);
    return res.status(400).json({ error: `Upload error: ${error.message}` });
  } else if (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
  next();
});

// Get all pending submissions (for admin)
router.get('/submissions/pending', (req, res) => {
  try {
    const submissions = all(
      `SELECT * FROM bibelpose_submissions WHERE status = 'pending' ORDER BY submitted_at DESC`
    );
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get all submissions (for admin)
router.get('/submissions', (req, res) => {
  try {
    const submissions = all(
      `SELECT * FROM bibelpose_submissions ORDER BY submitted_at DESC`
    );
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Confirm submission (admin)
router.post('/submissions/:id/confirm', (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const submission = get('SELECT * FROM bibelpose_submissions WHERE id = ?', [id]);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const now = Math.floor(Date.now() / 1000);
    run(
      `UPDATE bibelpose_submissions SET status = ?, code = ?, confirmed_at = ? WHERE id = ?`,
      ['confirmed', code, now, id]
    );

    res.json({ success: true, message: 'Submission confirmed' });
  } catch (error) {
    console.error('Error confirming submission:', error);
    res.status(500).json({ error: 'Failed to confirm submission' });
  }
});

// Reject submission (admin)
router.post('/submissions/:id/reject', (req, res) => {
  try {
    const { id } = req.params;

    const submission = get('SELECT * FROM bibelpose_submissions WHERE id = ?', [id]);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Delete photo file
    const photoPath = path.join(__dirname, '..', '..', submission.photo_path);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }

    run(`DELETE FROM bibelpose_submissions WHERE id = ?`, [id]);

    res.json({ success: true, message: 'Submission rejected and deleted' });
  } catch (error) {
    console.error('Error rejecting submission:', error);
    res.status(500).json({ error: 'Failed to reject submission' });
  }
});

// Get submission status (for team)
router.get('/submissions/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const submission = get('SELECT * FROM bibelpose_submissions WHERE id = ?', [id]);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({
      status: submission.status,
      code: submission.code,
      message:
        submission.status === 'confirmed'
          ? `Your code is: ${submission.code}`
          : 'Waiting for admin confirmation',
    });
  } catch (error) {
    console.error('Error fetching submission status:', error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

module.exports = router;
