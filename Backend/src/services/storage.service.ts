import fs from 'fs';
import path from 'path';
import { logger } from '../config/logger';

const UPLOAD_DIR = './uploads/certificates';

export const storageService = {
  /**
   * Deletes a local file based on its URL
   * @param fileUrl The static URL of the file (e.g. http://localhost:5000/uploads/certificates/filename.pdf)
   */
  deleteFile: async (fileUrl: string): Promise<boolean> => {
    try {
      if (!fileUrl) return false;
      const filename = path.basename(fileUrl);
      const filePath = path.join(UPLOAD_DIR, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`Successfully deleted file from storage: ${filePath}`);
        return true;
      }
      logger.warn(`File not found on disk during deletion: ${filePath}`);
      return false;
    } catch (err: any) {
      logger.error(`Error deleting file from storage: ${err.message}`);
      return false;
    }
  },

  /**
   * Formats the local filename into a public static URL
   * @param filename The local filename
   */
  getFileUrl: (filename: string): string => {
    // Standard URL served statically by express
    return `/uploads/certificates/${filename}`;
  },
};
