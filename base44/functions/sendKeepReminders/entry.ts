import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    // List all users (service role — this is a system-scheduled task)
    const users = await base44.asServiceRole.entities.User.list();

    let created = 0;
    for (const user of users) {
      const prefs = user.notification_prefs || {};
      // Skip users who've disabled keep reminders
      if (prefs.keep_reminders === false) continue;

      await base44.asServiceRole.entities.Notification.create({
        recipient_id: user.id,
        actor_user_id: user.id,
        actor_name: 'Keep',
        type: 'keep_reminder',
        title: 'Time to keep a moment',
        body: 'Preserve a memory, quote, or voice note with your closest people.',
        cta_label: 'Add a Keep',
        cta_route: '/create',
        read: false
      });
      created++;
    }

    return Response.json({ sent: created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}