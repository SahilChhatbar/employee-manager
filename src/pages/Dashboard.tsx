import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const Dashboard = () => {
 
  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Employee Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => signOut(auth)}>Logout</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard