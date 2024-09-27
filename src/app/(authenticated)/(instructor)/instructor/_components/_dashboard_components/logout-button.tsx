'use client'
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logoutInstructor } from "@/lib/api-helper/auth";

const LogoutButton = () => {
    return ( 
        <DropdownMenuItem onClick={()=>logoutInstructor()}>Logout</DropdownMenuItem> );
}
 
export default LogoutButton;