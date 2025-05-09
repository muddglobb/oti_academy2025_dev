import React from 'react'
import Image from 'next/image'
import { UsersType } from "@/types/users-type";
import { getUsers } from "@/lib/fetch-users";

// type UserData = {
//   name: string;
//   avatar: string;
// }
// const WelcomeCard = ({ data }: { data: UserData }) => {
export async function WelcomeCard(){
  // const {name} = data;
  const users: UsersType = await getUsers();
  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
            <p className="text-sm text-gray-400">Home</p>
          </div>
          
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg mb-6 flex justify-between relative overflow-hidden">
            <div className='p-4'>
              <h2 className="text-xl mb-2">Welcome to Our Academy,</h2>
              {/* <h1 className="text-2xl font-bold mb-4">{name}!</h1> */}
              <h1 className="text-2xl font-bold mb-4">{users.data.name}!</h1>
              <p className="text-sm text-gray-300 max-w">
                Siap-siap untuk transformasi seru dan setiap programmu akan kita rayakan bersama!
              </p>
            </div>
            <div className='self-end'>
              <Image 
                src="/images/planet/bumi-dashboard.webp" 
                alt="Earth" 
                width={336}
                height={289}
                className="self-end"
              />
            </div>
          </div>
    </div>
  )
}

// export default WelcomeCard