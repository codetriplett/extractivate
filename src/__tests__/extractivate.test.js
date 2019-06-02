import extractivate from '../extractivate';

describe('extractivate', () => {
	let container;
	let element;

	beforeEach(() => {
		container = document.createElement('div');

		container.innerHTML = `<span
				class="child alpha"
				data-attribute="value"
				data-flag>Lorem Ipsum</span><span
				class="child beta"
				data-attribute="value"
				data-flag>Dolor Sit</span>`;

		element = container.querySelector('span');
	});

	it('should extract content', () => {
		const extractor = extractivate();
		const actual = extractor(element);

		expect(actual).toBe('Lorem Ipsum');
	});

	it('should extract attribute', () => {
		const extractor = extractivate('data-attribute');
		const actual = extractor(element);

		expect(actual).toBe('value');
	});

	it('should extract missing attribute', () => {
		const extractor = extractivate('data-other');
		const actual = extractor(element);

		expect(actual).toBe('');
	});

	it('should extract flag', () => {
		const extractor = extractivate('data-flag').asBoolean;
		const actual = extractor(element);

		expect(actual).toBe(true);
	});

	it('should extract missing flag', () => {
		const extractor = extractivate('data-other').asBoolean;
		const actual = extractor(element);

		expect(actual).toBe(false);
	});

	it('should extract class', () => {
		const extractor = extractivate('.child', 'class');
		const actual = extractor(container);

		expect(actual).toBe('alpha');
	});

	it('should extract from child', () => {
		const extractor = extractivate('.child');
		const actual = extractor(container);

		expect(actual).toBe('Lorem Ipsum');
	});

	it('should extract from children', () => {
		const extractor = extractivate('span.').asArray;
		const actual = extractor(container);

		expect(actual).toEqual(['Lorem Ipsum', 'Dolor Sit']);
	});

	it('should extract and transform', () => {
		const transform = jest.fn().mockImplementation(value => `${value}.`);
		const extractor = extractivate('span.', transform).asArray;
		const actual = extractor(container);

		expect(transform.mock.calls).toEqual([
			['Lorem Ipsum', element],
			['Dolor Sit', container.querySelector('span:nth-child(2)')],
		]);

		expect(actual).toEqual(['Lorem Ipsum.', 'Dolor Sit.']);
	});

	it('should extract and resolve', () => {
		const resolve = jest.fn().mockImplementation(value => `${value}.`);
		const extractor = extractivate('span.');
		const actual = extractor(container, resolve);

		expect(resolve.mock.calls).toEqual([
			['Lorem Ipsum', element],
			['Dolor Sit', container.querySelector('span:nth-child(2)')],
		]);

		expect(actual).toEqual(['Lorem Ipsum.', 'Dolor Sit.']);
	});
});
