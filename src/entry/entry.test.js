import obj from './entry.js';
describe('test', () => {
	it('works', () => {
		expect(obj.a).toEqual(1);
		expect(obj.b?.c).toEqual(123);
		expect(obj.b?.d).toEqual(undefined);
	});
});