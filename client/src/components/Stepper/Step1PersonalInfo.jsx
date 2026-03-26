import FormController from "../FormController/FormController";

const Step1PersonalInfo = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-1">Personal Information</h2>
      <p className="text-sm text-gray-500 mb-6">Tell us about yourself</p>

      <div className="grid grid-cols-2 gap-4">
        <FormController name="firstName" type="text" label="First Name" placeholder="John" />
        <FormController name="lastName" type="text" label="Last Name" placeholder="Doe" />
      </div>

      <FormController name="email" type="email" label="Email Address" placeholder="john@example.com" />
      <FormController name="phone" type="text" label="Phone Number" placeholder="9876543210" />
    </div>
  );
};

export default Step1PersonalInfo;
