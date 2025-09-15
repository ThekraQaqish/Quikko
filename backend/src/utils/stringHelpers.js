// src/utils/stringHelpers.js
function generateSlug(storeName) {
  return storeName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')  // استبدل الفراغات وكل الرموز بـ "-"
    .replace(/^-+|-+$/g, '');     // احذف "-" من البداية والنهاية
}

module.exports = { generateSlug };
