import isPlainObject from 'lodash.isplainobject'

/**
 * Check a value against a function, or array of validation functions.  Returns
 * an array of any returned errors. An optional context object can be passed to
 * pass additional information to the validation functions.
 * @param  {Any} value
 * @param  {Array|Function} validators 
 * @param  {Object} context
 * @return {Array|Null}
 */
export function getErrors(value, validators, context){
  if(!Array.isArray(validators)) {
    validators = [validators];
  }
  let errors = validators.map(validator => validator(value, context));
  errors = errors.filter(error => error); // Filter out empty errors
  return errors.length ? errors : null;
}

/**
 * Recursively validates an object and it's values against a set of rules.
 * Returns an object with signature <valid, errors>
 * 
 * @param  {Object} values     
 * @param  {Object} rules      
 * @param  {Object} rootValues 
 * @return {Object}
 */
function validate(values, rules, rootValues){
  rootValues = rootValues || values;
  const output = {
    valid: true,
    errors: {}
  }
  for(let fieldName in rules){
    const validators = rules[fieldName];
    const value = values[fieldName];
    let errors = [];
    // Values and validators can be deeply nested
    if(isPlainObject(value)){
      if(!isPlainObject(validators)) {
        throw new Error(`Structure of rules object differs from values at '${fieldName}'`)
      }
      let output = validate(value, validators, rootValues);
      errors = output.errors;
    } else {
      const context = { fieldName, values: rootValues };
      errors = getErrors(value, validators, context)
    }
    if(errors) {
      output.valid = false;
      output.errors[fieldName] = errors;
    }
  }
  return output;
}

export default validate