import { Request, Response } from 'express';
import { supabase, BUCKET_NAME } from '../config/supabase';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded.' });
      return;
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    if (supabase) {
      // Stream buffer directly to Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        res.status(500).json({ error: `Supabase upload failed: ${error.message}` });
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      res.status(200).json({
        url: publicUrlData.publicUrl,
        filePath,
        message: 'Image uploaded successfully to Supabase Storage',
      });
      return;
    }

    // Fallback mode if Supabase credentials are not connected:
    // Convert to standard base64 data URI for zero-config local prototyping
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    res.status(200).json({
      url: base64Image,
      filePath,
      message: 'Image uploaded in offline/fallback mode (memory buffer)',
    });
  } catch (err: any) {
    console.error('Upload controller error:', err);
    res.status(500).json({ error: err.message || 'Server error during upload.' });
  }
};
