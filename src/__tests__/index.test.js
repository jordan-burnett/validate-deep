import validateDeep, { hasErrors } from '../index';

function fail(value, context){
    return 'input is invalid'
}

function pass(value, context){
    return false;
}

test('can validate single value', () => {
    const validators = [fail, pass, fail, fail];
    const errors = validateDeep('foo', validators);
    expect(errors.length).toBe(3);
});

test('can validate object', () => {
    const input = {
        foo: 'bar',
        bar: 'foo',
    };
    const validation = {
        foo: [pass, fail],
        bar: [fail, pass]
    }
    const { valid, errors } = validateObj(input, validation);
    expect(valid).toBe(false);
    expect(errors.foo.length).toBe(1);
    expect(errors.bar.length).toBe(1);
});

test('can validate nested object', () => {
    const input = {
        foo: 'bar',
        bar: {
            one: 'two',
            three: 'four'
        }
    };
    const validation = {
        foo: [pass, fail],
        bar: {
            one: [fail, pass],
            two: [pass, pass]
        }
    }
    const { valid, errors } = validateObj(input, validation);
    expect(valid).toBe(false);
    expect(errors.foo.length).toBe(1);
    expect(errors.bar.one.length).toBe(1);
    expect(errors.bar.two).toBe(null);
});