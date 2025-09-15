const pool = require('../../config/db');
const admin = require('../../infrastructure/firebase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { insertUser, insertCustomer, insertVendor, insertDelivery } = require('../../modules/user/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.register = async (data, role) => {
  let firebaseUser;

  // ✅ إذا جاي من الـ frontend بtoken جاهز (المستخدم أصلاً معمول على Firebase)
  if (data.firebaseToken) {
    firebaseUser = await admin.auth().verifyIdToken(data.firebaseToken);
    data.email = firebaseUser.email || data.email;
    data.phone = firebaseUser.phone_number || data.phone;
  } else {
    // ✅ إذا جديد → ننشئه على Firebase
    firebaseUser = await admin.auth().createUser({
      email: data.email,
      password: data.password, // لازم يكون موجود بالـ request
      phoneNumber: data.phone || undefined,
      displayName: data.name,
    });
  }

  // 🔑 هاش لكلمة السر عشان نخزنها بالـ Postgres
  let passwordHash = null;
  if (data.password) {
    passwordHash = await bcrypt.hash(data.password, 10);
  }

  // 🗄️ إضافة بيانات عامة بجدول users
  const user = await insertUser({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password_hash: passwordHash,
    role,
    address: data.address || null,
  });

  // 🗄️ إضافة بيانات خاصة حسب الدور
  if (role === 'customer') {
    await insertCustomer({ user_id: user.id });
  } else if (role === 'vendor') {
    await insertVendor({
      user_id: user.id,
      store_name: data.store_name || null,
      description: data.description || null,
    });
  } else if (role === 'delivery') {
    await insertDelivery({
      user_id: user.id,
      company_name: data.company_name || null,
    });
  }

  // ✅ رجّع المستخدمين الاثنين (Firebase + Postgres)
  return { postgresUser: user, firebaseUser };
};

exports.login = async ({ email, password }) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = rows[0];

  if (!user) {
    const err = new Error('User not found');
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  // ✅ Approval check للـ vendor و delivery
  if (user.role === 'vendor' || user.role === 'delivery') {
    const table = user.role === 'vendor' ? 'vendors' : 'delivery_companies';
    const { rows: statusRows } = await pool.query(
      `SELECT status FROM ${table} WHERE user_id=$1`,
      [user.id]
    );

    if (!statusRows[0]) {
      const err = new Error('Your vendor/delivery record not found.');
      err.code = 'NOT_FOUND_RECORD';
      throw err;
    }

    if (statusRows[0].status !== 'approved') {
      const err = new Error('Your account is not approved yet by admin.');
      err.code = 'NOT_APPROVED';
      throw err;
    }
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  return token;
};