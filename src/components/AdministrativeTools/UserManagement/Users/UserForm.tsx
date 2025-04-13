import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Role } from "@/types/user-management";
import { CheckedState } from "@radix-ui/react-checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserStore } from "@/hooks/stores/useUserStore";

interface UserFormProps {
  className?: string;
  roles?: Role[];
  forceShowPasswordInputs?: boolean;
  loading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  className,
  roles,
  forceShowPasswordInputs = true,
  loading,
}) => {
  const userStore = useUserStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showPasswordInputs, setShowPasswordInputs] = React.useState(false);

  const handleShowPasswordInputs = (checked: CheckedState) => {
    const value = showPasswordInputs ? undefined : "";
    setShowPasswordInputs(checked as boolean);
    userStore.set("password", value);
    userStore.set("confirmPassword", value);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* General information */}
      <div className="my-2 flex flex-col gap-2">
        <h1 className="text-lg my-2 font-bold">General Information</h1>
        {/* firstName */}
        <div>
          <Label>Firstname</Label>
          <div className="mt-1">
            <Input
              placeholder="Ex. John"
              value={userStore.firstName || undefined}
              onChange={(e) => {
                userStore.set("firstName", e.target.value);
                userStore.resetError("firstName");
              }}
            />
            {userStore.errors.firstName?.[0] && (
              <span className="text-red-500 leading-0 text-xs mt-1 leading-3">
                {userStore.errors.firstName?.[0]}
              </span>
            )}
          </div>
        </div>
        {/* lastName */}
        <div>
          <Label>Lastname</Label>
          <div className="mt-1">
            <Input
              placeholder="Ex. Doe"
              value={userStore.lastName || undefined}
              onChange={(e) => {
                userStore.set("lastName", e.target.value);
                userStore.resetError("lastName");
              }}
            />
            {userStore.errors.lastName?.[0] && (
              <span className="text-red-500 leading-0 text-xs mt-1 leading-3">
                {userStore.errors.lastName?.[0]}
              </span>
            )}
          </div>
        </div>
        {/* email */}
        <div>
          <Label>E-Mail (*)</Label>
          <div className="mt-1">
            <Input
              type="email"
              placeholder="Ex. This is awesome!"
              value={userStore.email || undefined}
              onChange={(e) => {
                userStore.set("email", e.target.value);
                userStore.resetError("email");
              }}
              autoComplete="off"
            />
          </div>
          {userStore.errors.email?.[0] && (
            <span className="text-red-500 leading-0 text-xs mt-1 leading-3">
              {userStore.errors.email?.[0]}
            </span>
          )}
        </div>
        {/* dateOfBirth */}
        <div>
          <Label>Date of Birth</Label>
          <div className="w-full mt-2">
            <DatePicker
              className="w-full"
              value={
                (userStore?.dateOfBirth && new Date(userStore.dateOfBirth)) ||
                undefined
              }
              onChange={(value: Date | null) => {
                userStore.set("dateOfBirth", value);
                userStore.resetError("dateOfBirth");
              }}
              nullable
            />
            {userStore.errors.dateOfBirth?.[0] && (
              <span className="text-red-500 leading-0 text-xs mt-1 leading-3">
                {userStore.errors.dateOfBirth?.[0]}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Account Information */}
      <div className="my-2 flex flex-col gap-2">
        <h1 className="text-lg mt-4 mb-2 font-bold">Account Information</h1>
        {/* username */}
        <div>
          <Label>Username (*)</Label>
          <div className="mt-1">
            <Input
              placeholder="Ex. Awesome Administrator"
              value={userStore.username || undefined}
              onChange={(e) => {
                userStore.set("username", e.target.value);
                userStore.resetError("username");
              }}
            />
            {userStore.errors.username?.[0] && (
              <span className="text-red-500 leading-3 text-xs mt-1">
                {userStore.errors.username?.[0]}
              </span>
            )}
          </div>
        </div>
        {!forceShowPasswordInputs && (
          <div className="items-top flex space-x-2 my-4">
            <Checkbox
              id="show-password-inputs"
              checked={showPasswordInputs}
              onCheckedChange={handleShowPasswordInputs}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="show-password-inputs"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Update User Password
              </label>
              <span className="text-sm text-muted-foreground">
                Check this option if you want to change{" "}
                <span className="opacity-70">
                  {userStore.lastName} {userStore.firstName}
                </span>
                &apos;s password
              </span>
            </div>
          </div>
        )}
        {(forceShowPasswordInputs || showPasswordInputs) && (
          <div>
            <Label>New Password</Label>
            <div className="mt-1">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                  value={userStore.password || undefined}
                  onChange={(e) => {
                    userStore.set("password", e.target.value);
                    userStore.resetError("password");
                  }}
                  autoComplete="new-password"
                />
                <Button
                  onClick={() => setShowPassword(!showPassword)}
                  variant={"link"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
                {userStore.errors.password?.[0] && (
                  <span className="text-red-500 leading-0 text-xs mt-1 leading-3">
                    {userStore.errors.password?.[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {(forceShowPasswordInputs || showPasswordInputs) && (
          <div>
            <Label>Confirm Password</Label>
            <div className="mt-1">
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="pr-10"
                  value={userStore.confirmPassword}
                  onChange={(e) => {
                    userStore.set("confirmPassword", e.target.value);
                    userStore.resetError("confirmPassword");
                  }}
                  autoComplete="new-password"
                />
                <Button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  variant={"link"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>
                {userStore.errors.confirmPassword?.[0] && (
                  <span className="text-red-500 leading-0 text-xs mt-1 leading-3">
                    {userStore.errors.confirmPassword?.[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* role */}
        <div>
          <Label>Role (*)</Label>
          <div className="w-full mt-1">
            <Select
              onValueChange={(value) => {
                userStore.set("roleId", parseInt(value));
                userStore.resetError("roleId");
              }}
              value={userStore.roleId?.toString() || ""}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Role..." />
              </SelectTrigger>
              <SelectContent>
                {roles?.map((role: Partial<Role>) => (
                  <SelectItem
                    key={role.id}
                    value={role.id?.toString() || ""}
                    className="mx-1"
                  >
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {userStore.errors.roleId?.[0] && (
              <span className="text-red-500 leading-0 text-xs mt-1 leading-3">
                {userStore.errors.roleId?.[0]}
              </span>
            )}
          </div>
        </div>
        {/* require password */}
        <div className="items-top flex space-x-2 my-2">
          <Checkbox id="force-password-change" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="force-password-change"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Require Password Update
            </label>
            <span className="text-sm text-muted-foreground">
              Users will be prompted to update their password on their next
              login.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
