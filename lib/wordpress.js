import { GraphQLClient, gql } from 'graphql-request';

const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT || '';

if (!endpoint) {
  console.warn('[WARNING] WORDPRESS_GRAPHQL_ENDPOINT is not defined in .env.local. Data fetching will fail.');
}

const client = new GraphQLClient(endpoint, {
  fetchOptions: {
    next: { revalidate: 10 }
  },
});

//--- FRAGMENTS ---

const PostFields = gql`
  fragment PostFields on Post {
    id
    title
    excerpt
    slug
    date
    content
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          height
          width
        }
      }
    }
    # Get all categories including children for display/filtering later
     allCategories: categories {
       nodes {
         id
         name
         slug
         parent {
           node {
             id
             slug
             name
           }
         }
       }
     }
    tags {
      nodes {
        name
        slug
        id
      }
    }
  }
`;

// FIXED: Simplified category fetching within RelatedPostFields to avoid schema error
const RelatedPostFields = gql`
  fragment RelatedPostFields on Post {
    id
    title
    slug
    date
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
            height
            width
        }
      }
    }
     # Get *all* associated categories for this post
     allCategories: categories {
       nodes {
         name
         slug
         parent {
            node {
                slug # Get parent slug to determine type
            }
         }
       }
     }
     # Get parent category slug explicitly for type determination
      parentCategories: categories(where: {parent: null}, first: 1) {
       nodes {
         slug
       }
     }
  }
`;

const PageInfoFields = gql`
  fragment PageInfoFields on PageInfo {
    endCursor
    hasNextPage
  }
`;

//--- QUERIES ---

const GET_POSTS_BY_CATEGORY_NAME = gql`
  query GetPostsByCategoryName($first: Int, $after: String, $categoryFilter: String!) {
    posts(
      first: $first
      after: $after
      where: { categoryName: $categoryFilter }
    ) {
      nodes {
        ...PostFields
      }
      pageInfo {
        ...PageInfoFields
      }
    }
  }
  ${PostFields}
  ${PageInfoFields}
`;

const GET_ALL_CATEGORIES_AND_TAGS = gql`
 query GetAllCategoriesAndTags {
    blogCategories: categories(where: { slug: ["blog"] }) {
      nodes {
        id
        children(first: 100) {
          nodes {
            id
            name
            slug
            count
          }
        }
      }
    }
    portfolioCategories: categories(where: { slug: ["portfolio"] }) {
     nodes {
        id
         children(first: 100) {
           nodes {
             id
             name
             slug
             count
           }
         }
      }
    }
  }
`;


const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...PostFields
      content
    }
  }
  ${PostFields}
`;

const GET_ALL_TAG_SLUGS = gql`
  query GetAllTagSlugs {
    tags(first: 1000) {
      nodes {
        slug
      }
    }
  }
`;

const GET_POSTS_BY_TAG_SLUG = gql`
  query GetPostsByTag($slug: String!) {
    posts(where: { tag: $slug }) {
      nodes {
        ...PostFields
      }
    }
    tag(id: $slug, idType: SLUG) {
      name
    }
  }
  ${PostFields}
`;

const GET_SLUGS_BY_PARENT_CATEGORY = gql`
  query GetSlugsByParentCategory($parentCategorySlug: String!) {
    posts(first: 1000, where: { categoryName: $parentCategorySlug }) {
      nodes {
        slug
      }
    }
  }
`;

// FIXED: Removed the unused $tagIn variable definition
const GET_RELATED_CONTENT = gql`
  query GetRelatedContent(
    $notIn: [ID!]
    $parentCategorySlug: String!
    $categoriesIn: [ID!] # Filter by sub-category IDs
  ) {
    posts(
      first: 3
      where: {
        notIn: $notIn
        categoryName: $parentCategorySlug
        categoryIn: $categoriesIn
      }
    ) {
      nodes {
        ...RelatedPostFields
      }
    }
  }
  ${RelatedPostFields}
`;


const SEARCH_POSTS = gql`
  query SearchPosts($search: String!) {
    posts(where: { search: $search }) {
      nodes {
        ...PostFields
      }
    }
  }
  ${PostFields}
`;

const QUERY_TIMEOUT = 8000; // 8 seconds

async function fetchWithTimeout(query, variables) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);

  try {
    // Override fetchOptions for this specific request to include the signal
    // Note: graphql-request v5+ supports passing signal in the client config or request
    // Since we are using a single client instance, we might need to recreate it or use a race if signal support is tricky.
    // However, recent Next.js fetch supports signal.
    // Let's use a Promise.race for guaranteed application-level timeout check first, 
    // effectively "aborting" our wait, even if the background fetch lingers (though we prefer true abort).

    // Attempting to pass signal via request config if supported, otherwise falling back to race logic
    // But for simpler implementation that definitely works:

    const requestPromise = client.request(query, variables);

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`WordPress API timed out after ${QUERY_TIMEOUT}ms`)), QUERY_TIMEOUT);
    });

    return await Promise.race([requestPromise, timeoutPromise]);

  } catch (error) {
    if (error.name === 'AbortError' || error.message.includes('timed out')) {
      console.error(`[TIMEOUT] Request took longer than ${QUERY_TIMEOUT}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

//--- API FUNCTIONS ---

export async function getBlogPosts(variables) {
  const { categorySlug, ...otherVariables } = variables;
  const categoryFilter = categorySlug || 'blog';

  try {
    const data = await fetchWithTimeout(GET_POSTS_BY_CATEGORY_NAME, {
      ...otherVariables,
      categoryFilter: categoryFilter,
    });
    console.log(`[SUCCESS] Fetched blog posts (Filter: ${categoryFilter}).`, data.posts.nodes.length, 'items');
    return data.posts;
  } catch (error) {
    console.error(`[ERROR] Error fetching blog posts (Filter: ${categoryFilter}):`, error);
    // FALLBACK: Return empty array so loading finishes
    return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}

export async function getPortfolioPosts(variables) {
  const { categorySlug, ...otherVariables } = variables;
  const categoryFilter = categorySlug || 'portfolio';

  try {
    const data = await fetchWithTimeout(GET_POSTS_BY_CATEGORY_NAME, {
      ...otherVariables,
      categoryFilter: categoryFilter,
    });
    console.log(`[SUCCESS] Fetched portfolio posts (Filter: ${categoryFilter}).`, data.posts.nodes.length, 'items');
    return data.posts;
  } catch (error) {
    console.error(`[ERROR] Error fetching portfolio posts (Filter: ${categoryFilter}):`, error);
    // FALLBACK: Return empty array
    return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}

export async function getFilterCategories() {
  try {
    const data = await client.request(GET_ALL_CATEGORIES_AND_TAGS);
    console.log('[SUCCESS] Fetched filter categories.');
    const blogSubCategories = data.blogCategories?.nodes[0]?.children?.nodes || [];
    const portfolioSubCategories = data.portfolioCategories?.nodes[0]?.children?.nodes || [];
    const filteredBlogSubs = blogSubCategories.filter(cat => cat.count > 0);
    const filteredPortfolioSubs = portfolioSubCategories.filter(cat => cat.count > 0);
    return { blogCategories: filteredBlogSubs, portfolioCategories: filteredPortfolioSubs };
  } catch (error) {
    console.error("[ERROR] Error fetching filter categories:", error);
    return { blogCategories: [], portfolioCategories: [] };
  }
}


export async function getPostBySlug(slug) {
  try {
    const data = await client.request(GET_POST_BY_SLUG, { slug });
    console.log(`[SUCCESS] Fetched post by slug: ${slug}`);
    return data.post;
  } catch (error) {
    console.error(`[ERROR] Error fetching post by slug: ${slug}`, error);
    return null;
  }
}

export async function getAllTagSlugs() {
  try {
    const data = await client.request(GET_ALL_TAG_SLUGS);
    console.log('[SUCCESS] Fetched all tag slugs.');
    return data.tags.nodes;
  } catch (error) {
    console.error("[ERROR] Error fetching all tag slugs:", error);
    return [];
  }
}
export async function getPostsByTagSlug(slug) {
  try {
    const data = await client.request(GET_POSTS_BY_TAG_SLUG, { slug });
    console.log(`[SUCCESS] Fetched posts for tag: ${slug}`);
    return { posts: data.posts.nodes, tagName: data.tag.name };
  } catch (error) {
    console.error(`[ERROR] Error fetching posts for tag: ${slug}`, error);
    return { posts: [], tagName: null };
  }
}

export async function getPortfolioSlugs() {
  try {
    const data = await client.request(GET_SLUGS_BY_PARENT_CATEGORY, {
      parentCategorySlug: 'portfolio',
    });
    console.log('[SUCCESS] Fetched all portfolio slugs.');
    return data.posts.nodes;
  } catch (error) {
    console.error("[ERROR] Error fetching all portfolio slugs:", error);
    return [];
  }
}

export async function getBlogSlugs() {
  try {
    const data = await client.request(GET_SLUGS_BY_PARENT_CATEGORY, {
      parentCategorySlug: 'blog',
    });
    console.log('[SUCCESS] Fetched all blog slugs.');
    return data.posts.nodes;
  } catch (error) {
    console.error("[ERROR] Error fetching all blog slugs:", error);
    return [];
  }
}

export async function getRelatedContent({ categoriesIn, currentPostId, postType }) {
  const parentCategorySlug = postType === 'portfolio' ? 'portfolio' : 'blog';

  const variables = {
    notIn: [currentPostId],
    parentCategorySlug: parentCategorySlug,
    categoriesIn: categoriesIn || [], // Ensure it's an array
  };

  try {
    // FIXED: Use the corrected GET_RELATED_CONTENT query
    const data = await client.request(GET_RELATED_CONTENT, variables);
    console.log(`[SUCCESS] Fetched related content for ${postType} based on subcategories.`);

    // Adjusting postType determination based on the updated RelatedPostFields
    const nodesWithType = data.posts.nodes.map(node => {
      // Find the parent category slug from allCategories
      const parentCat = node.allCategories?.nodes.find(cat => cat.parent === null);
      const derivedPostType = parentCat?.slug === 'portfolio' ? 'portfolio' : 'blog';
      // Find the first child category for display purposes
      const childCat = node.allCategories?.nodes.find(cat => cat.parent !== null);

      return {
        ...node, // Spread the original node data
        // Add simplified category info for the card
        displayCategory: childCat ? { name: childCat.name, slug: childCat.slug } : null,
        postType: derivedPostType
      };
    });
    return nodesWithType;
  } catch (error) {
    console.error("[ERROR] Error fetching related content:", error);
    return [];
  }
}


export async function getSearchResults(query) {
  try {
    const data = await client.request(SEARCH_POSTS, {
      search: query,
    });
    const filteredNodes = data.posts.nodes.filter(
      (post) => !(post.allCategories?.nodes.some((cat) => cat.slug === 'portfolio')) // Check against allCategories
    );
    console.log(`[SUCCESS] Fetched search results for "${query}".`);
    return filteredNodes;
  } catch (error) {
    console.error("[ERROR] Error fetching search results:", error);
    return [];
  }
}

