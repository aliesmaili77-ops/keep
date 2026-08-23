import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { keep_id, interaction_type } = body;
    if (!keep_id || !interaction_type) {
      return Response.json({ error: 'keep_id and interaction_type required' }, { status: 400 });
    }

    const keep = await base44.asServiceRole.entities.Keep.get(keep_id).catch(() => null);
    if (!keep) return Response.json({ skipped: true, reason: 'keep not found' });

    const creatorId = keep.created_by_id;
    // Don't notify yourself
    if (creatorId === user.id) return Response.json({ skipped: true, reason: 'own keep' });

    // Respect the creator's notification preferences
    const creator = await base44.asServiceRole.entities.User.get(creatorId).catch(() => null);
    const prefs = creator?.notification_prefs || {};
    if (prefs.reactions_comments === false) {
      return Response.json({ skipped: true, reason: 'notifications disabled' });
    }

    const actorName = user.full_name || (user.email ? user.email.split('@')[0] : 'Someone');
    const keepRoute = '/keep/' + keep_id;

    if (interaction_type === 'comment') {
      await base44.asServiceRole.entities.Notification.create({
        recipient_id: creatorId,
        actor_user_id: user.id,
        actor_name: actorName,
        type: 'comment_added',
        title: actorName + ' commented on your Keep',
        body: 'Tap to see what they said.',
        cta_label: 'View Keep',
        cta_route: keepRoute,
        read: false
      });
    } else if (interaction_type === 'reaction') {
      await base44.asServiceRole.entities.Notification.create({
        recipient_id: creatorId,
        actor_user_id: user.id,
        actor_name: actorName,
        type: 'reaction_added',
        title: actorName + ' reacted to your Keep',
        body: 'Someone appreciated your moment.',
        cta_label: 'View Keep',
        cta_route: keepRoute,
        read: false
      });
    }

    return Response.json({ sent: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}