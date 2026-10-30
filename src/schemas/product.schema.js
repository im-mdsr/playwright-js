// Shape verified against the live API (see DISCOVERY_FINDINGS.md). Extra fields are allowed so a
// harmless API addition does not break the suite; missing or mistyped fields do.
const productSchema = {
  type: 'object',
  required: [
    'id',
    'name',
    'description',
    'price',
    'is_location_offer',
    'is_rental',
    'co2_rating',
    'in_stock',
    'is_eco_friendly',
    'product_image',
    'category',
    'brand',
  ],
  properties: {
    id: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    price: { type: 'number', exclusiveMinimum: 0 },
    is_location_offer: { type: 'boolean' },
    is_rental: { type: 'boolean' },
    co2_rating: { type: 'string' },
    in_stock: { type: 'boolean' },
    is_eco_friendly: { type: 'boolean' },
    product_image: {
      type: 'object',
      required: ['file_name'],
      properties: { file_name: { type: 'string', minLength: 1 } },
    },
    category: {
      type: 'object',
      required: ['id', 'name', 'slug'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        slug: { type: 'string' },
      },
    },
    brand: {
      type: 'object',
      required: ['id', 'name'],
      properties: { id: { type: 'string' }, name: { type: 'string' } },
    },
  },
};

const paginationFields = ['current_page', 'data', 'from', 'last_page', 'per_page', 'to', 'total'];

module.exports = { productSchema, paginationFields };
