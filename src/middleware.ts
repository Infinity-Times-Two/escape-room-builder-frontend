import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: ['/', '/about', '/style-guide', '/play', '/sign-in', '/sign-up', '/api/user/user_2ckKf81PPGph1kkOu6e8EWnPf8m', `/api/createUser/user_test-12345`, '/api/user/no-user', '/api/games']
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)","/","/(api|trpc)(.*)"],
};