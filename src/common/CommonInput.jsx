import { Upload, X } from "lucide-react";
import Image from "./Image";

export const InputField = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  showLabel = true,
}) => {
  return (
    <div>
      {showLabel && name && (
        <label className="block mb-1 text-gray-500 capitalize">
          Enter your {name.replace(/([A-Z])/g, " $1")}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none"
      />
    </div>
  );
};


export const SingleImageUpload = ({
  preview,
  onUpload,
  onRemove,
  inputId = "profile-photo",
  label = "Upload Profile Photo",
}) => {
  return (
    <div className="space-y-3">
      <div className="border-dashed border-2 p-4 rounded-lg text-center">
        <input
          type="file"
          name="profilePhoto"     
          accept="image/*"
          className="hidden"
          id={inputId}
          onChange={onUpload}
        />

        <label
          htmlFor={inputId}
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload />
          <span>{label}</span>
        </label>
      </div>

      {preview && (
        <div className="relative w-24 h-24 mx-auto">
          <Image
            src={preview}
            className="w-full h-full rounded-full object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};





export const ImageUpload = ({
  label = "Upload Images",
  multiple = true,
  accept = "image/*",
  previews = [],
  onUpload,
  onRemove,
  inputId,
}) => {
  return (
    <>
      <div className="border-dashed border-2 p-4 rounded-lg text-center">
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          id={inputId}
          onChange={onUpload}
        />
        <label
          htmlFor={inputId}
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload />
          <span>{label}</span>
        </label>
      </div>

      {previews?.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          {previews.map((img, i) => (
            <div key={i} className="relative w-full aspect-square">
              <Image
                src={img}
                className="w-full h-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};