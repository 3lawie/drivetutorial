import React from "react";

export default function Home( props:{children:React.ReactNode}) {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background gradient with subtle violet */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />

      {/* Accent gradients with yellow, red, and violet */}
      <div className="absolute -left-20 top-1/3 h-[300px] w-[300px] rounded-full bg-amber-900/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-[250px] w-[250px] rounded-full bg-red-950/10 blur-3xl" />
      <div className="absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full bg-violet-950/10 blur-3xl" />
    {props.children}
    
    </div>
  )
}
