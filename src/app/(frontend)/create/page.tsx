"use client";

import Spinner from "@/components/custom/Spinner";
import { formControls, firebaseConfig, initialBlogFormData } from "@/utils";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { BlogFormData } from "@/utils/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
const app = initializeApp(firebaseConfig);
const stroage = getStorage(app, "gs://my-blog-e6bb8.appspot.com");

function createUniqueFileName(fileName: string) {
  const timeStamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 12);

  return `${fileName}-${timeStamp}-${randomString}`;
}

async function handleImageSaveToFireBase(file: any) {
  const extractUniqueFileName = createUniqueFileName(file?.name);
  const stroageRef = ref(stroage, `blog/${extractUniqueFileName}`);
  const uploadImg = uploadBytesResumable(stroageRef, file);
  return new Promise((resolve, reject) => {
    uploadImg.on(
      "state_changed",
      (snapshot) => {},
      (error) => reject(error),
      () => {
        getDownloadURL(uploadImg.snapshot.ref)
          .then((url) => resolve(url))
          .catch((error) => reject(error));
      }
    );
  });
}

export default function Create() {
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const { formData, setFormData } = useContext(GlobalContext);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  async function handleBlogImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!event.target.files) return;
    setImageLoading(true);
    const saveImageToFirebase: any = await handleImageSaveToFireBase(
      event.target.files[0]
    );

    if (saveImageToFirebase !== "") {
      setImageLoading(false);
      console.log(saveImageToFirebase, "saveImageToFirebase");
      setFormData({
        ...formData,
        image: saveImageToFirebase,
      });
    }
  }

  async function handleSaveBlogPost() {
    const res = await fetch("/api/blog/add-posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        userid: session?.user?.name,
        userimage: session?.user?.image,
        comments: [],
      }),
    });

    const data = await res.json();

    if (data && data.success) {
      setFormData(initialBlogFormData);
      router.push("/blogs");
    }
  }

  const [postData, setPostData] = useState<any>();
  useEffect(() => {
    if (postId) {
      getData();
    }
    async function getData() {
      const response = await fetch(`/api/blog/get-unique?id=${postId}`, {
        method: "GET",
        cache: "no-store",
      });
      const data = await response.json();
      setPostData(data.data);
    }
  }, [postId]);

  console.log(postData);

  return (
    <section className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mb-12 rounded-md bg-primary/[3%] py-10 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px] px-8">
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Create Your Own Blog Post
              </h2>
              <div>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <div className={`${imageLoading ? "w-1/2" : "w-full"}`}>
                      <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Upload Blog Image
                      </label>
                      <input
                        id="fileinput"
                        accept="image/*"
                        type="file"
                        onChange={handleBlogImageChange}
                        className="w-full mb-8 rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                      />
                    </div>
                    {imageLoading ? (
                      <div className="w-1/2">
                        <Spinner />
                      </div>
                    ) : null}
                  </div>
                  <div className="-mx-4 flex flex-wrap">
                    {formControls.map((control, index) => (
                      <div key={index} className="w-full px-4 mb-4">
                        <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          {control.label}
                        </label>
                        {control.component === "input" ? (
                          <input
                            type={control.type}
                            name={control.id}
                            placeholder={control.placeholder}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setFormData({
                                ...formData,
                                [control.id]: event.target.value,
                              });
                            }}
                            value={formData[control.id as keyof BlogFormData]}
                            className="w-full mb-8 rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                          />
                        ) : control.component === "textarea" ? (
                          <textarea
                            placeholder={control.placeholder}
                            rows={5}
                            cols={58}
                            name={control.id}
                            onChange={(
                              event: React.ChangeEvent<HTMLTextAreaElement>
                            ) => {
                              setFormData({
                                ...formData,
                                [control.id]: event.target.value,
                              });
                            }}
                            value={formData[control.id as keyof BlogFormData]}
                            className="w-full resize-none rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                          />
                        ) : control.component === "select" ? (
                          <select
                            name={control.id}
                            onChange={(
                              event: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                              setFormData({
                                ...formData,
                                [control.id]: event.target.value,
                              });
                            }}
                            value={formData[control.id as keyof BlogFormData]}
                            title={control.label} // Add title attribute with a descriptive name
                            className="w-full mb-8 rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                          >
                            <option id="" value={""}>
                              Select
                            </option>
                            {control.options.map((optionItem) => (
                              <option
                                id={optionItem.value}
                                value={optionItem.value}
                                key={optionItem.label}
                              >
                                {optionItem.label}
                              </option>
                            ))}
                          </select>
                        ) : null}
                      </div>
                    ))}
                    <div className="w-full px-4">
                      <Button onClick={handleSaveBlogPost}>
                        Create New Blog
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
