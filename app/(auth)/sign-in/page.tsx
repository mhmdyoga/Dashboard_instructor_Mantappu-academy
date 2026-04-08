"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/src/hooks/auth/use-auth'
import { LoginSchema, LoginSchemaType } from '@/src/package/schema/auth/authSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import {useForm} from "react-hook-form"

const SignInPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const { login: LoginUser, isLogginIn: isLoggingIn } = useAuth()
    const { register, handleSubmit, formState: {errors} } = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            passwordHash: ''
        }
    });

    const onSubmit = async(data: LoginSchemaType) => {
        await LoginUser.mutateAsync(data);
    }
  return (
    <section className="w-full h-screen  flex flex-col bg-[url('/bg-hero.jpg')] bg-cover bg-center top-0 ">
      <div className="flex flex-col w-full h-screen items-center justify-center">

        <div className="">
          <Image src={"/logo-mantappu.svg"} alt="" width={100} height={100} className="w-30 h-30" priority/>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
         <div className="space-y-2">
          <Label htmlFor="email" className="text-black font-semibold">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="p-7 w-120 bg-white text-black rounded-full"
            disabled={isLoggingIn}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-black font-semibold">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                disabled={isLoggingIn}
                className="p-7 w-120 bg-white rounded-full text-black"
                {...register("passwordHash")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.passwordHash && (
              <p className="text-sm text-destructive">
                {errors.passwordHash.message}
              </p>
            )}
          </div>
          <Button type="submit" variant="default" className={"p-4 w-full h-auto rounded-full mt-4"}>Sign-in</Button>
        </form>
      </div>
    </section>
  )
}

export default SignInPage
