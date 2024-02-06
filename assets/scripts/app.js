const postsList = document.querySelector('.posts');
const postTemplate = document.getElementById('post-template');
const fetchBtn = document.querySelector('#available-posts button');
const form = document.querySelector('#new-post form');

function sendHttpRequest(method, url, data) {
	const promise = new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		xhr.open(method, url);
		xhr.responseType = 'json';
		xhr.onload = () =>
			xhr.status >= 200 && xhr.status < 300
				? resolve(xhr.response)
				: reject(new Error('Something went wronf at the server side!'));
		xhr.onerror = () => reject(new Error('Failed to send request!'));
		xhr.send(JSON.stringify(data));
	});
	return promise;
}

async function fetchPosts() {
	try {
		const responseData = await sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/poss');
		for (const post of responseData) {
			const postEl = document.importNode(postTemplate.content, true);
			postEl.querySelector('h2').textContent = post.title.toUpperCase();
			postEl.querySelector('p').textContent = post.body;
			postEl.querySelector('li').id = post.id;
			postsList.append(postEl);
		}
	} catch (e) {
		alert(e.message);
	}
}

async function createPost(title, content) {
	const userId = Math.random();
	const post = {
		title: title,
		body: content,
		userId: userId,
	};
	sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
}

fetchBtn.addEventListener('click', () => {
	postsList.textContent = '';
	fetchPosts();
});

form.addEventListener('submit', e => {
	e.preventDefault();
	const titleText = e.currentTarget.querySelector('#title').value;
	const contentText = e.currentTarget.querySelector('#content').value;

	createPost(titleText, contentText);
});

postsList.addEventListener('click', e => {
	if (e.target.tagName === 'BUTTON') {
		const postId = e.target.closest('li').id;
		sendHttpRequest('DELETE', `https://jsonplaceholder.typicode.com/posts/${postId}`);
	}
});
