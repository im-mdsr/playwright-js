// Shapes verified against the live API (see DISCOVERY_FINDINGS.md). Extra fields are allowed.
const categorySchema = {
  type: 'object',
  required: ['id', 'name', 'slug', 'parent_id'],
  properties: {
    id: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1 },
    slug: { type: 'string', minLength: 1 },
    parent_id: { type: ['string', 'null'] },
  },
};

const brandSchema = {
  type: 'object',
  required: ['id', 'name', 'slug'],
  properties: {
    id: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1 },
    slug: { type: 'string', minLength: 1 },
  },
};

module.exports = { categorySchema, brandSchema };
