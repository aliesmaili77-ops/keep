import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { to, circleName, inviteLink, inviterName } = body;
    if (!to || !inviteLink) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const subject = circleName
      ? inviterName + ' invited you to join ' + circleName + ' on Keep'
      : inviterName + ' invited you to join them on Keep';

    const emailBody = circleName
      ? [
          'Hi,',
          '',
          inviterName + ' invited you to join "' + circleName + '" on Keep — a private space for your closest people to preserve the inside jokes, meaningful quotes, and shared stories that group chats always forget.',
          '',
          'Tap here to join: ' + inviteLink,
          '',
          'Keep'
        ].join('\n')
      : [
          'Hi,',
          '',
          inviterName + ' invited you to join them on Keep — a private space for your closest people to preserve the inside jokes, meaningful quotes, and shared stories that group chats always forget.',
          '',
          'Tap here to connect: ' + inviteLink,
          '',
          'Keep'
        ].join('\n');

    await base44.asServiceRole.integrations.Core.SendEmail({
      to,
      subject,
      body: emailBody,
      from_name: 'Keep'
    });

    return Response.json({ sent: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}