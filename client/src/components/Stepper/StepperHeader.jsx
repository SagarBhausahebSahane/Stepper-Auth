const StepperHeader = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${isCompleted ? "bg-blue-600 border-blue-600 text-white" : ""}
                  ${isCurrent ? "bg-white border-blue-600 text-blue-600" : ""}
                  ${!isCompleted && !isCurrent ? "bg-gray-100 border-gray-300 text-gray-400" : ""}
                `}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span
                className={`text-xs mt-1 font-medium whitespace-nowrap
                  ${isCurrent ? "text-blue-600" : ""}
                  ${isCompleted ? "text-blue-400" : ""}
                  ${!isCompleted && !isCurrent ? "text-gray-400" : ""}
                `}
              >
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-all ${
                  isCompleted ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepperHeader;
