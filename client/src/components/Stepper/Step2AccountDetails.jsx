import FormController from "../FormController/FormController";

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

const Step2AccountDetails = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-1">Account Details</h2>
      <p className="text-sm text-gray-500 mb-6">Set up your account credentials</p>

      <FormController name="username" type="text" label="Username" placeholder="john_doe123"/>
      <FormController name="role" type="select" label="Role" options={roleOptions}/>
      <FormController name="password" type="password" label="Password" placeholder="Min 8 chars, 1 uppercase, 1 number"/>
      <FormController name="confirmPassword" type="password" label="Confirm Password" placeholder="Re-enter password"/>
    </div>
  );
};

export default Step2AccountDetails;
