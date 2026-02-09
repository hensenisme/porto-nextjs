import { NextResponse } from 'next/server';
// Import function names from lib/wordpress
import { getBlogPosts, getPortfolioPosts } from '@/lib/wordpress';

export async function GET(request) {
  console.log('[API /api/posts] Received GET request'); // Log saat API dipanggil
  try {
    // FIXED: Use request.nextUrl.searchParams instead of new URL(request.url)
    const searchParams = request.nextUrl.searchParams;

    // Extract parameters using the correct method
    const postType = searchParams.get('type');
    const after = searchParams.get('after');
    const firstParam = searchParams.get('first');
    const first = firstParam ? parseInt(firstParam, 10) : 6; // Default ke 6 jika tidak ada
    const categorySlug = searchParams.get('category') || null;

     // Log parameter yang diterima
     console.log(`[API /api/posts] Params - type: ${postType}, after: ${after}, first: ${first}, category: ${categorySlug}`);


    let data;

    // Pass categorySlug to functions
    if (postType === 'blog') {
      data = await getBlogPosts({ first, after, categorySlug });
    } else if (postType === 'portfolio') {
      data = await getPortfolioPosts({ first, after, categorySlug });
    } else {
      console.warn('[API /api/posts] Invalid post type requested:', postType);
      return NextResponse.json({ error: 'Invalid post type' }, { status: 400 });
    }

     // Log hasil data (opsional, bisa sangat verbose)
     // console.log(`[API /api/posts] Data fetched for type ${postType}:`, data?.nodes?.length || 0, 'items');

    return NextResponse.json(data);
  } catch (error) {
    // Log error lebih detail
    console.error('[API /api/posts] Error processing request:', error);
     // Sertakan detail error jika memungkinkan (hati-hati dengan info sensitif)
    let errorMessage = 'Failed to fetch posts';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage, details: error.toString() }, { status: 500 });
  }
}