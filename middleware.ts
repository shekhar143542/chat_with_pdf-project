import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        const authObject = await auth(); // ✅ Await the auth object

        if (!authObject.userId) {
            // ✅ Redirect to sign-in if user is not authenticated
            return authObject.redirectToSignIn();
        } 
    }
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search paramss
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};