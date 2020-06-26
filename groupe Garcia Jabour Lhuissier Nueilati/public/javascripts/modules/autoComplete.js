import axios from 'axios';

import dompurify from 'dompurify';

function searchResultsHTML(article) {
	return article
		.map((article) => {
			return `
			<a href="/article${article.slug}" class="search_result">
			<strong>${article.name} ${article.console}</strong>
			</a>
			`;
		})
		.join('');
}

function autocomplete(search) {
	if (!search) return;
	const searchInput = search.querySelector('input[name="search"]');
	const searchResults = search.querySelector('.search_results');
	searchInput.addEventListener('input', function () {
		if (!this.value) {
			searchResults.style.display = 'none';
			return;
		}
		searchResults.style.display = 'block';

		axios
			.get(`/api/search?q=${this.value}`)
			.then((res) => {
				if (res.data.length) {
					const html = searchResultsHTML(res.data);
					searchResults.innerHTML = html;
					return;
				}
				searchResults.innerHTML = `<div class="search_result">Aucun resultat pour ${this.value}</div>`;
			})
			.catch((err) => {
				console.error(err);
			});
	});
}
export default autocomplete;