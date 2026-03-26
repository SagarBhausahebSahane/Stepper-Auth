import FormController from "../FormController/FormController";

const Step3ProfileSetup = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-1">Profile Setup</h2>
      <p className="text-sm text-gray-500 mb-6">Almost there! Complete your profile</p>

      <FormController name="bio" type="text" label="Bio" placeholder="Tell us a little about yourself (10–200 chars)"/>
      <FormController name="website" type="text" label="Website (optional)" placeholder="https://yoursite.com"/>
      <FormController name="profileImage" type="file" label="Profile Image (optional, max 2MB)" accept="image/png,image/jpeg,image/jpg"/>
      <FormController name="agreeToTerms" type="checkbox" label="I agree to the Terms & Conditions"/>
    </div>
  );
};

export default Step3ProfileSetup;
