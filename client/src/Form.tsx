import { set, useForm } from "react-hook-form";
import RadioBox from "./RadioBox";
import TextArea from "./TextArea";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { useDispatch } from "react-redux";
import { getNewVideo, setVideoFilename, setVideoID } from "./state/videoState";

const serverUrlBase = import.meta.env.VITE_SERVER_URL;

export interface FormData {
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    option5: string;
    text: string;
}

export type RegisterName = keyof FormData;

export default function Form() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>(); // { shouldFocusError: false }

    const videoID = useSelector((state: RootState) => state.videoState.id);
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = async (data: FormData) => {
        console.log("data to POST", data);
        const pSpinner = document.getElementById("p-spinner");
        if (pSpinner) {
            pSpinner.innerText = "Uploading annotation...";
        }
        toast.promise(
            fetch(serverUrlBase + "/api/v1/video/" + videoID, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then(async (res) => {
                const jsonData = await res.json();
                if (!res.ok) {
                    throw new Error(
                        "An error occurred while submitting the form."
                    );
                }

                if (res.status === 201) {
                    console.log("annotation submitted successfully", jsonData);
                    dispatch(setVideoID(""));
                    dispatch(setVideoFilename(""));
                    dispatch(getNewVideo());
                    reset();
                    return "Annotation submitted successfully!";
                } else {
                    console.log(
                        "An error occurred while submitting the form.",
                        jsonData
                    );
                    throw new Error(
                        "An error occurred while submitting the form."
                    );
                }
            }),
            {
                loading: "Loading...",
                success: "Annotation submitted successfully!",
                error: "An error occurred while submitting the form.",
            }
        );
        //reset();
    };

    return (
        <>
            <Toaster position="bottom-center" reverseOrder={false} />
            <div
                id="blocker"
                className="fixed left-0 top-0 w-screen h-screen backdrop-blur hidden"
            >
                <div className="flex flex-col justify-center items-center h-full">
                    {/* <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div> */}
                    <svg
                        className="spinner animate-rotate size-[100px]"
                        viewBox="0 0 50 50"
                    >
                        <circle
                            className="path animate-dash"
                            cx="25"
                            cy="25"
                            r="20"
                            fill="none"
                            strokeWidth="4"
                            strokeLinecap="round"
                        ></circle>
                    </svg>
                    <p id="p-spinner" className="mt-5 font-bold text-2xl">Loading next video...</p>
                    {/* <p className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-black pr-5 text-5xl font-bold">
                        Loading . . .
                    </p> */}
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <RadioBox
                    register={register}
                    registerName={"option1"}
                    errors={errors}
                    label="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet, architecto!"
                    options={["Option1", "Option2", "Option3"]}
                />
                <RadioBox
                    register={register}
                    registerName={"option2"}
                    errors={errors}
                    label="Doloribus saepe id non illo ad eius sed minus corrupti facere beatae."
                    options={["Option2A", "Option2B", "Option2C"]}
                />
                <RadioBox
                    register={register}
                    registerName={"option3"}
                    errors={errors}
                    label="Ratione cupiditate modi consequuntur sapiente blanditiis repellat similique error nihil numquam non soluta sit perferendis sint quis, itaque recusandae illo, quam facilis molestias voluptate repudiandae quae! Consequatur."
                    options={["Option3A", "Option3B", "Option3C"]}
                />
                <RadioBox
                    register={register}
                    registerName={"option4"}
                    errors={errors}
                    label="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse accusamus natus pariatur nulla eligendi tempora."
                    options={["Option4A", "Option4B", "Option4C"]}
                />
                <RadioBox
                    register={register}
                    registerName={"option5"}
                    errors={errors}
                    label="Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis quibusdam repellendus eligendi."
                    options={["Option5A", "Option5B", "Option5C"]}
                />
                <TextArea
                    register={register}
                    registerName={"text"}
                    errors={errors}
                    label="Free description"
                    nameInRequired="free"
                    minLength={50}
                />

                <div className="btnContainer">
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="btn"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </>
    );
}
