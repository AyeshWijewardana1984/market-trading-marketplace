/**
 * @desc    Upload single or multiple image assets for products/banners
 * @route   POST /api/upload
 * @access  Private/Admin
 */
export const uploadImage = (req, res) => {
  try {
    if (!req.file && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    // If multiple files uploaded
    if (req.files && req.files.length > 0) {
      const urls = req.files.map((file) => file.path || `/uploads/${file.filename}`);
      return res.json({
        success: true,
        message: 'Images uploaded successfully',
        urls,
      });
    }

    // Single file uploaded
    const imageUrl = req.file.path || `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
