import { hash } from 'bcryptjs';
import mongoose from 'mongoose';
import Base from './models/Base.js';
import User from './models/User.js'; // ensures discriminators are registered

// If you later add: const Admin = Base.discriminator('admin', new mongoose.Schema({ username: { type: String, required: true } }));
// this code will automatically use it.
export async function createAdminUser() {
  try {
    console.log('👑 Ensuring admin exists...');

    // 1) Check if an admin already exists (by role/email)
    const existing = await Base.findOne({
      $or: [{ role: 'admin' }, { email: 'chawsuhan1258@gmail.com' }]
    }).lean();

    if (existing) {
      console.log(`⚠️ Admin already exists (role: ${existing.role || 'n/a'}, email: ${existing.email})`);
      return;
    }

    const hashed = await hash('admin123', 10);

    // 2) Prefer an Admin discriminator if defined; otherwise fall back to Base
    //    Mongoose exposes discriminators on Base.discriminators if they were registered.
    const AdminModel = Base.discriminators?.admin;

    if (AdminModel) {
      // ✅ Best path: Admin has username (since Admin schema can define it)
      await new AdminModel({
        email: 'chawsuhan1258@gmail.com',
        password: hashed,
        username: 'admin',  // requires Admin schema to define this
        // role will be set to 'admin' automatically by the discriminator
      }).save();
      console.log('🎉 Admin (with username) created via Admin discriminator');
    } else {
      // ⚠️ Fallback: Base doesn’t have `username`, so it will be admin with only email/password
      await new Base({
        email: 'chawsuhan1258@gmail.com',
        password: hashed,
        role: 'admin', // discriminatorKey field is allowed on Base
      }).save();
      console.log('🎉 Admin created via Base (no username field on Base)');
    }

    console.log('📧 email: chawsuhan1258@gmail.com\n🔐 password: admin123\n🧩 role: admin');
  } catch (err) {
    console.error('❌ Failed to create admin:', err);
  }
}
