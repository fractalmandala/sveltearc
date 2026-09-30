import { error } from '@sveltejs/kit';
import { getGuide } from '$site/guides';
import type { PageLoad } from './$types';

/** Unknown guide slugs are a true 404, matching the components route. */
export const load: PageLoad = ({ params }) => {
	if (!getGuide(params.slug)) {
		error(404, `No guide named ${params.slug}`);
	}
	return {};
};
