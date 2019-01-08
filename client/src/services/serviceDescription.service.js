import fetch from 'unfetch';

const GITHUB_TOKEN = 'deec35fbe282c5ba5053958d2ded8ac1d191491d';
const AUTHORIZATION_HEADER = `token ${GITHUB_TOKEN}`;
const defaultHeaders = {
    'Authorization': AUTHORIZATION_HEADER
}

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

export async function searchServiceDescriptionAPI(repo) {
    try {
        const url = `https://api.github.com/search/code?q=name+filename:serviceDescription+extension:json+repo:${repo}`;
        const response = await fetch(url, {
            headers: {...defaultHeaders}
        });
        if (response.ok) {
            const data = await response.json();
            console.log('data', data);
            return data.items;
        }
        return [];
    } catch (error) {
        console.error('searchServiceDescriptionAPI', error);
        throw new Error('Cannot search service description');
    }
}
export async function loaddAllCodeContentsAPI(codes) {
    try {
        let responses = await Promise.all(codes.map(async (code) => {
            const { path, repository: { full_name }} = code;
            const url = `https://api.github.com/repos/${full_name}/contents/${path}`;
            return fetch(url, {
                headers: {...defaultHeaders}
            });
        }));

        responses = await Promise.all(responses.filter(res => res.ok).map(async (res) => res.json()));
        const downloadURLs = responses.map(res => res.download_url);
        let fetchServiceDescriptions = await Promise.all(downloadURLs.map(async (url) => fetchServiceDescriptionAPI(url)));

        return fetchServiceDescriptions;
    } catch (error) {
        console.error('loaddAllCodeContentsAPI', error);
        throw new Error('Cannot load code contents');
    }
}