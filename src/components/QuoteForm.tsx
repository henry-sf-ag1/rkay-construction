"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle, AlertCircle, Upload } from "lucide-react";
import type { QuoteFormConfig } from "@/types";

interface QuoteFormProps {
  email: string;
  quoteForm: QuoteFormConfig;
}

export default function QuoteForm({ email, quoteForm }: QuoteFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [files, setFiles] = useState<FileList | null>(null);

  const fields = quoteForm.fields ?? {};
  const nameField = fields.name;
  const emailField = fields.email;
  const phoneField = fields.phone;
  const projectTypeField = fields.projectType;
  const descriptionField = fields.description;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      if (files && files.length > 0) {
        const fileNames = Array.from(files).map((f) => f.name).join(", ");
        formData.append("_attached_files", fileNames);
      }
      const res = await fetch("/api/quote", { method: "POST", body: formData });
      if (res.ok) { setStatus("success"); form.reset(); setFiles(null); }
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section id="quote" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-primary mb-4">Quote Request Received!</h2>
          <p className="text-lg text-gray-600 mb-8">{quoteForm.successMessage}</p>
          <button onClick={() => setStatus("idle")} className="text-primary underline hover:no-underline font-medium">
            Submit another enquiry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2">{quoteForm.title}</h2>
          <div className="w-16 h-1 bg-accent mx-auto mb-6" />
          <p className="text-gray-600">{quoteForm.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {nameField?.show && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {nameField.label}{nameField.required && " *"}
                </label>
                <input
                  type="text" id="name" name="name"
                  required={nameField.required}
                  placeholder={nameField.placeholder ?? ""}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            )}
            {emailField?.show && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {emailField.label}{emailField.required && " *"}
                </label>
                <input
                  type="email" id="email" name="email"
                  required={emailField.required}
                  placeholder={emailField.placeholder ?? ""}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            )}
          </div>

          {/* Phone & Project Type row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {phoneField?.show && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {phoneField.label}{phoneField.required && " *"}
                </label>
                <input
                  type="tel" id="phone" name="phone"
                  required={phoneField.required}
                  placeholder={phoneField.placeholder ?? ""}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            )}
            {projectTypeField?.show && (
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                  {projectTypeField.label}{projectTypeField.required && " *"}
                </label>
                <select
                  id="projectType" name="projectType"
                  required={projectTypeField.required}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                >
                  <option value="">Select a project type</option>
                  {quoteForm.projectTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Description */}
          {descriptionField?.show && (
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                {descriptionField.label}{descriptionField.required && " *"}
              </label>
              <textarea
                id="description" name="description" rows={5}
                required={descriptionField.required}
                placeholder={descriptionField.placeholder ?? ""}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-vertical"
              />
            </div>
          )}

          {/* File upload */}
          {quoteForm.showFileUpload && (
            <div>
              <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Plans / Drawings (optional)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-accent transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file" id="files" name="attachment" multiple
                  accept=".pdf,.jpg,.jpeg,.png,.dwg"
                  onChange={(e) => setFiles(e.target.files)}
                  className="hidden"
                />
                <label htmlFor="files" className="cursor-pointer text-sm text-gray-600">
                  <span className="text-primary font-medium hover:underline">Click to upload</span>{" "}
                  or drag and drop
                  <br />
                  <span className="text-xs text-gray-400">PDF, JPG, PNG, DWG — Multiple files allowed</span>
                </label>
                {files && files.length > 0 && (
                  <p className="mt-3 text-sm text-primary font-medium">
                    {files.length} file{files.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Error message */}
          {status === "error" && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">
                Something went wrong. Please try again or email us directly at{" "}
                <a href={`mailto:${email}`} className="underline">{email}</a>
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-primary text-white font-semibold py-4 px-8 rounded-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {status === "sending" ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {quoteForm.buttonText ?? "Request a Quote"}
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
