export const OWNER_EMAILS = [
  'aiden.marcus805@gmail.com',
  'aidenmarcus805@gmail.com'
];

export const OWNER_DATA_CONNECTED = false;

export const OWNER_SOURCE_LABEL = 'No source connected';

export const isOwnerEmail = (email?: string | null) => {
  if (!email) return false;
  return OWNER_EMAILS.includes(email);
};
