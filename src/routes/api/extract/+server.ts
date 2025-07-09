import { Readability } from '@mozilla/readability';
import { json } from '@sveltejs/kit';
import { JSDOM } from 'jsdom';

export const POST = async ({ request }) => {
	const { url } = await request.json();

	if (!url) {
		return json({ error: 'Missing URL' }, { status: 400 });
	}

	try {
		const response = await fetch(url);
		const html = await response.text();

		const dom = new JSDOM(html, { url });
		const reader = new Readability(dom.window.document);
		const article = reader.parse();

		if (!article) {
			return json({ error: 'Failed to parse article' }, { status: 422 });
		}

		return json({ status: 'saved', article });
	} catch (err) {
		console.error(err);
		return json({ error: 'Unexpected error' }, { status: 500 });
	}
};
