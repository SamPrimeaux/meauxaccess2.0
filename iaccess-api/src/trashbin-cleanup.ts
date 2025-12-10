/**
 * Trash Bin Cleanup Worker
 * Permanently deletes photos from trash bin after 14 days
 * Run as scheduled worker (cron)
 */

export async function cleanupTrashBin(env: any) {
  const db = env.DB || env.SAAS_DB;
  const trashBucket = env.R2_TRASH as R2Bucket;

  if (!db) {
    console.error('Database not configured');
    return;
  }

  try {
    // Get all expired photos
    const expiredPhotos = await db.prepare(
      `SELECT * FROM trashbin WHERE expiresAt < datetime('now')`
    ).all();

    if (!expiredPhotos.results || expiredPhotos.results.length === 0) {
      console.log('No expired photos to clean up');
      return { cleaned: 0 };
    }

    let cleaned = 0;

    for (const photo of expiredPhotos.results) {
      try {
        // Delete from R2 trash bin
        if (trashBucket && photo.url) {
          const fileName = photo.url.split('/').pop() || `${photo.originalId}.jpg`;
          await trashBucket.delete(`deleted/${photo.originalId}/${fileName}`);
        }

        // Delete from database
        await db.prepare('DELETE FROM trashbin WHERE id = ?').bind(photo.id).run();
        cleaned++;
      } catch (error) {
        console.error(`Error cleaning up photo ${photo.id}:`, error);
      }
    }

    console.log(`Cleaned up ${cleaned} expired photos from trash bin`);
    return { cleaned };
  } catch (error: any) {
    console.error('Error cleaning up trash bin:', error);
    return { error: error.message };
  }
}
