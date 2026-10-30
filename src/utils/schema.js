const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

/** Validates `data` against a JSON schema and returns a readable list of problems (empty if valid). */
function schemaErrors(schema, data) {
  const validate = ajv.compile(schema);
  if (validate(data)) return [];
  return validate.errors.map((e) => `${e.instancePath || '(root)'} ${e.message}`);
}

module.exports = { schemaErrors };
