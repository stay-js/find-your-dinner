import 'dotenv/config';

import { db } from '~/server/db';
import { admins } from '~/server/db/schema';

const data = [
  // clerk dev environment
  { userId: 'user_38bzMM6AVsxkk7dJNc7n4GLSkDm' }, // znagy
  { userId: 'user_3CCx7CfdpF5IWcdjVb0DmpUppw5' }, // ppanna
  { userId: 'user_3CG6nCYzPeHOgYIZg6oajghAz5e' }, // zsepy

  // clerk prod environment
  { userId: 'user_3CPCdO9xP7lG2xuj7xsd466sLdd' }, // znagy
  { userId: 'user_3CPE4WILkIU2vrqElJNKDPZ2GsH' }, // ppanna
  { userId: 'user_3CQ7B3EpNA02PTL6nI7OmCsrEMA' }, // zsepy
] satisfies (typeof admins.$inferInsert)[];

export async function seedAdmins() {
  console.log('⏳ Seeding admins...');
  await db.insert(admins).values(data);
  console.log('✅ Admins seeded.');
}
