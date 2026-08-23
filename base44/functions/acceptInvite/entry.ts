import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { token } = body;
    if (!token) return Response.json({ error: 'Token required' }, { status: 400 });

    // Look up invitation (service role bypasses RLS so any token-holder can join)
    const invitations = await base44.asServiceRole.entities.Invitation.filter({ invite_token: token });
    if (!invitations || invitations.length === 0) {
      return Response.json({ error: 'Invitation not found' }, { status: 404 });
    }
    const invitation = invitations[0];

    if (invitation.status !== 'pending') {
      return Response.json({ error: 'This invitation is no longer valid' }, { status: 400 });
    }

    if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
      return Response.json({ error: 'This invitation has expired' }, { status: 400 });
    }

    const circle = await base44.asServiceRole.entities.Circle.get(invitation.circle_id);
    if (!circle) {
      return Response.json({ error: 'Circle not found' }, { status: 404 });
    }

    // Already a member?
    if (circle.member_user_ids && circle.member_user_ids.includes(user.id)) {
      await base44.asServiceRole.entities.Invitation.update(invitation.id, { status: 'accepted' });
      return Response.json({ circle, alreadyMember: true });
    }

    const newMemberIds = [...(circle.member_user_ids || []), user.id];
    const adminIds = circle.admin_user_ids || [];

    // Create CircleMember
    await base44.asServiceRole.entities.CircleMember.create({
      circle_id: circle.id,
      user_id: user.id,
      display_name: user.full_name || (user.email ? user.email.split('@')[0] : 'Member'),
      role: 'member',
      membership_status: 'active',
      joined_at: new Date().toISOString(),
      circle_member_ids: newMemberIds,
      circle_admin_ids: adminIds,
    });

    // Update Circle's member list
    await base44.asServiceRole.entities.Circle.update(circle.id, { member_user_ids: newMemberIds });

    // Denormalize: add new user to circle_member_ids on all existing records
    await base44.asServiceRole.entities.CircleMember.updateMany(
      { circle_id: circle.id, membership_status: 'active' },
      { $addToSet: { circle_member_ids: user.id } }
    );
    await base44.asServiceRole.entities.Keep.updateMany(
      { circle_id: circle.id },
      { $addToSet: { circle_member_ids: user.id } }
    );
    await base44.asServiceRole.entities.Comment.updateMany(
      { circle_id: circle.id },
      { $addToSet: { circle_member_ids: user.id } }
    );
    await base44.asServiceRole.entities.Reaction.updateMany(
      { circle_id: circle.id },
      { $addToSet: { circle_member_ids: user.id } }
    );

    // Mark invitation as accepted
    await base44.asServiceRole.entities.Invitation.update(invitation.id, { status: 'accepted' });

    return Response.json({ circle, joined: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}