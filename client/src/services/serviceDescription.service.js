import fetch from 'unfetch'

const createHeaders = ({ token }) => ({
  Authorization: `token ${token}`
})

const getStaticJsonContent = async (url) => {
  try {
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    return undefined
  }
}

const getGithubContent = async ({ url, token }) => {
  try {
    const urlObj = new URL(url)
    const pathnameArray = urlObj.pathname.split('/')
    const repo = `${pathnameArray[1]}/${pathnameArray[2]}`
    const path = `${urlObj.pathname.split('/').slice(5).join('/')}`
    const contentUrl = `https://api.github.com/repos/${repo}/contents/${path}`
    const response = await fetch(contentUrl, { headers: createHeaders({ token }) })

    if (response.ok) {
      const data = await response.json()
      const serviceDescription = JSON.parse(window.atob(data.content))
      return serviceDescription
    }
  } catch (error) {
    throw new Error('Error to get github content')
  }
}

export async function fetchServiceDescriptionAPI ({ url, token }) {
  try {
    let serviceDescription
    serviceDescription = await getStaticJsonContent(url)

    if (!serviceDescription) {
      serviceDescription = await getGithubContent({ url, token })
    }

    if (serviceDescription) {
      return serviceDescription
    } else {
      throw new Error('Cannot fetch service description')
    }
  } catch (error) {
    throw new Error('Cannot fetch service description')
  }
}

export async function searchServiceDescriptionAPI ({ repo, token }) {
  try {
    const url = `https://api.github.com/search/code?q=name+filename:serviceDescription+extension:json+repo:${repo}`
    const response = await fetch(url, {
      headers: createHeaders({ token })
    })
    if (response.ok) {
      const data = await response.json()
      return data.items
    }
    return []
  } catch (error) {
    throw new Error('Cannot search service description')
  }
}
export async function loaddAllCodeContentsAPI ({ codes, token }) {
  try {
    let responses = await Promise.all(codes.map(async (code) => {
      const { path, repository: { full_name: fullName } } = code
      const url = `https://api.github.com/repos/${fullName}/contents/${path}`
      return fetch(url, {
        headers: createHeaders({ token })
      })
    }))

    responses = await Promise.all(responses.filter(res => res.ok).map(async res => res.json()))
    const contents = responses.map(res => res.content)
    const serviceDescriptions = contents.map(content => JSON.parse(window.atob(content)))
    return serviceDescriptions
  } catch (error) {
    throw new Error('Cannot load code contents')
  }
}
