import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Handler for POST requests from WordPress webhook
export async function POST(request) {
  // 1. Verify the secret token for security
  const secret = request.headers.get('x-revalidate-secret');
  const expectedSecret = process.env.REVALIDATION_TOKEN;

  console.log('[Revalidate] Received request.'); // Log incoming request

  if (!expectedSecret) {
      console.error('[Revalidate] REVALIDATION_TOKEN is not set in environment variables.');
      return NextResponse.json({ message: 'Server configuration error: Missing token' }, { status: 500 });
  }

  if (secret !== expectedSecret) {
    console.warn('[Revalidate] Invalid revalidation token received.');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
  console.log('[Revalidate] Token verified successfully.');

  // 2. Parse the request body sent from WordPress
  let payload;
  try {
    payload = await request.json();
    console.log('[Revalidate] Received payload:', JSON.stringify(payload, null, 2));
  } catch (error) {
    console.error('[Revalidate] Error parsing request body:', error);
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  // 3. Extract necessary information (slug and post type/category)
  //    IMPORTANT: The structure of 'payload' depends entirely on how your
  //    WordPress webhook (plugin or custom code) sends the data.
  //    Adjust the following lines based on the actual payload structure.
  //    Example Assumption: WordPress sends { "post_slug": "my-new-post", "post_categories": ["blog", "technology"] }
  //                      or { "post_slug": "my-portfolio-item", "post_categories": ["portfolio", "web-dev"] }

  const slug = payload?.post_slug; // Adjust field name if needed
  const categories = payload?.post_categories || []; // Get categories array

  // Determine post type (blog or portfolio) based on parent category
  let postType = null;
  if (categories.includes('blog')) {
      postType = 'blog';
  } else if (categories.includes('portfolio')) {
      postType = 'portfolio';
  }

  if (!slug || !postType) {
     console.warn('[Revalidate] Missing slug or unable to determine post_type (blog/portfolio) from categories in payload.', { slug, categories });
     // You might still want to revalidate list pages even if detail fails
     // return NextResponse.json({ message: 'Missing slug or post_type' }, { status: 400 });
  }

  // 4. Trigger revalidation using revalidatePath
  try {
    const pathsToRevalidate = [];

    // Revalidate detail page if slug and type are valid
    if (slug && postType) {
        const detailPath = `/${postType}/${slug}`;
        revalidatePath(detailPath);
        pathsToRevalidate.push(detailPath);
    }

    // Always revalidate list pages (blog and portfolio)
    const listPathBlog = '/blog';
    revalidatePath(listPathBlog);
    pathsToRevalidate.push(listPathBlog);

    const listPathPortfolio = '/portfolio';
    revalidatePath(listPathPortfolio);
    pathsToRevalidate.push(listPathPortfolio);


    // Always revalidate the homepage
    revalidatePath('/');
    pathsToRevalidate.push('/');

    console.log(`[Revalidate] Successfully triggered revalidation for paths: ${pathsToRevalidate.join(', ')}`);
    return NextResponse.json({ revalidated: true, paths: pathsToRevalidate, now: Date.now() });

  } catch (err) {
    console.error('[Revalidate] Error during revalidation process:', err);
    // Note: A 500 error here indicates an issue within Next.js revalidation itself
    return NextResponse.json({ message: 'Error during revalidation', error: err.message }, { status: 500 });
  }
}

// Optional: GET handler for testing the endpoint exists
export async function GET(request) {
    // You could add token verification here too for basic checks
    console.log('[Revalidate] Received GET request.');
    return NextResponse.json({ message: 'Revalidate API endpoint is active. Use POST method with correct token and payload.' });
}
