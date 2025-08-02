import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth/actions"

export default function App() {
  return (
    <>
      <form action={signOut} >
        <Button type="submit">sign out</Button>
      </form>
    </>
  )
}
