// src/portals/admin/pages/Settings.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "@components";

const settingsSchema = z.object({
  appName: z.string().min(1, "App name is required"),
  supportEmail: z.string().email("Invalid email"),
  sessionTimeout: z.number().min(5).max(1440),
  maxLoginAttempts: z.number().min(1).max(10),
});

type SettingsForm = z.infer<typeof settingsSchema>;

const Settings: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      appName: "Enterprise Portal",
      supportEmail: "support@company.com",
      sessionTimeout: 60,
      maxLoginAttempts: 5,
    },
  });

  const onSubmit = async (data: SettingsForm) => {
    // await adminService.updateSettings(data);
    console.log("Saved:", data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">General</h2>

          <Input
            label="Application Name"
            error={errors.appName?.message}
            {...register("appName")}
          />
          <Input
            label="Support Email"
            type="email"
            error={errors.supportEmail?.message}
            {...register("supportEmail")}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">Security</h2>
          <Input
            label="Session Timeout (minutes)"
            type="number"
            error={errors.sessionTimeout?.message}
            {...register("sessionTimeout", { valueAsNumber: true })}
          />
          <Input
            label="Max Login Attempts"
            type="number"
            error={errors.maxLoginAttempts?.message}
            {...register("maxLoginAttempts", { valueAsNumber: true })}
          />
        </div>

        <Button type="submit" loading={isSubmitting}>
          Save Settings
        </Button>
      </form>
    </div>
  );
};

export default Settings;
