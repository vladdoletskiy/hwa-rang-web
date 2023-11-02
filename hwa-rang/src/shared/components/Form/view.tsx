import React from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";

import formAPI from "data/form.json";

import { GradientText } from "../GradientText";
import { FormSchema } from "./types";
import {
  NameInput,
  SubmitButton,
  ServiceInput,
  HallInput,
  ForInput,
  AgeInput,
  HowToConnect,
  LocationInfo,
} from "./components";

export const Form: React.FC<{
  methods: UseFormReturn<FormSchema>;
}> = ({ methods }) => {
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (rawData: FormSchema) => {
    if (loading) {
      return;
    }

    const formData = new URLSearchParams();

    Object.entries(rawData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        return formData.append(key, value.join(", "));
      }
      formData.append(key, value);
    });

    try {
      setLoading(true);
      await fetch(formAPI.action, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": formAPI["content-type"] },
      });
      setSubmitted(true);
    } catch (e) {
      if (e instanceof Error) {
        toast(`Не вдалося надіслати форму: ${e.message}`, {
          position: "bottom-center",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:pl-0 pl-9 lg:pb-0 pb-7 bg-background">
      <div className="lg:block flex">
        <form
          id="form"
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="bg-white [&_input]:placeholder:text-gray-400 [&_input]:placeholder:opacity-100 lg:min-w-0 min-w-[605px] sm:px-5 tablet:px-[30px] px-[46px] lg:pt-[61px] pt-[46px] lg:pb-[55px] pb-[46px] flex flex-col [&_.MuiInputLabel-shrink]:opacity-0 [&_.MuiInput-root]:h-[29px] [&_.MuiInputBase-root]:mt-0 [&_input]:text-gray-400"
        >
          <GradientText className="lg:mb-[42px] mb-[39px] lg:whitespace-normal whitespace-nowrap">
            Запишись <span className="whitespace-nowrap">на тренування</span>
          </GradientText>
          <div className="lg:w-full w-[328px]">
            <NameInput />
            <ServiceInput />
            <HallInput />
            <ForInput />
            <AgeInput />
            <HowToConnect />
            <SubmitButton loading={loading} />
          </div>
        </form>
        <LocationInfo />
      </div>
      <Dialog open={submitted} fullScreen></Dialog>
    </div>
  );
};
