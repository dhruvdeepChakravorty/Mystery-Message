"use client"
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession(); // will only give info if session is active or not
  const user: User = session?.user; // The data we stored in session can be extracted only through user as it is stored in it only, useSession does not store data in session
  //we used session?.user as it was written in documentation

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className=" text-xl font-bold mb-4 md:mb-0" href="#">
          {" "}
          Mystery Message{" "}
        </a>
        {session ? (
          <>
            <span className="mr-4">Welcome {user?.username || user?.email}</span>
            <Button className="w-full md:w-auto" onClick={() => signOut()}>
              Sign out
            </Button>
          </>
        ) : (
          <Link href={"/sign-in"}>
            <Button className="w-full md:w-auto">Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
