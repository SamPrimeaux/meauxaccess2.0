// Scheduled Worker for Southern Pets Trashbin Cleanup
// Runs daily to permanently delete expired items (14+ days old)

import { handleTrashbinCleanup } from './southernpets-gallery-api';

export interface Env {
  DB?: D1Database;
  SOUTHERNPETS_DB?: D1Database;
  R2_TRASHBIN_SOUTHERNPETS?: R2Bucket;
}

export default {
  // Scheduled event handler (cron trigger)
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Starting trashbin cleanup for southernpetsanimalrescue...');

    try {
      await handleTrashbinCleanup(env);
      console.log('Trashbin cleanup completed successfully');
    } catch (error: any) {
      console.error('Error during trashbin cleanup:', error);
      // Don't throw - allow scheduled event to complete
    }
  },

  // HTTP handler for manual trigger (optional)
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/cleanup' && request.method === 'POST') {
      try {
        await handleTrashbinCleanup(env);
        return new Response(JSON.stringify({
          success: true,
          message: 'Trashbin cleanup completed',
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message,
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
