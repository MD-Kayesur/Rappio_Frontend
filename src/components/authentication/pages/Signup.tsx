import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CiSquarePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]),
  image: z
    .any()
    .refine((file) => file, "Image is required")
    .optional(),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

const Signup = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();

  const onSubmit = (data: SignupFormInputs) => {
    // Simulate API call and success
    const userData = {
      name: data.name,
      email: data.email,
      role: data.role === "admin" ? "Admin" : "User",
      avatar: preview || ""
    };

    localStorage.setItem("user", JSON.stringify(userData));
    console.log("Registered User:", userData);

    // Redirect based on role
    if (data.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("image", file, { shouldValidate: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-950">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 dark:border dark:border-gray-800 p-6 rounded-lg shadow-md my-10">
        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">Signup</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Role Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              {...register("role")}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Picture
            </label>
            {/* input box  */}
            <div
              className="relative w-full h-36 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition bg-gray-50 dark:bg-gray-800"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                  <CiSquarePlus className="h-12 w-12" />
                  <p className="text-sm">Click to upload</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              className="hidden"
              onChange={handleImageChange}
            />
            {errors.image?.message &&
              typeof errors.image.message === "string" && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
