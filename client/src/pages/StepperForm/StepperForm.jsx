import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { step1Schema, step2Schema, step3Schema } from "../../schemas/formSchemas";
import StepperHeader from "../../components/Stepper/StepperHeader";
import Step1PersonalInfo from "../../components/Stepper/Step1PersonalInfo";
import Step2AccountDetails from "../../components/Stepper/Step2AccountDetails";
import Step3ProfileSetup from "../../components/Stepper/Step3ProfileSetup";
import { securePost } from "../../api/secureApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const stepSchemas = [step1Schema, step2Schema, step3Schema];
const stepLabels = ["Personal Info", "Account Details", "Profile Setup"];

const defaultValues = {
  firstName: "", lastName: "", email: "", phone: "",
  username: "", password: "", confirmPassword: "", role: "",
  bio: "", website: "", profileImage: undefined, agreeToTerms: false,
};

const StepperForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();
  const { user, markProfileComplete } = useAuth();
  const toast = useToast();

  const methods = useForm({
    resolver: zodResolver(stepSchemas[currentStep]),
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (user?.profileCompleted && user?.profileData) {
      methods.reset({
        ...defaultValues,
        ...user.profileData,
      });
    }
  }, [methods, user]);

  const { handleSubmit, trigger } = methods;

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) setCurrentStep((p) => p + 1);
    else toast.warning("Validation Error", "Please fix the errors before continuing.");
  };

  const handleBack = () => setCurrentStep((p) => p - 1);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const completeFormData = methods.getValues();
      const { confirmPassword, profileImage, ...payload } = completeFormData;
      const result = await securePost("/user/submit-form", payload);
      markProfileComplete(result.user.profileData);
      toast.success("Profile Submitted!", result.message || "Your profile has been saved.");
      setSubmitSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Submission failed. Please try again.";
      toast.error("Submission Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── SUCCESS ─────────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Complete!</h2>
          <p className="text-gray-500 mb-2">Your details were submitted securely using AES-256 encryption.</p>
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6 text-left">
            <p className="text-xs text-green-700 font-medium">🔐 Security Info</p>
            <p className="text-xs text-green-600 mt-1">Your Data is Safe With Our Platform Because it is end to end encrypted</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const steps = [Step1PersonalInfo, Step2AccountDetails, Step3ProfileSetup];
  const CurrentStepComponent = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📋</span>
            <h1 className="text-2xl font-bold text-gray-900">Registration Form</h1>
            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">🔐 AES Encrypted</span>
          </div>
          <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
        </div>

        <StepperHeader steps={stepLabels} currentStep={currentStep} />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CurrentStepComponent />

            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Back
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold transition flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Encrypting & Submitting...
                    </>
                  ) : (
                    "🔐 Submit Securely"
                  )}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default StepperForm;
