'use client'
import { notFound, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Props {
  searchParams: { token: string; userId: string };
}

export default function Verify(props: Props) {
  const { token, userId } = props.searchParams;
  const router = useRouter()

  //verify token and userId

  useEffect(()=> {
    fetch('/api/users/verify',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({token, userId})
    }).then(async res =>{
        const apiRes = await res.json();

        const {error, message} = apiRes as {message: string; error: string};

        if(res.ok){
            console.log(message, 'mess')
            router.replace('/')
        }

        if(!res.ok && error){
            console.log(error, 'err')
        }
    })
  },[])

  if(!token || !userId) return notFound()
  console.log(props);
  return (
    <div className="text-3xl opacity-70 text-center p-5 animate-pulse">
      Please wait...
      <p>We are veryfying your email</p>
    </div>
  );
}
