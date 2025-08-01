export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/dashboard",
    "/admin/list",
    "/admin/createBlog",
    "/admin/createProject",
    "/admin/publication/create",
    "/admin/contact/update",
    "/admin/editBlog",
    "/admin/editBlog/:title",
    "/admin/editProject",
    "/admin/editProject/:title",
  ],
};
