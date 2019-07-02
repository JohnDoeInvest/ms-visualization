import fetch from 'unfetch';

const GITHUB_TOKEN = '7d654565e18e027f023514dc0f8fd2e6308edbda';
const AUTHORIZATION_HEADER = `token ${GITHUB_TOKEN}`;

const createHeaders = ({ token }) => ({
    'Authorization': `token ${token}`,
    // 'Access-Control-Expose-Headers': 'ETag, Link, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
    // 'Access-Control-Max-Age': 86400,
    // 'Access-Control-Allow-Headers': 'Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since, Accept-Encoding, X-GitHub-OTP, X-Requested-With, User-Agent',
    // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE',
    // 'Access-Control-Allow-Origin': '*'
})

export async function fetchServiceDescriptionAPI(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        throw new Error('Cannot fetch service description');
    } catch (error) {
        console.error('fetchServiceDescriptionAPI', error);
        throw new Error('Cannot fetch service description');
    }
}

export async function searchServiceDescriptionAPI({ repo, token }) {
    try {
        const url = `https://api.github.com/search/code?q=name+filename:serviceDescription+extension:json+repo:${repo}`;
        const response = await fetch(url, {
            headers: createHeaders({ token })
        });
        if (response.ok) {
            const data = await response.json();
            return data.items;
        }
        return [];
    } catch (error) {
        console.error('searchServiceDescriptionAPI', error);
        throw new Error('Cannot search service description');
    }
}
export async function loaddAllCodeContentsAPI({codes, token}) {
    try {
        let responses = await Promise.all(codes.map(async (code) => {
            const { path, repository: { full_name }} = code;
            const url = `https://api.github.com/repos/${full_name}/contents/${path}`;
            return fetch(url, {
                headers: createHeaders({ token })
            });
        }));

        responses = await Promise.all(responses.filter(res => res.ok).map(async (res) => res.json()));
        const contents = responses.map(res => res.content);
        const serviceDescriptions = contents.map(content => JSON.parse(atob(content)));
        return serviceDescriptions;
    } catch (error) {
        console.error('loaddAllCodeContentsAPI', error);
        throw new Error('Cannot load code contents');
    }
}