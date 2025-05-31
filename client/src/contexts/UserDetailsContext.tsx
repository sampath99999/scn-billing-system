import type { User } from "@/types/User";
import { createContext } from "react";

export const UserDetailsContext = createContext<User | null>(null);
