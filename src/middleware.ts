// Этот код будет запускать перед началом выполнения каждой ручки(эндпоинта) моего сервиса
import { authMiddleware, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/'
]);

// Помощник clerkMiddleware включает аутентификацию и позволяет настраивать защищенные маршруты
export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  // Матчер запускает middleware промежуточное ПО на всех маршрутах, кроме статических.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};