import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Page404 = () => {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/')
  }, [router])

  return null
}

export default Page404