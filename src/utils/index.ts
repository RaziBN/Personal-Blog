import { FormControlItem, menuItem, Option } from "./types";

export const menuItems: menuItem[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
  },
  {
    id: "blogs",
    label: "Blogs",
    path: "/blogs",
  },
  {
    id: "category",
    label: "Category",
    path: "/category",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
  },
];

export const categories: Option[] = [
  {
    value: "application",
    label: "Application",
  },
  {
    value: "data",
    label: "Data",
  },
  {
    value: "software",
    label: "Software",
  },
  {
    value: "tech",
    label: "Technology",
  },
  {
    value: "science",
    label: "Science",
  },
];
export const formControls: FormControlItem[] = [
  {
    id: "title",
    label: "Title",
    placeholder: "Enter Blog Title",
    type: "text",
    component: "input",
    options: [],
  },
  {
    id: "description",
    label: "Description",
    placeholder: "Enter Blog Description",
    type: "text",
    component: "textarea",
    options: [],
  },
  {
    id: "category",
    label: "Category",
    placeholder: "Choose Blog Category",
    type: "",
    component: "select",
    options: categories,
  },
];
export const firebaseConfig = {
  apiKey: "AIzaSyBuFevYku5EferhxLz8ShSxjImq5gY1JK0",
  authDomain: "my-blog-e6bb8.firebaseapp.com",
  projectId: "my-blog-e6bb8",
  storageBucket: "my-blog-e6bb8.appspot.com",
  messagingSenderId: "314089653970",
  appId: "1:314089653970:web:0cdb87f521a8ac01444f0b",
  measurementId: "G-Q8F1D6CQ90",
};

export const initialBlogFormData = {
  title: "",
  description: "",
  image: "",
  category: "",
};
