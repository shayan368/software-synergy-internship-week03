const cache = new Map();

const getCache = (key) => {
  const cachedItem = cache.get(key);

  if (!cachedItem) {
    return null;
  }

  if (Date.now() > cachedItem.expiresAt) {
    cache.delete(key);
    return null;
  }

  return cachedItem.value;
};

const setCache = (key, value, ttl = 60000) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl
  });
};

const deleteCache = (key) => {
  cache.delete(key);
};

const clearCache = () => {
  cache.clear();
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
  clearCache
};