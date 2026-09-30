import { error } from '@sveltejs/kit';
import { getDoc } from '$site/registry';
import type { PageLoad } from './$types';

/** Unknown component slugs are a true 404, matching the docs route. */
export const load: PageLoad = ({ params }) => {
	if (!getDoc(params.name)) {
		error(404, `No component documented for ${params.name}`);
	}
	return {};
};
