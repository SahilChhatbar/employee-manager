import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { authService } from "../services/authServices";
import {
  Loader2,
  User,
  Mail,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  IdCard,
} from "lucide-react";
import type { Employee } from "../types/index";
import { EmployeeTable } from "@/components/EmployeeTable";

const Dashboard = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState("");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [updateForm, setUpdateForm] = useState({
    name: "",
    email: "",
    empID: "",
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const currentEmployee = await authService.getCurrentEmployee();
        if (currentEmployee) {
          setEmployee(currentEmployee);
          setUpdateForm({
            name: currentEmployee.name,
            email: currentEmployee.email,
            empID: currentEmployee.empID,
          });
        } else {
          setError("Employee data not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch employee data");
      }
    };
    fetchEmployeeData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!employee) return;
    setUpdating(true);
    try {
      const updatedEmployee = await authService.updateEmployee(employee.uid, {
        name: updateForm.name,
        email: updateForm.email,
        empID: updateForm.empID,
      });
      setEmployee(updatedEmployee);
      setIsUpdateDialogOpen(false);
      console.log("Profile updated successfully!");
    } catch (err: any) {
      console.log(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
    {  ("Please enter your password");}
      return;
    }
    setDeleting(true);
    try {
      await authService.deleteEmployee(deletePassword);
      {("Account deleted successfully");}
    } catch (err: any) {
      (err.message || "Failed to delete account");
      setDeleting(false);
    }
  };

  const resetUpdateForm = () => {
    if (employee) {
      setUpdateForm({
        name: employee.name,
        email: employee.email,
        empID: employee.empID,
      });
    }
  };

  const resetDeleteForm = () => {
    setDeletePassword("");
    setShowPassword(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => signOut(auth)} variant="outline">
          Return to Login
        </Button>
        <button className="text-red-400 text-3xl"></button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 max-w-4xl mx-auto">
      <div className="flex flex-col justify-between items-start gap-4 pb-4">
        <div className="flex flex-row justify-between items-center w-full pb">
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <Button
            onClick={() => signOut(auth)}
            variant="outline"
            className="text-red-500"
          >
            Logout
          </Button>
        </div>
        <p className="text-muted-foreground">Welcome back, {employee?.name}!</p>
      </div>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            Employee Information
          </CardTitle>
          <div className="flex gap-2">
            <Dialog
              open={isUpdateDialogOpen}
              onOpenChange={setIsUpdateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={resetUpdateForm}>
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-80">
                <DialogHeader>
                  <DialogTitle>Update Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile information here.
                  </DialogDescription>
                </DialogHeader>
                <Label className="flex flex-col items-start">
                  Full Name
                  <Input
                    id="update-name"
                    value={updateForm.name}
                    onChange={(e) =>
                      setUpdateForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                  />
                </Label>
                <Label className="flex flex-col items-start">
                  Email Address
                  <Input
                    id="update-email"
                    type="email"
                    value={updateForm.email}
                    onChange={(e) =>
                      setUpdateForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Enter your email address"
                  />
                </Label>
                <Label className="flex flex-col items-start">
                  Employee ID
                  <Input
                    id="update-empid"
                    value={updateForm.empID}
                    onChange={(e) =>
                      setUpdateForm((prev) => ({
                        ...prev,
                        empID: e.target.value,
                      }))
                    }
                    placeholder="Enter your employee ID"
                  />
                </Label>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsUpdateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateProfile} disabled={updating}>
                    {updating && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Update Profile
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={resetDeleteForm}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and remove all
                    associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-2 py-4">
                  <Label htmlFor="delete-password">
                    Confirm with your password
                  </Label>
                  <Input
                    id="delete-password"
                    type={showPassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your password to confirm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={resetDeleteForm}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleting && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <span className="flex flex-row items-center gap-0.5">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Full Name</p>
            </span>
            <p className="font-medium">{employee?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex flex-row items-center gap-1">
              <IdCard className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Employee ID</p>
            </span>
            <Badge variant="secondary" className="font-mono">
              {employee?.empID}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex flex-row items-center gap-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Email Address</p>
            </span>
            <p className="font-medium">{employee?.email}</p>
          </div>
        </CardContent>
      </Card>
      <EmployeeTable />
    </div>
  );
};

export default Dashboard;
