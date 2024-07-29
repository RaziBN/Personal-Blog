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
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, "gs://my-blog-e6bb8.appspot.com");

function createUniqueFileName(fileName: string) {
  const timeStamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 12);
  return `${fileName}-${timeStamp}-${randomString}`;
}

async function handleImageSaveToFirebase(file: File): Promise<string> {
  const uniqueFileName = createUniqueFileName(file.name);
  const storageRef = ref(storage, `blog/${uniqueFileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on("state_changed", null, reject, () => {
      getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
    });
  });
}

export default function Update() {
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const { formData, setFormData } = useContext(GlobalContext);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const handleBlogImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    setImageLoading(true);
    try {
      const fileUrl = await handleImageSaveToFirebase(event.target.files[0]);
      setFormData({ ...formData, image: fileUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleUpdateBlogPost = async () => {
    const res = await fetch(`/api/blog/update-posts`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        userid: session?.user?.name,
        userimage: session?.user?.image,
        comments: [],
        id: postId,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setFormData(initialBlogFormData);
      router.push("/blogs");
    } else {
      console.error("Failed to update blog post:", data.message);
    }
  };

  useEffect(() => {
    if (postId) {
      (async () => {
        const response = await fetch(`/api/blog/get-unique?id=${postId}`, {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json();
        if (data.success) {
          setFormData({
            title: data.data.title,
            description: data.data.description,
            category: data.data.category,
            image: data.data.image,
          });
        }
      })();
    }
  }, [postId, setFormData]);

  return (
    <section className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mb-12 rounded-md bg-primary/[3%] py-10 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px] px-8">
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Edit Your Blog Post
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
                    {formData.image && (
                      <Image
                        src={formData.image}
                        width={100}
                        height={100}
                        alt="Blog Image"
                      />
                    )}
                    {imageLoading && (
                      <div className="w-1/2">
                        <Spinner />
                      </div>
                    )}
                  </div>
                  <div className="-mx-4 flex flex-wrap">
                    {formControls.map((control, index) => (
                      <div key={index} className="w-full px-4 mb-4">
                        <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          {control.label}
                        </label>
                        {control.component === "input" && (
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
                        )}
                        {control.component === "textarea" && (
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
                        )}
                        {control.component === "select" && (
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
                            <option value="">Select</option>
                            {control.options.map((optionItem) => (
                              <option
                                key={optionItem.value}
                                value={optionItem.value}
                              >
                                {optionItem.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                    <div className="w-full px-4">
                      <Button onClick={handleUpdateBlogPost}>
                        Update Blog Post
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
