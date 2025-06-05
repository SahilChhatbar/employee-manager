import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import type { Employee } from "@/types";
import { authService } from "@/services/authServices";

export function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const allEmployees = await authService.getAllEmployees();
        setEmployees(allEmployees);
      } catch (err: any) {
        setError(err.message || "Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>All Employees ({employees.length})</span>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-destructive text-center py-4">{error}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.uid}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {employee.empID}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                </TableRow>
              ))}
              {employees.length === 0 && !loading && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground h-24"
                  >
                    No employees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
