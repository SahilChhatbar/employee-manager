import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import type { LoginData, RegisterData, Employee } from "@/types/index";

export const authService = {
  async registerEmployee(
    data: RegisterData
  ): Promise<{ user: User; employee: Employee }> {
    try {
      const empIDExists = await this.checkEmpIDExists(data.empID);
      if (empIDExists) {
        throw new Error("Employee ID already exists");
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: data.name,
      });
      const employee: Employee = {
        uid: user.uid,
        name: data.name,
        email: data.email,
        empID: data.empID,
        createdAt: new Date(),
      };
      await setDoc(doc(db, "employees", user.uid), employee);
      return { user, employee };
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  },

  async loginEmployee(
    data: LoginData
  ): Promise<{ user: User; employee: Employee }> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;
      const employeeDoc = await getDoc(doc(db, "employees", user.uid));

      if (!employeeDoc.exists()) {
        throw new Error("Employee data not found");
      }

      const employee = employeeDoc.data() as Employee;

      return { user, employee };
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  },

  async logoutEmployee(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    }
  },

  async checkEmpIDExists(empID: string): Promise<boolean> {
    try {
      const employeesSnapshot = await import("firebase/firestore").then(
        ({ collection, query, where, getDocs }) =>
          getDocs(
            query(collection(db, "employees"), where("empID", "==", empID))
          )
      );

      return !employeesSnapshot.empty;
    } catch (error) {
      console.error("Error checking empID:", error);
      return false;
    }
  },

  async getCurrentEmployee(): Promise<Employee | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const employeeDoc = await getDoc(doc(db, "employees", user.uid));

      if (!employeeDoc.exists()) return null;

      return employeeDoc.data() as Employee;
    } catch (error) {
      console.error("Error getting current employee:", error);
      return null;
    }
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  },
  async updateEmployee(
    uid: string,
    data: { name?: string; email?: string; empID?: string }
  ): Promise<Employee> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      if (data.empID) {
        const empIDExists = await this.checkEmpIDExists(data.empID);
        if (empIDExists) throw new Error("Employee ID already exists");
      }

      const employeeRef = doc(db, "employees", uid);
      const employeeDoc = await getDoc(employeeRef);

      if (!employeeDoc.exists()) {
        throw new Error("Employee not found");
      }

      const currentEmployee = employeeDoc.data() as Employee;

      if (data.email && data.email !== currentEmployee.email) {
        try {
          await updateEmail(user, data.email);
        } catch (error: any) {
          if (error.code === "auth/requires-recent-login") {
            throw new Error(
              "Please log out and log back in before updating your email address"
            );
          }
          throw error;
        }
      }

      if (data.name) {
        await updateProfile(user, {
          displayName: data.name,
        });
      }
      const updatedEmployee = {
        ...currentEmployee,
        ...data,
      };

      await setDoc(employeeRef, updatedEmployee, { merge: true });

      return updatedEmployee as Employee;
    } catch (error: any) {
      throw new Error(error.message || "Update failed");
    }
  },

  async deleteEmployee(password: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("No authenticated user");

      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await import("firebase/firestore").then(({ deleteDoc }) =>
        deleteDoc(doc(db, "employees", user.uid))
      );
      await deleteUser(user);
    } catch (error: any) {
      throw new Error(error.message || "Delete failed");
    }
  },
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const employeesSnapshot = await import("firebase/firestore").then(
        ({ collection, getDocs }) => getDocs(collection(db, "employees"))
      );

      return employeesSnapshot.docs.map((doc) => doc.data() as Employee);
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      throw new Error(error.message || "Failed to fetch employees");
    }
  },
};

export default authService;
