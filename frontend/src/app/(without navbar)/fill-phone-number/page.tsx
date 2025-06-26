import PhoneHeader from "@/components/phone-number/full-phone-header";
import PhoneNumberForm from "@/components/phone-number/phone-number-form";
import { getUsers } from "@/lib/auth/fetch-users";

const PhoneNumber = async () => {
  const users = await getUsers();

  return (
    <div className="text-neutral-50 flex flex-col h-screen">
      <PhoneHeader Phone={users.data.phone}/>
      <PhoneNumberForm />
    </div>
  );
};

export default PhoneNumber;
