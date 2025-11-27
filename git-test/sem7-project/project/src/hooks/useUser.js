import { useEffect, useState } from "react"

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const match = document.cookie.match(/userId=(?<id>[^;]+)/)
    const id = match?.groups?.id
    console.log("🔍 Fetching user from cookie:", id)

    if (id) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/users/${id}`, {
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          console.log("✅ User fetched:", data)
          setUser({ ...data, id: data._id }) // 🔄 add this
        })
        .catch(err => {
          console.error("❌ Failed to fetch user:", err)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  return { user, loading }
}