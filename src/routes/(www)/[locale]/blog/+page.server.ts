import { toLocale } from '$lib/i18n';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const locale = toLocale(params.locale);

	const articles = await locals.content.listArticles({
		status: 'published',
		locale,
		page: 1,
		limit: 20,
	});

	return {
		locale,
		articles,
	};
};
