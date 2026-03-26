import { useFormContext } from "react-hook-form";
const FormController = ({ name, type = "text", label, placeholder, accept, options = [], className = "", ...rest}) => {
  const {register,formState: { errors }} = useFormContext();

  const error = errors[name]?.message;

  const baseInput = "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition " + (error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white");

  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <select className={`${baseInput} ${className}`} {...register(name)} {...rest}>
            <option value="">-- Select --</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <input
              id={name}
              type="checkbox"
              className="w-4 h-4 accent-blue-600"
              {...register(name)}
              {...rest}
            />
            {label && (
              <label htmlFor={name} className="text-sm text-gray-700 cursor-pointer">
                {label}
              </label>
            )}
          </div>
        );

      case "file":
        return (
          <input
            type="file"
            accept={accept}
            className={`${baseInput} py-1.5 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 cursor-pointer ${className}`}
            {...register(name)}
            {...rest}
          />
        );

      default:
        return (
          <input
            type={type}
            placeholder={placeholder}
            className={`${baseInput} ${className}`}
            {...register(name)}
            {...rest}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      {label && type !== "checkbox" && (<label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>)}
      {renderInput()}
      {error && ( <p className="text-red-500 text-xs mt-1">{error}</p>)}
    </div>
  );
};

export default FormController;
