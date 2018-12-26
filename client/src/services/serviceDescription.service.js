import fetch from 'unfetch';

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

export async function searchServiceDescriptionAPI(text) {
    try {
        const url = `https://api.github.com/search/code?q=name+filename:${text}+extension:json+repo:lamdoann/serviceDescriptions`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.items;
        }
        throw new Error('Cannot search service description');
    } catch (error) {
        console.error('searchServiceDescriptionAPI', error);
        throw new Error('Cannot search service description');
    }
}