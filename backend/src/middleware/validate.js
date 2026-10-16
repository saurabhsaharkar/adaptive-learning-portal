/**
 * Lightweight request validation helpers.
 * Used by routes before calling services.
 */
export function requireBody(res, body) {
  if (!body || Object.keys(body).length === 0) {
    res.status(400).json({ error: 'Request body is required' });
    return false;
  }
  return true;
}

export function requireFields(res, body, fields) {
  const missing = fields.filter((f) => body[f] === undefined || body[f] === null || body[f] === '');
  if (missing.length > 0) {
    res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    return false;
  }
  return true;
}

export function isUUID(value) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

export function validateUUID(res, value, paramName = 'id') {
  if (!value || !isUUID(value)) {
    res.status(400).json({ error: `Invalid ${paramName}` });
    return false;
  }
  return true;
}