import fetch from 'unfetch';

const createHeaders = ({ token }) => ({
    'Authorization': `token ${token}`,
});

export async function fetchServiceDescriptionAPI({url, token}) {
    try {
        let serviceDescription = undefined;
        serviceDescription = await getStaticJsonContent(url);
        
        if (!serviceDescription) {
            serviceDescription = await getGithubContent({url, token});
        }

        return serviceDescription;
    } catch (error) {
        console.error('fetchServiceDescriptionAPI', error);
        throw new Error('Cannot fetch service description');
    }
}

async function getStaticJsonContent(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        return undefined;
    }
}

async function getGithubContent({url, token}) {
    try {
        const urlObj = new URL(url);
        const pathnameArray = urlObj.pathname.split('/');
        const repo = `${pathnameArray[1]}/${pathnameArray[2]}`;
        const path = `${urlObj.pathname.split('/').slice(5).join('/')}`
        const contentUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
        const response = await fetch(contentUrl, { headers: createHeaders({ token }) });
        
        if (response.ok) {
            const data = await response.json();
            const serviceDescription = JSON.parse(atob(data.content));
            return serviceDescription;
        }
    } catch (err) {
        throw err;
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