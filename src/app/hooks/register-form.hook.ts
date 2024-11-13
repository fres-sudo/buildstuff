"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpSchema = z.object({
	email: z.string().email(),
	fullName: z.string().min(1),
	password: z.string().min(6),
	role: z.string().min(1),
	workType: z.string().min(1),
	workspace: z.object({
		name: z.string().min(1),
		icon: z.string().url().optional(),
		invites: z.array(z.string().email()),
	}),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export default function useRegisterForm() {
	const [currentStep, setCurrentStep] = useState(1);

	const handleNext = useCallback(async () => {
		setCurrentStep((prev) => Math.min(prev + 1, 4));
	}, []);

	const handleBack = useCallback(() => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	}, []);

	const form = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
	});

	const onSubmit = useCallback(
		form.handleSubmit((data) => {
			console.log(data);
		}),
		[form]
	);

	const onEmailSubmit = useCallback(
		form.handleSubmit((data) => {
			console.log(data);
			handleNext();
		}),
		[form, handleNext]
	);

	return useMemo(
		() => ({
			form,
			handleNext,
			handleBack,
			currentStep,
			onSubmit,
		}),
		[form, handleNext, handleBack, currentStep, onSubmit]
	);
}
